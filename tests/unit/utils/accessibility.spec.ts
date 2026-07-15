import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  addAccessibilityAttributes,
  applyAccessibilityOptimizations,
  checkAccessibilityStatus,
  createAccessibleModal,
  getAccessibilityRecommendations,
  validateComponentAccessibility,
  validatePageAccessibility
} from '@/utils/accessibility'

const mediaQuery = (media: string, matches: boolean): MediaQueryList => ({
  matches,
  media,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => true)
})

describe('accessibility utilities', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = '<main id="main-content"></main>'
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => mediaQuery(query, true))
  })

  it('applies keyboard, preference and skip-link behavior with cleanup', () => {
    const cleanup = applyAccessibilityOptimizations()
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(true)
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    expect(document.documentElement.classList.contains('keyboard-nav')).toBe(true)
    document.dispatchEvent(new MouseEvent('mousedown'))
    const skipLink = document.querySelector('.skip-link')
    skipLink?.dispatchEvent(new FocusEvent('focus'))
    expect(skipLink?.classList.contains('sr-only')).toBe(false)
    skipLink?.dispatchEvent(new FocusEvent('blur'))
    expect(checkAccessibilityStatus().prefersReducedMotion).toBe(true)
    expect(getAccessibilityRecommendations()).toHaveLength(3)
    cleanup()
    expect(document.querySelector('.skip-link')).toBeNull()
  })

  it('validates controls, media, contrast and page structure', () => {
    const section = document.createElement('section')
    section.innerHTML = `
      <button class="no-focus">Save</button>
      <input><textarea aria-label="Message"></textarea>
      <img src="/missing.png"><p style="color:#000;background:#000">Low contrast</p>
    `
    document.body.appendChild(section)
    const computedStyle = window.getComputedStyle(section)
    Object.defineProperty(computedStyle, 'color', { configurable: true, value: '#000000' })
    Object.defineProperty(computedStyle, 'backgroundColor', {
      configurable: true,
      value: '#000000'
    })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue(computedStyle)
    const result = validateComponentAccessibility(section)
    expect(result.warnings.length).toBeGreaterThanOrEqual(2)
    expect(result.errors.length).toBeGreaterThan(0)
    addAccessibilityAttributes(section, { role: 'region', 'aria-label': 'Example' })
    expect(section.getAttribute('role')).toBe('region')

    document.body.insertAdjacentHTML(
      'beforeend',
      '<h1>Title</h1><h3>Skipped</h3><a href="/">Go</a><form><input></form>'
    )
    const page = validatePageAccessibility()
    expect(page.isValid).toBe(false)
    expect(page.warnings.length).toBeGreaterThanOrEqual(2)
  })

  it('creates confirm, cancel and escape modal flows', () => {
    const confirmed = vi.fn()
    const closed = vi.fn()
    createAccessibleModal('Confirm', 'Proceed?', { onConfirm: confirmed, confirmText: 'Go' })
    document.querySelector<HTMLElement>('.modal-confirm')?.click()
    expect(confirmed).toHaveBeenCalledOnce()
    createAccessibleModal('Cancel', 'Stop?', { onClose: closed, cancelText: 'Stop' })
    document.querySelector<HTMLElement>('.modal-cancel')?.click()
    expect(closed).toHaveBeenCalledOnce()
    createAccessibleModal('Escape', 'Close?', { onClose: closed })
    document.querySelector<HTMLElement>('.accessible-modal')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    expect(document.querySelector('.accessible-modal')).toBeNull()
  })
})
