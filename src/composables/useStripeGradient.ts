/**
 * useStripeGradient — CSS-based animated gradient ribbons
 *
 * Instead of WebGL (which has preview-environment issues),
 * we use multiple animated CSS gradient layers to create
 * Stripe-style flowing color ribbons.
 *
 * Each layer is a pseudo-element with a different:
 * - Gradient angle
 * - Animation speed
 * - Color combination
 * - Blend mode
 */

import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface StripeGradientOptions {
  /** Primary accent color for gradient */
  accentColor?: string
  /** Secondary color */
  secondaryColor?: string
  /** Tertiary color */
  tertiaryColor?: string
  /** Darken top for readability */
  darkenTop?: boolean
}

export function useStripeGradient(
  heroRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: StripeGradientOptions = {}
) {
  const {
    accentColor = '#ef008f',
    secondaryColor = '#6ec3f4',
    tertiaryColor = '#7038ff',
    darkenTop = true,
  } = options

  onMounted(() => {
    if (!heroRef.value) return

    // Hide the WebGL canvas (fallback to CSS gradients)
    if (canvasRef.value) {
      canvasRef.value.style.display = 'none'
    }

    // Add CSS gradient layers to hero
    const hero = heroRef.value
    hero.classList.add('hero--gradient-active')

    // Inject gradient keyframes if not already present
    if (!document.getElementById('stripe-gradient-keyframes')) {
      const style = document.createElement('style')
      style.id = 'stripe-gradient-keyframes'
      style.textContent = `
        @keyframes stripe-ribbon-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(5%, -3%) rotate(2deg) scale(1.05); }
          50% { transform: translate(-3%, 5%) rotate(-1deg) scale(0.95); }
          75% { transform: translate(3%, 2%) rotate(1deg) scale(1.02); }
        }
        @keyframes stripe-ribbon-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-4%, 3%) rotate(-2deg) scale(1.03); }
          66% { transform: translate(3%, -4%) rotate(1deg) scale(0.97); }
        }
        @keyframes stripe-ribbon-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(4%, -2%) rotate(3deg); }
        }
        @keyframes stripe-ribbon-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-3%, 4%) rotate(-2deg); }
        }

        .hero--gradient-active::before {
          content: '';
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, ${accentColor}33 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 80% 70%, ${tertiaryColor}33 0%, transparent 50%);
          animation: stripe-ribbon-1 20s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }

        .hero--gradient-active::after {
          content: '';
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(ellipse 70% 50% at 60% 20%, ${secondaryColor}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 70% at 30% 80%, ${accentColor}22 0%, transparent 50%);
          animation: stripe-ribbon-2 25s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }

        /* Additional animated glow layers */
        .hero--gradient-active .hero__glow--extra-1 {
          position: absolute;
          inset: -10%;
          background: radial-gradient(ellipse 60% 40% at 40% 50%, ${tertiaryColor}18 0%, transparent 60%);
          animation: stripe-ribbon-3 15s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }

        .hero--gradient-active .hero__glow--extra-2 {
          position: absolute;
          inset: -10%;
          background: radial-gradient(ellipse 50% 60% at 70% 40%, ${secondaryColor}15 0%, transparent 60%);
          animation: stripe-ribbon-4 18s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
      `
      document.head.appendChild(style)
    }
  })

  onUnmounted(() => {
    if (heroRef.value) {
      heroRef.value.classList.remove('hero--gradient-active')
    }
  })
}
