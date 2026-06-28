# ADR 002: GSAP for Complex Animations

## Status
Accepted

## Context
Vue 3's built-in `<Transition>` and `<TransitionGroup>` handle simple enter/leave animations. Complex scenarios (scroll triggers, morphing, sequenced timelines) require more control.

## Decision
Use GSAP 3.14.2 (Green Sock Animation Platform) for all animations beyond Vue's built-in transitions.

## Rationale
- **Performance** — GSAP optimizes GPU acceleration and avoids layout thrashing
- **Sequencing** — timelines allow precise control over complex multi-step animations
- **Scroll Integration** — ScrollTrigger plugin enables scroll-based animations without re-computing on every scroll
- **Browser Compatibility** — battle-tested across all modern browsers

## Consequences
- Additional dependency (GSAP is ~40KB gzipped, but commonly cached)
- Developers must learn GSAP API in addition to Vue transitions
- All scroll-based animations should use GSAP ScrollTrigger

## Integration Pattern
```typescript
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Use in composables, not inline in templates
export const useScrollAnimation = () => {
  onMounted(() => {
    gsap.to(".element", {
      scrollTrigger: { trigger: ".element", start: "top center" },
      opacity: 1,
      duration: 1,
    });
  });
};
```

## Related ADRs
- ADR 001: Tailwind-first (CSS utilities for static styles, GSAP for dynamics)
