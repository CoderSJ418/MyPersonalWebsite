import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('privacy analytics consent gate', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123')
    localStorage.clear()
    document.head.innerHTML = ''
    window.dataLayer = []
    window.gtag = undefined
    Object.defineProperty(navigator, 'doNotTrack', { value: '0', configurable: true })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('does not load GA before explicit consent', async () => {
    const analytics = await import('@/services/privacyAnalytics')
    analytics.initializePrivacyAnalytics()
    expect(analytics.analyticsConsent.value).toBe('unknown')
    expect(document.getElementById('ga4-script')).toBeNull()
  })

  it('loads GA only after grant and sends allowlisted Lab fields', async () => {
    const analytics = await import('@/services/privacyAnalytics')
    analytics.initializePrivacyAnalytics()
    analytics.grantAnalyticsConsent()
    expect(document.getElementById('ga4-script')).not.toBeNull()
    analytics.trackLabAnalytics({
      event: 'code_copy',
      effectId: 'aurora',
      copyTarget: 'full_source'
    })
    expect(window.dataLayer.at(-1)).toEqual([
      'event',
      'code_copy',
      { effect_id: 'aurora', copy_target: 'full_source' }
    ])
  })

  it('emits only the closed event payloads required by the PRD', async () => {
    const analytics = await import('@/services/privacyAnalytics')
    analytics.initializePrivacyAnalytics()
    analytics.grantAnalyticsConsent()
    analytics.trackLabAnalytics({ event: 'lab_view', source: 'nav' })
    analytics.trackLabAnalytics({ event: 'demo_open', effectId: 'aurora', category: 'background' })
    analytics.trackLabAnalytics({ event: 'lab_cta_click', placement: 'home_hero' })
    analytics.trackLabAnalytics({ event: 'projects_cta_click', placement: 'home_hero' })
    expect(window.dataLayer.slice(-4)).toEqual([
      ['event', 'lab_view', { source: 'nav' }],
      ['event', 'demo_open', { effect_id: 'aurora', category: 'background' }],
      ['event', 'lab_cta_click', { placement: 'home_hero' }],
      ['event', 'projects_cta_click', { placement: 'home_hero' }]
    ])
  })

  it('honors Do Not Track even when grant is requested', async () => {
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true })
    const analytics = await import('@/services/privacyAnalytics')
    analytics.initializePrivacyAnalytics()
    analytics.grantAnalyticsConsent()
    expect(analytics.analyticsConsent.value).toBe('dnt')
    expect(document.getElementById('ga4-script')).toBeNull()
  })

  it('expires a stored choice after 180 days', async () => {
    localStorage.setItem(
      'analytics-consent-v1',
      JSON.stringify({ decision: 'granted', savedAt: Date.now() - 181 * 24 * 60 * 60 * 1000 })
    )
    const analytics = await import('@/services/privacyAnalytics')
    analytics.initializePrivacyAnalytics()
    expect(analytics.analyticsConsent.value).toBe('unknown')
    expect(localStorage.getItem('analytics-consent-v1')).toBeNull()
  })
})
