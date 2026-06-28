# CLAUDE.md — MyPersonalWebsite

This file provides guidance to Claude Code when working with this Vue 3 project.

## Quick Start

```bash
npm run dev         # Start dev server (localhost:5173)
npm run build       # Production build
npm run lint        # Run ESLint (auto-fixes)
npm run test        # Run tests
```

## Change Principles

**Reference:** See global memory `~/.claude/memory/change_principles.md`

**In this project:**
- ✅ Change component logic, add types, fix bugs
- ❌ Don't rename exports, delete code, or restructure components without asking
- ⚠️ If you need to create new files or change component APIs → ask first

## Code Patterns

### Vue 3 Composition API
- `<script setup>` with TypeScript
- `defineProps()` for props, `defineEmits()` for events
- Reusable logic → `composables/` folder
- Tailwind CSS first; avoid `<style scoped>` unless necessary
- Components: PascalCase, utilities/composables: camelCase

### TypeScript
- Strict mode: `noImplicitAny`, `strictNullChecks`
- Public APIs use `interface`, internal logic uses `type`
- No `any` — use `unknown` with type narrowing

## Quality Gates

Before finishing, verify:
1. `npm run lint` — no errors
2. No TypeScript errors
3. `npm run build` — succeeds
4. `npm run test` — passes (80%+ coverage for new code)
5. For UI changes: test manually in dev server

If you can't run a check, say so explicitly.

## Project Structure

```
src/
├── components/       # Vue components
├── composables/      # Reusable logic
├── pages/           # Page components
├── styles/          # Global styles
└── types/           # TypeScript types
```

## When to Ask Me

- Before deleting any code or files
- Before renaming components, exports, or types
- Before creating new files or directories
- If you find code that looks outdated but you're unsure

