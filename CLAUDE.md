# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is a **Vue 3 + TypeScript** portfolio website project (`MyPersonalWebsite`) featuring a personal portfolio, technical blog, and project showcases. It's a standalone Vue application with its own dependencies and workflow.

**Primary project location:** `E:/work/AI/MyPersonalWebsite/`

For user preferences and constraints, see memory files in `~/.claude/projects/E--work-AI/memory/`.

---

## Quick Start

```bash
cd MyPersonalWebsite

npm run dev         # Start dev server (localhost:5173)
npm run build       # Production build + sitemap generation
npm run preview     # Preview production build
npm run lint        # Run ESLint (auto-fixes on save)
npm run format      # Run Prettier
npm run test        # Run Vitest
npm run test:coverage # Run tests with coverage report
```

---

## Architecture & Structure

### High-Level Architecture

This is a **static portfolio website** built with modern Vue 3 tooling:

- **Frontend framework:** Vue 3.4.x with Composition API (`<script setup>`)
- **Language:** TypeScript 5.3.x (strict mode)
- **Build tool:** Vite 5.0.x with code splitting and optimization
- **State management:** Pinia 2.1.x
- **Routing:** Vue Router 4.2.x (lazy-loaded routes)
- **Styling:** Tailwind CSS 3.4.x with custom design tokens
- **Animations:** GSAP 3.14.2 (scroll triggers, complex animations)
- **Icons:** Lucide Vue Next 0.312.0
- **Content:** Markdown parsing with markdown-it
- **Testing:** Vitest 4.x with happy-dom environment

### Project Structure

```
MyPersonalWebsite/
├── src/
│   ├── api/                # API layer (analytics, CMS, types)
│   ├── assets/             # Static assets (images, data, styles)
│   │   ├── data/           # Local data files
│   │   └── styles/         # Global CSS files
│   ├── boot/               # App initialization (fonts, monitoring, service workers)
│   ├── components/         # Vue components (organized by feature)
│   │   ├── about/          # About page components
│   │   ├── blog/           # Blog-related components
│   │   ├── common/         # Shared/reusable components
│   │   ├── contact/        # Contact form components
│   │   ├── home/           # Homepage components
│   │   ├── interactive/    # Interactive UI components
│   │   ├── molecules/      # Atomic design molecules
│   │   ├── organisms/      # Atomic design organisms
│   │   ├── pixel/          # Pixel art demo components
│   │   ├── projects/       # Project showcase components
│   │   ├── skill/          # Skill display components
│   │   ├── templates/      # Page layout templates
│   │   └── ui/             # Base UI components
│   ├── composables/        # Reusable composable functions (camelCase)
│   ├── config/             # Configuration files
│   ├── design-system/      # Design tokens, themes, types
│   ├── router/             # Vue Router configuration
│   ├── services/           # External service integrations
│   ├── stores/             # Pinia stores (useXxxStore pattern)
│   ├── styles/             # Additional global styles
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions (camelCase)
│   ├── views/              # Page components (kebab-case)
│   ├── App.vue             # Root component
│   ├── main.ts             # App entry point
│   └── vite-env.d.ts       # Vite type declarations
├── public/                 # Static assets served as-is
├── tests/                  # Test files (mirror src/ structure)
│   └── unit/               # Unit tests
├── docs/                   # Project documentation and ADRs
├── scripts/                # Build scripts (e.g., sitemap generation)
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration with code splitting
├── vitest.config.ts        # Test configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── index.html              # HTML entry point
└── README.md               # Project overview (Chinese)
```

### Key Architectural Patterns

**1. Atomic Design System**
- **Atoms** → Base UI components (buttons, inputs)
- **Molecules** → Simple component groups
- **Organisms** → Complex UI sections
- **Templates** → Page layouts

**2. Composables over Mixins**
Reusable logic extracted into composables in `src/composables/`:
- `useAnalytics.ts` — Google Analytics integration
- `usePerformance.ts` — Performance monitoring
- `useGSAPAnimations.ts` — Animation helpers
- `useFormValidation.ts` — Form validation logic
- `useScrollAnimations.ts` — Scroll-based animations
- `useTheme.ts` — Theme management

**3. Store-Based State Management**
Pinia stores follow the `useXxxStore` pattern:
- `useAppStore` — App state (navigation, UI state)
- `useBlogStore` — Blog posts and metadata
- `useProjectStore` — Project data
- `useSkillStore` — Skills and proficiency data
- `useThemeStore` — Dark/light theme toggle
- `useAnalyticsStore` — Analytics tracking state
- `useSearchStore` — Search functionality

**4. Component Organization**
Components organized by **feature domain** (about, blog, projects, skills) rather than type, with shared components in `common/` and `ui/`.

---

## Common Development Tasks

### Running the Application

```bash
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build to /dist
npm run preview    # Preview production build locally
```

### Code Quality

```bash
npm run lint        # ESLint with auto-fix (--fix flag in script)
npm run format      # Prettier formatting for src/
npm run test        # Run all tests in watch mode
npm run test:run    # Run tests once (CI mode)
npm run test:coverage # Generate coverage report
```

### Build & Bundle Analysis

```bash
npm run build       # Production build with sitemap generation
npm run analyze     # Bundle visualizer (requires vite-bundle-visualizer)
```

### Adding a New Page

1. Create component in `src/views/YourPage.vue`
2. Add route in `src/router/index.ts` with lazy loading:
   ```typescript
   {
     path: '/your-page',
     name: 'YourPage',
     component: () => import('@/views/YourPage.vue')
   }
   ```
3. Add navigation link in appropriate component

### Adding a New Component

1. Determine appropriate directory in `src/components/` (by feature)
2. Create `.vue` file using `<script setup>` with TypeScript
3. Define props with `defineProps<T>()` and emits with `defineEmits<T>()`
4. Use Tailwind CSS classes for styling

### Adding a New Composable

1. Create file in `src/composables/useFeature.ts` (camelCase)
2. Export reactive logic using Composition API
3. Import in components as needed

### Adding a New Store

1. Create `src/stores/useFeatureStore.ts`
2. Define with `defineStore()` from Pinia
3. Import via `import { useFeatureStore } from '@/stores/useFeatureStore'`

---

## Code Conventions

### File Naming

- **Components:** PascalCase (e.g., `ProjectCard.vue`)
- **Composables/Utils:** camelCase (e.g., `useAnalytics.ts`)
- **Pages/Views:** kebab-case (e.g., `Home.vue`)
- **Stores:** camelCase with `use` prefix (e.g., `useProjectStore.ts`)

### TypeScript Standards

```typescript
// ✅ Use interface for public APIs
interface Project {
  id: string
  title: string
  description: string
}

// ✅ Use type for internal logic
type ProjectState = {
  items: Project[]
  loading: boolean
}

// ❌ Avoid any
// ❌ Use unknown with type narrowing instead
```

### Component Template Pattern

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props with typing
interface Props {
  title: string
  items: Project[]
}
const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

// Emits with typing
const emit = defineEmits<{
  (e: 'click', id: string): void
  (e: 'update', value: string): void
}>()

// Reactive state
const selected = ref<string | null>(null)

// Computed properties
const filteredItems = computed(() => 
  props.items.filter(item => /* ... */)
)

// Lifecycle
onMounted(() => {
  // Init logic
})
</script>

<template>
  <div class="container mx-auto px-4">
    <!-- Template -->
  </div>
</template>
```

### Import Order

```typescript
// 1. Vue imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. Third-party libraries
import { gsap } from 'gsap'

// 3. Internal imports (@/ alias)
import { useProjectStore } from '@/stores/useProjectStore'
import { ProjectCard } from '@/components/projects/ProjectCard.vue'
```

### Styling Guidelines

- **Primary:** Tailwind CSS utility classes
- **Secondary:** Custom CSS in `src/assets/styles/` or component `<style>` blocks
- **Dark mode:** Use Tailwind's `dark:` prefix
- **Responsive:** Mobile-first with Tailwind breakpoints
- **Avoid:** `<style scoped>` unless absolutely necessary

---

## Quality Gates (All Must Pass)

Before marking work complete or creating a PR:

1. **ESLint** — `npm run lint` passes with no errors
2. **TypeScript** — No type errors (strict mode enabled)
3. **Build** — `npm run build` succeeds
4. **Tests** — `npm run test:coverage` passes with ≥70% coverage
5. **Manual testing** — Test UI changes in dev server before committing

If you can't run a check, explicitly state that instead of claiming success.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- **Analytics:** `VITE_GA_MEASUREMENT_ID`
- **Monitoring:** `VITE_PERFORMANCE_ENDPOINT`, `VITE_LOG_ENDPOINT`
- **Deployment:** `GITHUB_TOKEN`, `VERCEL_TOKEN`, `SENTRY_DSN`
- **Contact:** `VITE_EMAIL`

**Never commit `.env` files** — they're in `.gitignore`.

---

## Routing

Routes defined in `src/router/index.ts` with lazy loading:

```typescript
{
  path: '/',
  name: 'Home',
  component: () => import('@/views/Home.vue')
}
```

Current routes include: Home, About, Projects, Blog, Skills, Contact, InteractiveDemo, PixelDemo, Education, Experience, NotFound.

---

## Design System

- **Design tokens:** `src/design-system/tokens/`
- **Themes:** `src/design-system/themes/` (dark/light mode)
- **Tailwind config:** `tailwind.config.js` (colors, spacing, typography)
- **Global styles:** `src/assets/styles/` (main.css, design-system.css, design-tokens.css)

---

## Testing

### Framework

- **Vitest 4.x** with happy-dom environment
- **Test files:** Mirror `src/` structure in `tests/unit/`
- **Coverage threshold:** 70% (lines, functions, branches, statements)

### Running Tests

```bash
npm run test              # Watch mode
npm run test:run          # Single run (CI)
npm run test:coverage     # With coverage report
```

### Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { useProjectStore } from '@/stores/useProjectStore'

describe('useProjectStore', () => {
  it('should return projects', () => {
    const store = useProjectStore()
    expect(store.projects).toBeDefined()
  })
})
```

---

## Performance Optimization

The build configuration includes:
- **Code splitting** — Vue, GSAP, utils, markdown, and highlight.js in separate chunks
- **CSS code splitting** — Critical CSS inlined, rest lazy-loaded
- **Gzip compression** — Files >10KB compressed
- **Module preloading** — Polyfill for better browser support
- **Console removal** — `console` and `debugger` stripped in production
- **Lazy loading** — Route-based code splitting
- **Image optimization** — Handled in assets pipeline

---

## Git Workflow

### Branch Naming

- `feature/description` — New features
- `fix/description` — Bug fixes
- `docs/description` — Documentation updates
- `refactor/description` — Code refactoring
- `test/description` — Test-related changes
- `chore/description` — Build/tooling changes

### Commit Convention

Follow **Conventional Commits**:
```bash
feat: add dark mode toggle
fix: resolve mobile navigation issue
docs: update API documentation
refactor: simplify component structure
test: add unit tests for utils
chore: update dependencies
```

---

## Key Files Reference

| Purpose | Location |
|---------|----------|
| App entry | `src/main.ts` |
| Root component | `src/App.vue` |
| Router config | `src/router/index.ts` |
| Stores | `src/stores/` |
| Composables | `src/composables/` |
| Components | `src/components/` |
| Pages | `src/views/` |
| Types | `src/types/` |
| Utils | `src/utils/` |
| API layer | `src/api/` |
| Styles | `src/assets/styles/` |
| Config | `src/config/` |
| Vite config | `vite.config.ts` |
| Tailwind config | `tailwind.config.js` |
| Test config | `vitest.config.ts` |

---

## Important Notes

### ⚠️ Before Making Changes

1. **Don't delete code or files** without explicit user approval
2. **Don't rename exports or types** without confirmation
3. **Creating new files** → ask first
4. **Changing component APIs** → ask first
5. **Restructuring components** → discuss approach first

### ✅ Safe to Modify

- Component logic and behavior
- Adding new types and interfaces
- Fixing bugs
- Adding new components/composables/stores
- Updating styles (within existing patterns)
- Adding tests

### 🌐 Supported Browsers

Check `tailwind.config.js` `content` section and `vite.config.ts` `target: 'es2015'` for browser support details.

---

## Documentation References

For deeper understanding, consult:
- **AI_GUIDE.md** — Comprehensive project understanding guide for AI assistants
- **CONTEXT.md** — Domain language and architectural decisions
- **CONTRIBUTING.md** — Contribution guidelines
- **README.md** — Project overview and quick start (Chinese)
- **docs/** — Project documentation and ADRs (Architecture Decision Records)

---

## Troubleshooting

### Dev server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
# Kill process on port 5173 or use different port
npm run dev -- --port 3000
```

### Build fails
```bash
# Run lint first to catch errors
npm run lint
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Tests failing
```bash
# Run in non-watch mode for CI
npm run test:run
# Check coverage report
npm run test:coverage
```

---

## Getting Help

If uncertain about any aspect of the codebase:
1. Check existing documentation in `docs/`
2. Review similar implementations in the codebase
3. **Ask the user** before making significant structural changes
4. Consult AI_GUIDE.md for architectural context

---

**Last updated:** 2026-06-28  
**Project version:** 1.0.0  
**Tech stack:** Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia + GSAP
