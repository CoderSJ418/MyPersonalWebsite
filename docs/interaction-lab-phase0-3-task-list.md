# Interaction Lab Phase 0–3.5 Task List

> PRD: `docs/prd-interaction-lab.md` v0.6
> Scope: Phase 0–4 本地实现与验收
> Status: Phase 0–4 已完成并正式发布；等待真实会话观察
> Existing uncommitted Lab work is preserved and migrated in place.

## Impact analysis

### Phase 0 — single light mode

- App shell and Header: remove theme state, controls, persisted preference and dark DOM attributes.
- Visual system: make light tokens canonical and remove active dark selectors/variants.
- Hero: remove WebGL/Stripe runtime and keep Projects as the only public CTA during preview.
- Dependencies: remove `whatamesh` only after active-source reference validation.
- Regression surface: every route, Header/mobile focus trap, Search, CTA variants and global CSS.

### Phase 1 — Lab infrastructure

- Replace registry-owned code strings with JSON metadata plus typed runtime bindings.
- Move search/filter and demo orchestration out of Views into business components/composables.
- Replace string provide/inject with typed props/events and route-change reset.
- Add async retry/error/timeout, robots/noindex, pure structured data and sitemap generation.
- Add check-only lint, typecheck, registry validation and Phase tests.

### Phase 2 — fixed 12 Demo MVP

- Complete the 12 approved Demos; remove `animated-gradient-text` from active MVP.
- Each Demo provides typed params, cleanup, reduced-motion/touch fallback, raw source, dependency/license metadata and a deterministic preview.
- Execute batches of four with T2A/T2B/T2C validation.

### Phase 3 — experience and preview release

- Complete search/filter, static preview cards, dynamic usage, expandable full source and copy feedback.
- Add explicit-consent GA4 integration and privacy preference control.
- Keep Lab directly addressable but `noindex`, absent from public navigation, Home CTA and sitemap.
- Add the initial five-person protocol and T3 readiness report; v0.6 later retains that protocol as research debt under the Owner Acceptance exception.

### Phase 3.5 — product persuasion and real reuse

- Fix perceived animation timing, conditional-control layout shift and intrusive copy feedback.
- Extend structured Demo content with use cases, avoid-when boundaries, pairings, implementation notes, stack, performance, accessibility and real-site usage.
- Upgrade a small flagship subset of the existing 12 and reuse canonical effect SFCs in Hero, Projects, CTA and project metrics.
- Keep one primary animation per visual region, with touch and reduced-motion fallbacks.
- Re-run automated gates, T3-Proxy and the eight-task Owner Acceptance; keep Lab unpublished until approval.

## Ordered tasks

1. P0.1–P0.4: remove theme UI/state/storage and normalize light DOM/tokens.
2. P0.5–P0.8: simplify Hero, remove Shader files/references and dependency, run T0.
3. P1.1–P1.4: create Lab types/JSON/catalog/runtime registry and business components.
4. P1.5–P1.8: implement params, async recovery, SEO/noindex, sitemap exclusion and validators; run T1.
5. P2A: aurora, grid-pattern, dot-pattern, noise-texture; run T2A.
6. P2B: meteors, spotlight, tilt-card, magic-card; run T2B.
7. P2C: shine-border, shimmer-button, number-ticker, marquee; run T2C.
8. P3.1–P3.4: preview assets, source/usage experience, consent analytics and privacy UI.
9. P3.5: run full gates and produce T3 readiness report without publishing Lab.
10. P3.5A.1: add a failing NumberTicker behavior test for current-value transitions, midpoint progress and configured-duration tolerance.
11. P3.5A.2: animate NumberTicker from current value with a balanced easing curve; regenerate its previews and source digest.
12. P3.5A.3: preserve the reset-control layout slot while removing hidden controls from focus and accessibility order.
13. P3.5A.4: replace block copy alerts with stable-width in-button feedback; cover usage/source success and permission failure.
14. P3.5A.5: reproduce Selection persistence and mobile disclosure-state styling in real Chrome; only fix conditions with deterministic evidence.
15. P3.5B.1: extend Lab metadata types, parser and validator with the eight v0.6 content fields and cross-reference checks.
16. P3.5B.2: author structured content for all 12 Demos; reject generic or duplicated descriptions in review.
17. P3.5B.3: add progressive-disclosure sections for scenarios, avoid-when, pairings, implementation, stack, performance, accessibility and used-in links.
18. P3.5B.4: rewrite Lab landing copy so a first-time visitor can identify purpose, audience and engineering proof within 10 seconds.
19. P3.5C.1: select and upgrade flagship background, card, CTA and data effects from the existing 12; no new IDs.
20. P3.5D.1: compose one primary Hero effect with static support layers; protect heading/CTA contrast and Projects as primary conversion.
21. P3.5D.2: reuse at most one Pointer effect per Projects card region, one low-frequency CTA effect and viewport-triggered NumberTicker metrics.
22. P3.5D.3: enforce canonical SFC reuse, touch/reduced-motion fallback, cleanup and animation-budget assertions.
23. P3.5E: run all automated, visual, performance, proxy and Owner Acceptance gates; update readiness without publishing Phase 4.

## Testing seams

- Pure metadata/parser tests: required fields, Demo-ID pairings, used-in targets and invalid content rejection.
- Component behavior tests: NumberTicker timing/retargeting, reset slot stability, copy status, disclosure and reduced-motion branches.
- Real-route integration tests: Lab detail content, invalid-ID recovery and canonical effect consumers.
- Playwright E2E: Home Hero, Projects, CTA, metrics and Lab across desktop, 375px portrait/landscape, touch and reduced-motion.
- Visual/performance evidence: fixed screenshots plus three-run Lighthouse median; no class-name-only assertions.
- Human seam: the same eight Owner Acceptance tasks plus explicit questions on purpose, strongest proof, visual distinctiveness and reuse value.

## Gate status

- T0: passed — single-light runtime, typecheck, lint check and build.
- T1: passed — frozen registry, raw source, route recovery, noindex/robots and Sitemap exclusion.
- T2A/T2B/T2C: passed — 12 minimal-host mounts, typed params, fallbacks, MIT scope and 24 previews.
- T3 automated/proxy gate: passed — 148 unit tests, 14 E2E tests, four coverage thresholds, build, Lab validator, Lighthouse/WCAG and T3-Proxy evidence.
- T3 Owner Acceptance: not passed — functional tasks succeeded, but positioning, visual persuasion, reuse explanation and overall distinctiveness were rejected.
- T3.5: passed — 体验、内容、四类旗舰复用、跨视口、性能与 8 项代理验收完成。
- T4 code gate: passed — 导航、首页次 CTA、Sitemap、index、六类同意后事件和生产本地冒烟完成。
- T4 external gate: pending — 无正式 Measurement ID 与 GA4 管理后台证据，尚未进入 50 会话观察。

## Remaining non-goals / future work

- No effects beyond the approved 12.
- No restoration of Projects narrative work.
- No new animation/UI dependency, dark mode, WebGL restoration or duplicate effect implementation.
- No claim that Owner Acceptance or AI Proxy is independent five-person user research.
- Phase 5 remains a post-release batch rule, not an instruction to add unnamed effects now.
