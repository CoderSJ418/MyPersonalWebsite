import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import type { AnalyticsConsent } from '@/services/privacyAnalytics'

describe('privacy preferences', () => {
  it('renders consent states and controls the focused dialog', async () => {
    vi.resetModules()
    const consent = ref<AnalyticsConsent>('unknown')
    const preferencesOpen = ref(false)
    const close = vi.fn(() => { preferencesOpen.value = false })
    const deny = vi.fn(() => {
      consent.value = 'denied'
      preferencesOpen.value = false
    })
    const grant = vi.fn(() => {
      consent.value = 'granted'
      preferencesOpen.value = false
    })
    const open = vi.fn(() => { preferencesOpen.value = true })
    vi.doMock('@/services/privacyAnalytics', () => ({
      analyticsConsent: consent,
      analyticsPreferencesOpen: preferencesOpen,
      closeAnalyticsPreferences: close,
      denyAnalyticsConsent: deny,
      grantAnalyticsConsent: grant,
      openAnalyticsPreferences: open
    }))
    const component = (await import('@/components/common/PrivacyPreferences.vue')).default
    const wrapper = mount(component, { attachTo: document.body })

    expect(wrapper.find('aside').exists()).toBe(true)
    await wrapper.findAll('aside button')[2]?.trigger('click')
    await nextTick()
    const dialog = wrapper.get<HTMLElement>('[role="dialog"]')
    expect(document.activeElement).toBe(dialog.element)
    expect(wrapper.text()).toContain('尚未选择')

    consent.value = 'dnt'
    await nextTick()
    expect(wrapper.findAll('[role="dialog"] .primary-action')).toHaveLength(0)

    consent.value = 'denied'
    await nextTick()
    expect(wrapper.text()).toContain('已拒绝')
    await wrapper.get('[role="dialog"] .primary-action').trigger('click')
    expect(grant).toHaveBeenCalledOnce()
    expect(preferencesOpen.value).toBe(false)

    open()
    consent.value = 'granted'
    await nextTick()
    expect(wrapper.text()).toContain('已允许')
    await wrapper.get('[role="dialog"] .mt-6 .secondary-action').trigger('click')
    expect(deny).toHaveBeenCalledOnce()
    open()
    await nextTick()
    await wrapper.get('[aria-label="关闭统计偏好"]').trigger('click')
    expect(close).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
