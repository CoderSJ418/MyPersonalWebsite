/**
 * useCardSpotlight — Stripe-style mouse-following glow effect
 *
 * Exports a Vue directive `vSpotlight` that adds mouse-following
 * radial gradient glow to any element. Sets CSS custom properties
 * (--mouse-x, --mouse-y, --spotlight-opacity, --spotlight-color,
 *  --spotlight-radius) so ::before pseudo-element renders the glow.
 *
 * Usage in template:
 *   <div v-spotlight="{ color: '99,102,241', radius: 600 }">
 *   Or as class-based (auto-initialized via directive):
 *   <div class="spotlight-enabled" v-spotlight>
 *
 * CSS required on the element:
 *   .spotlight-enabled::before {
 *     background: radial-gradient(
 *       var(--spotlight-radius, 600px) circle at
 *       var(--mouse-x, 50%) var(--mouse-y, 50%),
 *       rgba(var(--spotlight-color, 99, 102, 241), 0.08),
 *       transparent 40%
 *     );
 *     opacity: var(--spotlight-opacity, 0);
 *   }
 */

import type { ObjectDirective } from 'vue'
import { onMounted, onUnmounted } from 'vue'

interface SpotlightOptions {
  color?: string
  radius?: number
}

const handleMouseMove = (el: HTMLElement, e: MouseEvent) => {
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}

const handleMouseEnter = (el: HTMLElement) => {
  el.style.setProperty('--spotlight-opacity', '1')
}

const handleMouseLeave = (el: HTMLElement) => {
  el.style.setProperty('--spotlight-opacity', '0')
}

function initSpotlight(el: HTMLElement, opts: SpotlightOptions = {}) {
  const { color = '99,102,241', radius = 600 } = opts

  el.style.setProperty('--spotlight-color', color)
  el.style.setProperty('--spotlight-radius', `${radius}px`)
  el.style.setProperty('--spotlight-opacity', '0')
  el.classList.add('spotlight-enabled')

  el.addEventListener('mousemove', (e: MouseEvent) => handleMouseMove(el, e))
  el.addEventListener('mouseenter', () => handleMouseEnter(el))
  el.addEventListener('mouseleave', () => handleMouseLeave(el))
}

function destroySpotlight(el: HTMLElement) {
  el.classList.remove('spotlight-enabled')
  el.style.removeProperty('--mouse-x')
  el.style.removeProperty('--mouse-y')
  el.style.removeProperty('--spotlight-color')
  el.style.removeProperty('--spotlight-radius')
  el.style.removeProperty('--spotlight-opacity')
}

/**
 * Composable — for single-element use with a template ref
 */
export function useCardSpotlight(
  el: HTMLElement | null,
  opts: SpotlightOptions = {}
) {
  onMounted(() => {
    if (el) initSpotlight(el, opts)
  })
  onUnmounted(() => {
    if (el) destroySpotlight(el)
  })
}

/**
 * Vue directive — for use in templates, including v-for
 *
 * Usage:
 *   v-spotlight                     // defaults
 *   v-spotlight="'99,102,241'"      // color only
 *   v-spotlight="{ color: '6,182,212', radius: 500 }"  // full options
 */
export const vSpotlight: ObjectDirective<HTMLElement, string | SpotlightOptions | true> = {
  mounted(el, binding) {
    let opts: SpotlightOptions = {}
    if (binding.value === true || binding.value === undefined) {
      opts = {}
    } else if (typeof binding.value === 'string') {
      opts = { color: binding.value }
    } else {
      opts = binding.value
    }
    initSpotlight(el, opts)
  },
  updated(el, binding) {
    // Update options if they change
    if (binding.value && typeof binding.value === 'object' && !Array.isArray(binding.value)) {
      if (binding.value.color) el.style.setProperty('--spotlight-color', binding.value.color)
      if (binding.value.radius) el.style.setProperty('--spotlight-radius', `${binding.value.radius}px`)
    }
  },
  unmounted(el) {
    destroySpotlight(el)
  },
}
