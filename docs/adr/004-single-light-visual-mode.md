---
status: accepted
date: 2026-07-14
---

# Adopt a single light visual mode

The portfolio will use one light visual mode with `#2563EB` as its primary accent and will remove the dark-mode toggle, theme state, persisted preference, and dark-only styling. Dark mode originally carried much of the site's UI and architecture demonstration burden; the Interaction Lab now provides that evidence more directly, while one presentation mode reduces design drift, testing branches, and maintenance cost.

## Consequences

- Phase 0 must remove dark-mode infrastructure before further Interaction Lab implementation.
- Existing dark-mode code is a temporary migration exception and must not be extended.
- Accessibility still requires sufficient contrast, visible focus, reduced-motion support, and non-color status cues.
- Reintroducing multiple themes requires a new ADR and a product reason beyond visual variety.
