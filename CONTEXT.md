# MyPersonalWebsite Context

## Project Overview
Vue 3 + TypeScript + Tailwind portfolio and blog platform. Frontend-focused, with strict type safety and component isolation.

## Key Concepts

### Architecture & Patterns
- **Composition API** — all components use `<script setup>` with TypeScript
- **Composable** — extracted logic lives in `composables/` folder (e.g., `useBlogMetadata`, `useScrollTracker`)
- **Component** — Vue 3 SFC in `components/` (PascalCase names, no `<style scoped>` unless absolutely necessary)
- **Page** — top-level views in `pages/` (usually wrap composables and components)
- **Utility** — pure functions in `utils/` (camelCase, no side effects)

### Styling & Design
- **Tailwind First** — reach for Tailwind classes before any CSS
- **GSAP Animation** — use GSAP 3.14.2 for complex animations (scroll triggers, morphs, etc.)
- **Design System** — colors, spacing, typography defined in `tailwind.config.ts`
- **Dark Mode** — Tailwind's `dark:` prefix for theme switching

### Quality Gates (all must pass before merged)
1. **ESLint** — no errors, auto-fix on save
2. **TypeScript** — strict mode, no `any` types (use `unknown` + narrowing)
3. **Build** — `npm run build` succeeds
4. **Tests** — 80%+ coverage for new code
5. **Lighthouse** — performance score ≥ 90

### Content Model
- **Blog Post** — markdown file with YAML frontmatter (title, date, tags, description)
- **Portfolio Item** — project showcase with demo link, tech stack, role
- **Section** — reusable page segment (Hero, Testimonials, CTA, etc.)

### Conventions
- **File Naming** — Components: PascalCase; utilities/composables: camelCase; pages: kebab-case
- **Props** — typed with `defineProps<T>()`, never implicit
- **Emits** — typed with `defineEmits<T>()`, always explicit
- **Reactive State** — use `ref()` for primitives, `reactive()` only for plain objects
- **Computed** — prefer `computed()` over watchers when possible
- **Routes** — defined in `router/index.ts`, lazy-load large pages

## Codebase Organization
```
MyPersonalWebsite/
├── src/
│   ├── components/       # Vue 3 SFCs (PascalCase)
│   ├── composables/      # Reusable logic (camelCase)
│   ├── pages/            # Top-level views (kebab-case)
│   ├── utils/            # Pure functions (camelCase)
│   ├── router/           # Vue Router config
│   ├── App.vue           # Root component
│   └── main.ts           # Entry point
├── public/               # Static assets
├── tests/                # Vitest files (mirror src/ structure)
├── CLAUDE.md             # Claude Code project instructions
├── CONTEXT.md            # This file (domain language)
├── tailwind.config.ts    # Tailwind design system
├── vite.config.ts        # Vite build config
└── tsconfig.json         # TypeScript strict mode
```

## Tech Stack Versions
- Vue: 3.4.15
- TypeScript: 5.3.3
- Vite: 5.0.12
- Tailwind CSS: 3.4.1
- GSAP: 3.14.2
- Node.js: 22+

## Common Workflows

### Adding a New Blog Post
1. Create markdown file in `content/blog/` with frontmatter
2. Update `composables/useBlogMetadata.ts` if schema changes
3. Test blog list page renders new post
4. Run Lighthouse audit for performance

### Building a New Portfolio Showcase
1. Create component in `components/PortfolioItem.vue` with typed props
2. Add item to `data/portfolio.ts` (structured data)
3. Ensure all links are typed and tested
4. Update main portfolio page to import new component

### Refactoring Components
1. Identify component → create new file with same interface
2. Update all imports and tests
3. Run full test suite + ESLint before merging
4. Delete old file only after all tests pass

## Team Preferences (Claude Code Agent)
- When stuck, ask clarifying questions before implementing
- Always run `npm run lint` and tests before marking complete
- Prefer small, focused PRs over monolithic changes
- Default to TypeScript strict mode, no exceptions
- If a component grows >200 LOC, split it into sub-components
