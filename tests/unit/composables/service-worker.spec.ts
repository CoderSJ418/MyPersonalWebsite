import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useServiceWorker } from '@/composables/useServiceWorker'

const { logger } = vi.hoisted(() => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}))

vi.mock('@/utils/logger', () => ({ logger }))

const createWorker = () => {
  const events = new EventTarget()
  return {
    worker: {
      state: 'installing',
      addEventListener: events.addEventListener.bind(events),
      postMessage: vi.fn()
    },
    dispatchState(state: string) {
      this.worker.state = state
      events.dispatchEvent(new Event('statechange'))
    }
  }
}

const mountServiceWorker = () => {
  let api: ReturnType<typeof useServiceWorker> | undefined
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useServiceWorker()
        return () => h('div')
      }
    })
  )
  return { api, wrapper }
}

const createRegistration = () => {
  const events = new EventTarget()
  const installing = createWorker()
  const waiting = createWorker()
  const active = createWorker()
  return {
    registration: {
      active: active.worker,
      addEventListener: events.addEventListener.bind(events),
      installing: installing.worker,
      unregister: vi.fn(async () => true),
      waiting: waiting.worker
    },
    active,
    dispatchUpdate() {
      events.dispatchEvent(new Event('updatefound'))
    },
    installing,
    waiting
  }
}

describe('service worker management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'PushManager', { configurable: true, value: class {} })
    Object.defineProperty(globalThis, 'caches', {
      configurable: true,
      value: { delete: vi.fn(), keys: vi.fn(async () => []), open: vi.fn() }
    })
  })

  it('reports unsupported browsers without attempting registration', async () => {
    Reflect.deleteProperty(navigator, 'serviceWorker')
    Reflect.deleteProperty(window, 'PushManager')
    const { api, wrapper } = mountServiceWorker()

    await expect(api?.register()).resolves.toBeNull()
    expect(api?.status.value.isSupported).toBe(false)
    expect(api?.status.value.error).toContain('Service Worker')
    expect(logger.warn).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('records registration failures', async () => {
    const serviceWorker = {
      addEventListener: vi.fn(),
      controller: null,
      register: vi.fn(async () => {
        throw new Error('offline')
      }),
      removeEventListener: vi.fn()
    }
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker })
    const { api, wrapper } = mountServiceWorker()

    await expect(api?.register('/custom-sw.js')).resolves.toBeNull()
    expect(serviceWorker.register).toHaveBeenCalledWith('/custom-sw.js', { scope: '/' })
    expect(api?.status.value.error).toContain('offline')
    expect(logger.error).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('tracks controlled updates and worker state changes', async () => {
    const fixture = createRegistration()
    const events = new EventTarget()
    const serviceWorker = {
      addEventListener: vi.fn(events.addEventListener.bind(events)),
      controller: {},
      register: vi.fn(async () => fixture.registration),
      removeEventListener: vi.fn(events.removeEventListener.bind(events))
    }
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker })
    const { api, wrapper } = mountServiceWorker()
    const update = vi.fn()
    api?.onUpdate(update)

    await expect(api?.register()).resolves.toBe(fixture.registration)
    expect(api?.status.value.isRegistered).toBe(true)
    expect(api?.status.value.isControlling).toBe(true)
    fixture.dispatchUpdate()
    fixture.installing.dispatchState('installed')
    expect(api?.status.value.updateAvailable).toBe(true)
    expect(update).toHaveBeenCalledWith(fixture.registration)

    const immediateUpdate = vi.fn()
    api?.onUpdate(immediateUpdate)
    expect(immediateUpdate).toHaveBeenCalledWith(fixture.registration)
    fixture.installing.dispatchState('activated')
    expect(api?.status.value.isActivated).toBe(true)
    fixture.installing.dispatchState('redundant')
    events.dispatchEvent(new Event('controllerchange'))
    expect(api?.status.value.isControlling).toBe(true)

    wrapper.unmount()
    expect(serviceWorker.removeEventListener).toHaveBeenCalledWith(
      'controllerchange',
      expect.any(Function)
    )
  })

  it('handles first install, waiting and unregister outcomes', async () => {
    const fixture = createRegistration()
    fixture.registration.unregister.mockResolvedValueOnce(false)
    const serviceWorker = {
      addEventListener: vi.fn(),
      controller: null,
      register: vi.fn(async () => fixture.registration),
      removeEventListener: vi.fn()
    }
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker })
    const { api, wrapper } = mountServiceWorker()

    api?.skipWaiting()
    await api?.register()
    fixture.dispatchUpdate()
    fixture.installing.dispatchState('installed')
    expect(api?.status.value.isActivated).toBe(true)
    api?.skipWaiting()
    expect(fixture.waiting.worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })

    await api?.unregister()
    expect(api?.status.value.isRegistered).toBe(true)
    await api?.unregister()
    expect(api?.status.value.isRegistered).toBe(false)
    expect(api?.status.value.isActivated).toBe(false)
    wrapper.unmount()
  })

  it('clears caches, measures responses and formats byte units', async () => {
    const fixture = createRegistration()
    const hit = new Request('https://example.com/hit')
    const miss = new Request('https://example.com/miss')
    const cache = {
      keys: vi.fn(async () => [hit, miss]),
      match: vi.fn(async (request: Request) =>
        request.url.endsWith('/hit') ? new Response(new Blob(['abc'])) : undefined
      )
    }
    const cacheStorage = {
      delete: vi.fn(async () => true),
      keys: vi.fn(async () => ['pages']),
      open: vi.fn(async () => cache)
    }
    Object.defineProperty(globalThis, 'caches', { configurable: true, value: cacheStorage })
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        addEventListener: vi.fn(),
        controller: null,
        register: vi.fn(async () => fixture.registration),
        removeEventListener: vi.fn()
      }
    })
    const { api, wrapper } = mountServiceWorker()

    await api?.clearCache()
    await api?.register()
    await api?.clearCache()
    expect(fixture.active.worker.postMessage).toHaveBeenCalledWith({ type: 'CLEAR_CACHE' })
    expect(cacheStorage.delete).toHaveBeenCalledWith('pages')
    await expect(api?.getCacheSize()).resolves.toBe(3)
    expect(api?.formatCacheSize(500)).toBe('500.00 B')
    expect(api?.formatCacheSize(1024)).toBe('1.00 KB')
    expect(api?.formatCacheSize(1024 ** 4)).toBe('1024.00 GB')
    wrapper.unmount()
  })
})
