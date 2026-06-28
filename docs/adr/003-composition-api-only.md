# ADR 003: Vue 3 Composition API (Script Setup Only)

## Status
Accepted

## Context
Vue 3 introduced Composition API alongside Options API. Both coexist in Vue 3 projects. Team must decide on a single pattern.

## Decision
All new components use `<script setup>` with TypeScript. No Options API in new code.

## Rationale
- **Consistency** — one mental model across codebase
- **Reusability** — composables naturally extract and share logic
- **Type Safety** — `<script setup>` + TypeScript = full IDE support, zero runtime type-checking
- **Bundle Size** — Composition API code tree-shakes better than Options API

## Consequences
- Cannot use `this` (which is correct; `this` in Options API is confusing)
- Requires familiarity with hooks like `ref()`, `computed()`, `watch()`, `onMounted()`
- Older team members on Options API need upskilling

## Patterns

### Props
```typescript
interface Props {
  modelValue: string;
  disabled?: boolean;
}

defineProps<Props>();
```

### Emits
```typescript
type Emits = {
  "update:modelValue": [value: string];
  "blur": [];
};

defineEmits<Emits>();
```

### Composables (shared logic)
```typescript
export const useBlogMetadata = () => {
  const posts = ref<BlogPost[]>([]);
  const loading = ref(false);
  
  const fetchPosts = async () => {
    loading.value = true;
    // ...
  };
  
  return { posts, loading, fetchPosts };
};
```

## Related ADRs
- (None currently)
