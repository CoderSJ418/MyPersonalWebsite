<script setup lang="ts">
import type { BlogPost } from '@/types/blog'
import ContentCard from '@/components/common/ContentCard.vue'

interface Props {
  posts: BlogPost[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '相关文章'
})

const emit = defineEmits<{
  click: [post: BlogPost]
}>()
</script>

<template>
  <section class="related-posts">
    <h3 class="related-posts__title">{{ title }}</h3>
    <div class="related-posts__grid">
      <ContentCard
v-for="post in posts" :key="post.id" variant="blog" :title="post.title" :description="post.excerpt"
        :category="post.category" :date="post.publishedAt" :read-time="post.readTime" :tags="post.tags"
        :cover-image="post.coverImage" :href="`/blog/${post.id}`" @click="emit('click', post)" />
    </div>
  </section>
</template>

<style scoped>
.related-posts {
  margin-top: var(--us-space-12);
  padding: var(--us-space-8);
  background-color: var(--us-surface-hover);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
}

.related-posts__title {
  margin: 0 0 var(--us-space-6) 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--us-text-primary);
  padding-bottom: var(--us-space-4);
  border-bottom: 1px solid var(--us-border);
}

.related-posts__grid {
  display: grid;
  gap: var(--us-space-6);
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .related-posts {
    padding: var(--us-space-6);
    margin-top: var(--us-space-8);
  }

  .related-posts__title {
    font-size: 1.125rem;
  }

  .related-posts__grid {
    grid-template-columns: 1fr;
  }
}
</style>
