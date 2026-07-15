import { readonly, ref } from 'vue'

import type { LabCategory, LabEffectId } from '@/types/lab'

export type AnalyticsConsent = 'unknown' | 'granted' | 'denied' | 'dnt'
export type LabAnalyticsEvent =
  | 'lab_view'
  | 'demo_open'
  | 'code_expand'
  | 'code_copy'
  | 'lab_cta_click'
  | 'projects_cta_click'

type LabAnalyticsPayload =
  | { event: 'lab_view'; source: 'home_cta' | 'nav' | 'direct' | 'internal_link' }
  | { event: 'demo_open'; effectId: LabEffectId; category: LabCategory }
  | { event: 'code_expand'; effectId: LabEffectId }
  | { event: 'code_copy'; effectId: LabEffectId; copyTarget: 'usage' | 'full_source' }
  | { event: 'lab_cta_click' | 'projects_cta_click'; placement: 'home_hero' | 'header' | 'lab_page' }

interface StoredConsent {
  decision: 'granted' | 'denied'
  savedAt: number
}

const STORAGE_KEY = 'analytics-consent-v1'
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000
const consent = ref<AnalyticsConsent>('unknown')
const preferencesOpen = ref(false)
let initialized = false

const isStoredConsent = (value: unknown): value is StoredConsent => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  return Reflect.get(value, 'decision') === 'granted' || Reflect.get(value, 'decision') === 'denied'
}

const doNotTrackEnabled = (): boolean =>
  navigator.doNotTrack === '1' || Reflect.get(window, 'doNotTrack') === '1'

const readStoredConsent = (): StoredConsent | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isStoredConsent(parsed) || typeof parsed.savedAt !== 'number') return null
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveConsent = (decision: 'granted' | 'denied') => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ decision, savedAt: Date.now() }))
}

const measurementId = (): string => import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? ''

const loadGoogleAnalytics = () => {
  const id = measurementId()
  if (!id || consent.value !== 'granted' || document.getElementById('ga4-script')) return
  Reflect.set(window, `ga-disable-${id}`, false)
  window.dataLayer = window.dataLayer ?? []
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
  window.gtag('js', new Date())
  window.gtag('config', id, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  })
  const script = document.createElement('script')
  script.id = 'ga4-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}

const disableGoogleAnalytics = () => {
  const id = measurementId()
  if (id) Reflect.set(window, `ga-disable-${id}`, true)
  document.getElementById('ga4-script')?.remove()
  for (const item of document.cookie.split(';')) {
    const name = item.split('=')[0]?.trim() ?? ''
    if (name === '_ga' || name.startsWith('_ga_')) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
    }
  }
}

export const initializePrivacyAnalytics = () => {
  if (initialized) return
  initialized = true
  if (doNotTrackEnabled()) {
    consent.value = 'dnt'
    disableGoogleAnalytics()
    return
  }
  const stored = readStoredConsent()
  consent.value = stored?.decision ?? 'unknown'
  if (consent.value === 'granted') loadGoogleAnalytics()
}

export const grantAnalyticsConsent = () => {
  if (doNotTrackEnabled()) return
  consent.value = 'granted'
  saveConsent('granted')
  loadGoogleAnalytics()
  preferencesOpen.value = false
}

export const denyAnalyticsConsent = () => {
  consent.value = doNotTrackEnabled() ? 'dnt' : 'denied'
  if (consent.value === 'denied') saveConsent('denied')
  disableGoogleAnalytics()
  preferencesOpen.value = false
}

export const openAnalyticsPreferences = () => {
  preferencesOpen.value = true
}
export const closeAnalyticsPreferences = () => {
  preferencesOpen.value = false
}
export const analyticsConsent = readonly(consent)
export const analyticsPreferencesOpen = readonly(preferencesOpen)

export const trackLabAnalytics = (payload: LabAnalyticsPayload) => {
  if (consent.value !== 'granted' || !window.gtag) return
  if (payload.event === 'lab_view') {
    window.gtag('event', payload.event, { source: payload.source })
    return
  }
  if (payload.event === 'demo_open') {
    window.gtag('event', payload.event, {
      effect_id: payload.effectId,
      category: payload.category
    })
    return
  }
  if (payload.event === 'code_expand') {
    window.gtag('event', payload.event, { effect_id: payload.effectId })
    return
  }
  if (payload.event === 'code_copy') {
    window.gtag('event', payload.event, {
      effect_id: payload.effectId,
      copy_target: payload.copyTarget
    })
    return
  }
  window.gtag('event', payload.event, { placement: payload.placement })
}
