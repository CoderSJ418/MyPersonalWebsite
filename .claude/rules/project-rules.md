---
globs: *
alwaysApply: true
---

# Project Rules

非协商性。违反任何规则之前，你必须能写出为什么这条规则在这个具体场景下是错误的，
以及什么新规则取代它。如果你写不出来，规则就是正确的——遵守它。

---

## 0. Why These Rules Exist

Every rule below was written from a specific bug, inconsistency, or technical debt
incident. Rules without a "why" are cargo cult. Every rule here has one.

If a rule conflicts with correct implementation: fix the implementation first.
Only update the rule when you can articulate, in writing, why the rule is wrong
and what replaces it. The rule change and the code change are committed together.

---

## 1. Component Contracts

### 1.1 Every view MUST render SEOHead as its first child

The router does NOT set meta tags. It was deliberately stripped of all meta logic
on 2026-06-30 after a review found that the router's `updateMetaTags` was fighting
with SEOHead's Teleport injection, causing duplicate and conflicting meta tags.
**SEOHead is the sole authority for document head content.**

Adding `document.title` or `<meta>` manipulation in a view's `onMounted` is a
violation. The view's only responsibility for SEO is rendering the correct `<SEOHead>`
props.

### 1.2 Views are layout shells — nothing more

Views (`src/views/*.vue`) have exactly three jobs:
1. Render `<SEOHead>` with correct props
2. Import and compose feature components
3. Call `window.scrollTo({ top: 0 })` in `onMounted`

If a view contains data transformation, computed filtering, or component-level
styling, that logic belongs in a composable or a sub-component. A view exceeding
50 lines of `<script setup>` is a smell.

### 1.3 Every component uses `<script setup lang="ts">`

No Options API. No manual `setup()` function. This is enforced by `grep -r "export default" src/components/`.
The only acceptable deviation is if Vue's compiler requires it (it doesn't).

### 1.4 v-html is forbidden without explicit XSS sanitization

`v-html` bypasses Vue's DOM escaping. The project has `src/utils/xss.ts` with
`sanitizeHtml()`. Every `v-html` usage must either:
- Pass through `sanitizeHtml()` first, OR
- Be rendering content that was already sanitized upstream (with a comment
  explaining where)

The current usages in `BlogDetail.vue` and `CodeBlock.vue` render markdown output
that was sanitized by `src/utils/markdown.ts`. They are sanctioned but must not
be treated as a pattern to replicate without the same sanitization step.

### 1.5 Components in `common/` have zero feature-domain imports

`src/components/common/` components must not import from `stores/`, `composables/`,
or feature directories (`about/`, `projects/`, `blog/`, `contact/`). They receive
all data through props. This prevents circular dependencies and keeps them portable.

The existing `Footer.vue` import of `useContactInfoStore` is a legacy exception.
Any new import from a store in `common/` requires explicit justification — and the
preferred pattern is to pass data as props from the consuming view.

---

## 2. Data Flow

### 2.1 Static data lives in JSON, never in .vue files

All content data (projects, skills, education, experience, contact, personal info)
resides in `src/assets/data/*.json`. If you find yourself typing content directly
into a component template or script, move it to JSON. Components display data,
they don't own it.

### 2.2 Stores are thin data access layers

A store's responsibility is: load data from JSON, expose it reactively, provide
filtering/search methods. A store must NOT:
- Make network requests (unless it's a designated API store)
- Mutate the imported JSON objects directly (create local refs instead)
- Contain business logic (validation, transformation, calculations)
- Call other stores (no cross-store dependencies)

### 2.3 Blog content is markdown, not JSON

Blog posts are `src/assets/blog/*.md` with YAML frontmatter. `blogLoader.ts` uses
Vite `import.meta.glob` to bundle them at build time. Do NOT add blog posts to
`blog-index.json` — it exists only as a migration fallback and should not grow.

New blog posts: add `.md` file to `src/assets/blog/`. Done. No other step required.

### 2.4 Data flows downward, events flow upward

Parent → child: props (data down)
Child → parent: emits (events up)
Sibling → sibling: through parent or store, never directly

Stores are not a replacement for proper component communication. If two sibling
components need to coordinate, they either share a store (if the state is
application-wide) or lift the state to their common parent.

---

## 3. SEO Strategy

### 3.1 SEOHead is the single source of truth for the document head

No other mechanism sets `<title>`, `<meta>`, `<link rel="canonical">`, or JSON-LD.
The router was deliberately stripped of meta logic. Views must not reintroduce it.
If a view sets `document.title` manually, it will be overwritten by SEOHead's
`watch(() => props.title, ...)` — this is a bug, not a feature.

### 3.2 JSON-LD is injected via DOM API, never in template

`<script type="application/ld+json">` is forbidden in Vue templates. Vue's compiler
rejects it with `Tags with side effect (<script>) are ignored in client component templates`.
The correct pattern (implemented in SEOHead) is:
1. `document.createElement('script')` in `onMounted`
2. `document.head.appendChild(scriptEl)` 
3. `scriptEl.remove()` in `onUnmounted`

This is intentional. Do not "fix" it by putting the script tag back in the template.

### 3.3 Every new route requires three SEO artifacts

Adding a new route means:
1. `<SEOHead>` in the view with `title`, `description`, and `type`
2. A structured data generator in `src/utils/structuredData.ts` if the page
   has structured content
3. Route `meta.title` and `meta.description` in `src/router/index.ts`

Missing any of these three means the page has incomplete SEO. No route is exempt.

### 3.4 structuredData functions are pure functions

Functions in `src/utils/structuredData.ts` return plain objects. They must NOT:
- Access `window` or `document` (URL construction is done by the caller or SEOHead)
- Inject DOM elements (that's SEOHead's job)
- Mutate any input parameter
- Have side effects of any kind

If a structured data function needs a URL, it takes it as a parameter.

---

## 4. Styling

### 4.1 Tailwind utilities are the default; `<style scoped>` is the exception

New code must use Tailwind CSS utility classes. `<style scoped>` is permitted only for:
- Keyframe animations that Tailwind cannot express
- Structural styles (layout primitives that are reused across many classes)
- Legacy migration in progress (must have a TODO comment with ticket reference)

**Current target:** Zero `<style scoped>` blocks in all `src/views/*.vue` files.
Components in `components/` are lower priority but should also be migrated.

### 4.2 CSS custom properties (`var(--*)`) are reserved for design tokens

New component code uses Tailwind utilities or named tokens from `design-system/`.
Do not introduce component-local color variables or duplicate raw color values.
Legacy theme-switching variables are removed during the single-light Phase 0 migration.

### 4.3 New code targets one light visual mode

The product has one light presentation mode. New code must not add `dark:` variants,
theme-switching branches, or `prefers-color-scheme` behavior. Existing dark-mode code
is a temporary Phase 0 migration exception: it may be removed, but not extended.

### 4.4 Responsive is mobile-first, always

Write base styles for mobile, then add `md:` / `lg:` / `xl:` breakpoints for larger
screens. Never write desktop-first and override down. If you find yourself using
`< sm:` or `@media (max-width:)`, you're doing it wrong.

---

## 5. Performance

### 5.1 Mouse-tracking composables are dead on touch devices

These composables must be conditionally loaded or gated:
- `useCard3D` — 3D tilt on hover
- `useCursor` — custom cursor with position tracking
- `useMagneticButton` — cursor-following button effect
- `useParticleSystem` — canvas animation with mouse interaction

**Rule:** If it tracks `mousemove`, it must check `isTouch` before initializing.
The `useMobilePerformance` composable provides `isTouch` and `isLowEndDevice` as
reactive refs. Use them.

### 5.2 New dependencies >50KB must be code-split

Before adding a new npm package, check its minified size on BundlePhobia. If >50KB,
it must be added to `manualChunks` in `vite.config.ts`. After adding, run
`npm run analyze` and verify the chunk is correctly isolated.

### 5.3 Images use SafeImage, never bare <img>

`<SafeImage>` provides lazy loading, blur placeholder, and error fallback.
A bare `<img>` tag is forbidden. If SafeImage doesn't support your use case,
extend SafeImage — don't bypass it.

### 5.4 GSAP animations are cleaned up in onUnmounted

Every composable that creates GSAP tweens or ScrollTrigger instances must kill
them in the returned cleanup function. Leaking GSAP instances causes memory growth
on route navigation and stale animation callbacks firing on unmounted components.

---

## 6. State Management

### 6.1 Stores own data; components own UI state

Pinia stores manage application data. Component-level UI state (dropdown open/close,
form inputs, tab selection) stays in the component via `ref`/`reactive`.

**Test:** If the state would survive a route navigation, it belongs in a store.
If it wouldn't, it belongs in the component.

### 6.2 Stores are setup-store syntax only

All stores use `defineStore('name', () => { ... })` with the setup function syntax.
No `state: {}`, `getters: {}`, `actions: {}` blocks. This matches the Composition
API pattern used everywhere else and enables full TypeScript inference.

### 6.3 Stores have no cross-dependencies

Stores must not import or call other stores. If two stores need shared data,
extract that data to a third store or a shared composable. Cross-store imports
create circular dependency risk and make testing impossible.

### 6.4 useAppStore is the only cross-cutting store

`useAppStore` manages global UI concerns (menu, toasts, modals, breadcrumbs).
Domain data has its own store. Never add cross-cutting concerns (like "is sidebar
open" or "current breadcrumb") to a domain store.

---

## 7. TypeScript

### 7.1 Strict mode is non-negotiable

`tsconfig.json` has `strict: true` (includes `noImplicitAny`, `strictNullChecks`,
`noUnusedLocals`, `noUnusedParameters`). Do not disable strict checks for any file,
any reason, any deadline.

### 7.2 `interface` for public APIs, `type` for internal logic

- `interface` — exported types that external code depends on (props, store state,
  API responses, utility function signatures)
- `type` — internal unions, mapped types, conditional types, utility types

When in doubt, use `interface`. It's the default for public surface.

### 7.3 `any` is a compiler error, not a workaround

The ESLint config enforces `@typescript-eslint/no-explicit-any: error`. If you
feel the urge to use `any`, you have one of three problems:
1. You don't understand the type → stop and figure it out
2. The type is genuinely unknown → use `unknown` with a type guard
3. A dependency has bad types → wrap it in a typed function, don't propagate the
   bad types outward

None of these are solved by `any`.

### 7.4 Types live in src/types/, not inline

Domain types (Project, BlogPost, Skill, ContactInfo, etc.) go in `src/types/` as
named exports. Do not inline `interface Foo { ... }` in a component script or store.
Inline types are fine for single-use, component-local shapes.

---

## 8. Composables

### 8.1 Naming: `useXxx.ts`, returns reactive values

Every composable file follows the `use` prefix convention. It returns refs,
computed properties, or a reactive object. It never returns stale plain values.

The return value must include a cleanup function when the composable creates
subscriptions, timers, event listeners, or animation instances.

### 8.2 No side effects on import

A composable must not execute side effects (DOM manipulation, store mutations,
network requests, event listener registration) at the top level of the module.
Side effects must be triggered explicitly by the consumer calling a function
returned by the composable.

### 8.3 Composables are self-contained

A composable must not reach into another composable's internal state. If two
composables need shared reactive state, extract it to a store or accept it as
a parameter. Composables compose through their return values, not through shared
module-level state.

### 8.4 No global registration

Do not add composables to `app.config.globalProperties`. They are imported
directly in `<script setup>` blocks. The cost of an explicit import is negligible;
the cost of implicit availability is enormous.

---

## 9. Accessibility

### 9.1 Every interactive element is keyboard accessible

Buttons, links, and custom interactive components must have:
- Visible focus indicators (`focus:` Tailwind classes)
- Keyboard handlers for non-native interactive elements (`@keydown.enter`,
  `@keydown.space`, `@keydown.escape`)
- Proper `role` and `aria-*` attributes where native semantics are insufficient

The Header mobile menu already implements focus trap and Escape handling — this
is the minimum bar, not the aspirational one.

### 9.2 Images have alt text

Every `<SafeImage>` must have an `alt` prop. Decorative images use `alt=""`.
An image without alt text is an accessibility violation, not a missing feature.

### 9.3 Color is never the only signal

Status, errors, and interactive states must use icons, text, or shape in addition
to color. Relying on color alone excludes color-blind users and fails WCAG 1.4.1.

### 9.4 Animations respect prefers-reduced-motion

Every animation composable must check `prefersReducedMotion` before running.
The `useMobilePerformance` composable exposes it as a reactive ref. If a composable
doesn't check it, it's not production-ready.

---

## 10. Visual Mode

### 10.1 The site has one light presentation mode

The accepted product mode is light-only with `#2563EB` as the primary accent.
Do not add a theme toggle, theme store, persisted theme preference, `dark` class,
`data-theme` switch, or alternate color-scheme branch. Phase 0 removes the legacy
infrastructure and clears or ignores previously persisted dark preferences.

### 10.2 Design tokens are defined in design-system/, not in components

New spacing, typography, shadow, or animation values go in `src/design-system/tokens/`.
Never hardcode `16px` or `rgba(99, 102, 241, 0.1)` in a component. If you're
about to type a color value in a component, stop — that's a design token.

### 10.3 Don't mix token systems

New code uses Tailwind utilities and named design tokens. When migrating a legacy
component, remove theme-switching variables and dark variants instead of leaving
parallel visual systems active, which creates cascade conflicts.

---

## 11. Routing

### 11.1 All route components use lazy loading

```ts
component: () => import('@/views/Xxx.vue')
```

Static imports for route components are forbidden. This enables code splitting
and is the reason each page loads as a separate JS chunk. If a route component
is imported statically, you've just negated the entire code-splitting strategy.

### 11.2 Every route has meta.title and meta.description

These feed into SEOHead as fallbacks and ensure every page has at least basic SEO.
A route without these is an incomplete route. No exceptions.

### 11.3 Dynamic route params are typed via props: true

Routes with params (`/projects/:id`, `/blog/:id`) must have `props: true` and the
view component must declare typed props. Accessing `$route.params` without type
safety in the component is a type error waiting to happen.

---

## 12. Build & CI

### 12.1 Build passes before every push

`npm run build` must succeed with zero errors. The build also generates
`sitemap.xml` and `rss.xml` via post-build hooks. If these files are missing
after build, the generation step has silently failed and must be investigated.

### 12.2 Lint passes with zero errors

`npm run lint` must report 0 errors. Warnings are tracked but are not a CI blocker.
Before committing, run lint and fix any errors your changes introduced. Do not
commit with new lint errors and the justification "I'll fix them later."

### 12.3 New env vars require .env.example documentation

Every new `VITE_*` environment variable must be added to `.env.example` with a
comment explaining its purpose and expected value. Undocumented env vars will be
removed during cleanup without warning.

---

## 13. What This Project Does NOT Do

Explicitly rejected patterns. If you're about to do any of these, stop and discuss:

- **No API backend for static data** — everything is in JSON files. Adding a REST
  or GraphQL API for content currently served from `assets/data/*.json` is a
  project-level architectural decision, not a component change.
- **No server-side rendering** — this is a static site built with Vite. SSR/SSG
  would require migrating to Nuxt, which is a project-level decision.
- **No CSS-in-JS** — Tailwind + CSS files only. No styled-components, emotion,
  or CSS modules. The build pipeline and code-splitting strategy depend on this.
- **No global event bus** — Vue's provide/inject is acceptable for deep component
  trees (Header → MobileNav). Stores are preferred for shared state. An event bus
  would introduce invisible coupling that breaks the unidirectional data flow.
- **No mutation of imported JSON** — imported JSON objects are read-only. Stores
  create local refs from JSON data via `ref([...importedData])`. Never call
  `importedData.push(newItem)` — it mutates the module-level frozen object and
  breaks HMR.

---

## 14. Decision-Making Framework

When you're unsure whether a change violates a rule:

1. **Does it make the code harder to delete?** If yes, it's wrong.
2. **Does it create a coupling that wasn't there before?** If yes, document why
   the coupling is necessary and where the seam is.
3. **Would a new team member understand this in 10 minutes?** If no, add a comment
   or simplify the implementation.
4. **Is this the simplest thing that could possibly work?** If no, simplify before
   committing. The best code is the code you don't write.
5. **Does this change have a test?** If it changes behavior and has no test, add
   one. If it can't be tested, it's too coupled.

These five questions are the meta-rules that govern all the rules above.
