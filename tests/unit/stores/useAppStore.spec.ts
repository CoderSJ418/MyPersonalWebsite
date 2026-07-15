import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useAppStore } from '@/stores/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => vi.useRealTimers())

  it('manages navigation, overlays, messages and responsive state', () => {
    const store = useAppStore()
    store.openMenu()
    store.toggleMenu()
    store.closeMenu()
    store.setLoading(true)
    store.openSearch()
    store.toggleSearch()
    store.closeSearch()
    store.openSidebar()
    store.toggleSidebar()
    store.closeSidebar()
    store.setBreakpoint('xs')
    expect(store.isMobile).toBe(true)

    const id = store.showToast('saved', 'success', 10)
    expect(store.hasToasts).toBe(true)
    vi.advanceTimersByTime(10)
    expect(store.toasts).toHaveLength(0)
    store.showToast('persistent', 'info', 0)
    store.removeToast('missing')
    store.clearToasts()

    store.openModal('details', { id: 1 })
    expect(store.hasOpenModals).toBe(true)
    store.toggleModal('details')
    store.toggleModal('details')
    store.closeModal('missing')
    store.setBreadcrumbs([{ text: 'Home', path: '/' }])
    store.clearBreadcrumbs()
    expect(id).toContain('toast-')
  })

  it('initializes listeners, preferences and reset lifecycle', () => {
    localStorage.setItem('app_preferences', JSON.stringify({ isNavFixed: false }))
    const addWindow = vi.spyOn(window, 'addEventListener')
    const removeWindow = vi.spyOn(window, 'removeEventListener')
    const addDocument = vi.spyOn(document, 'addEventListener')
    const removeDocument = vi.spyOn(document, 'removeEventListener')
    const store = useAppStore()

    store.initialize()
    store.initialize()
    expect(store.isNavFixed).toBe(false)
    expect(addWindow).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
    expect(addDocument).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 700 })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(101)
    expect(store.scrollToTop).toBe(true)

    store.reset()
    expect(store.language).toBe('zh')
    expect(localStorage.getItem('app_preferences')).toContain('true')
    store.dispose()
    expect(removeWindow).toHaveBeenCalled()
    expect(removeDocument).toHaveBeenCalled()
  })
})
