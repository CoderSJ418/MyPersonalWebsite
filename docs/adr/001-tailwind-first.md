# ADR 001: Tailwind-First Styling Strategy

## Status
Accepted

## Context
The project needed a consistent, scalable approach to styling. Options considered:
1. Scoped CSS in components (Vue's default)
2. CSS Modules
3. Utility-first CSS (Tailwind)
4. BEM + SCSS

## Decision
Adopt Tailwind CSS as the primary styling approach. Scoped `<style>` blocks only when Tailwind's utilities cannot express the requirement (rare, <5% of cases).

## Rationale
- **Consistency** — shared design tokens across all components (spacing, colors, typography)
- **Maintainability** — styles live next to markup in the template, reducing cognitive load
- **Performance** — Tailwind's tree-shaking removes unused utilities at build time
- **Developer velocity** — no need to name CSS classes or manage specificity wars

## Consequences
- Developers must be fluent in Tailwind's utility class names
- Occasionally, custom CSS is needed for complex animations (mitigated by GSAP)
- Bundle size is slightly larger than hand-written CSS (offset by compression + HTTP/2)

## Related ADRs
- ADR 002: GSAP for animations (where custom CSS is preferred)
