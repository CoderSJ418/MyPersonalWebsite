<template>
  <main class="blog-page">
    <!-- 英雄区域 -->
    <section class="blog-hero">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="blog-hero__content">
          <div class="blog-hero__badge">
            <span class="badge-icon">✍️</span>
            <span class="badge-text">技术博客</span>
          </div>
          
          <h1 class="blog-hero__title">
            <span class="text-gradient">分享知识</span>
            <br />
            记录成长
          </h1>
          
          <p class="blog-hero__subtitle">
            分享 Vue 3、TypeScript、前端工程化等技术文章，记录开发过程中的思考和心得
          </p>
          
          <!-- 统计数据 -->
          <div class="blog-hero__stats">
            <div class="stat-item">
              <div class="stat-number">{{ blogStore.posts.length }}</div>
              <div class="stat-label">篇文章</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ blogStore.allTags.length }}</div>
              <div class="stat-label">个标签</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalReadTime }}</div>
              <div class="stat-label">分钟阅读</div>
            </div>
          </div>
        </div>
        
        <!-- 装饰性元素 -->
        <div class="blog-hero__decoration">
          <div class="decoration-circle decoration-circle--1"></div>
          <div class="decoration-circle decoration-circle--2"></div>
          <div class="decoration-circle decoration-circle--3"></div>
        </div>
      </div>
    </section>

    <!-- 搜索和筛选区域 -->
    <section class="blog-controls">
      <div class="container mx-auto px-4 sm:px-6">
        <!-- 搜索框 -->
        <div class="search-section">
          <div class="search-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="blogStore.searchQuery"
              type="text"
              placeholder="搜索文章标题、内容或标签..."
              class="search-input"
              @input="handleSearch"
            />
            <button
              v-if="blogStore.searchQuery"
              type="button"
              class="search-clear"
              @click="clearSearch"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div v-if="blogStore.searchQuery" class="search-result">
            找到 <span class="result-count">{{ blogStore.filteredPosts.length }}</span> 篇相关文章
          </div>
        </div>

        <!-- 标签筛选 -->
        <div v-if="blogStore.allTags.length > 0" class="tags-section">
          <div class="tags-wrapper">
            <button
              type="button"
              class="tag-btn"
              :class="{ 'tag-btn--active': blogStore.selectedTag === null }"
              @click="handleTagClick(null)"
            >
              全部
            </button>
            <button
              v-for="tag in blogStore.allTags"
              :key="tag"
              type="button"
              class="tag-btn"
              :class="{ 'tag-btn--active': blogStore.selectedTag === tag }"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 博客列表区域 -->
    <section class="blog-list">
      <div class="container mx-auto px-4 sm:px-6">
        <BlogList
          :posts="blogStore.paginatedPosts"
          :current-page="blogStore.currentPage"
          :total-pages="blogStore.totalPages"
          :loading="blogStore.loading"
          :error="blogStore.error"
          :items-per-page="blogStore.itemsPerPage"
          @post-click="handlePostClick"
          @tag-click="handleTagClick"
          @page-change="handlePageChange"
          @retry="blogStore.loadPosts"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import BlogList from '@/components/blog/BlogList.vue'

const router = useRouter()
const blogStore = useBlogStore()

const totalReadTime = computed(() => {
  return blogStore.posts.reduce((total, post) => total + post.readTime, 0)
})

const handlePostClick = (post: any) => {
  router.push(`/blog/${post.id}`)
}

const handleTagClick = (tag: string | null) => {
  blogStore.filterByTag(tag)
}

const handleSearch = () => {
  blogStore.searchPosts(blogStore.searchQuery)
}

const clearSearch = () => {
  blogStore.searchPosts('')
}

const handlePageChange = (page: number) => {
  blogStore.setPage(page)
}

onMounted(() => {
  blogStore.loadPosts()
  document.title = '技术博客 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
/* 博客页面 */
.blog-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 英雄区域 */
.blog-hero {
  position: relative;
  padding: 6rem 0 4rem;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 50%, var(--primary-200) 100%);
  dark:background(linear-gradient(135deg, var(--primary-950) 0%, var(--primary-900) 50%, var(--primary-800) 100%));
  overflow: hidden;
}

.blog-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.blog-hero__content {
  position: relative;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  z-index: 1;
}

.blog-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  background: white;
  dark:background(var(--surface-2));
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.blog-hero__badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.blog-hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-hero__subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}

.blog-hero__stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* 装饰性元素 */
.blog-hero__decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(60px);
  animation: float-circle 20s ease-in-out infinite;
}

.decoration-circle--1 {
  width: 300px;
  height: 300px;
  background: var(--primary-500);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.decoration-circle--2 {
  width: 200px;
  height: 200px;
  background: var(--accent-pink-500);
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.decoration-circle--3 {
  width: 250px;
  height: 250px;
  background: var(--accent-amber-500);
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

@keyframes float-circle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 搜索和筛选区域 */
.blog-controls {
  padding: 3rem 0 2rem;
  background: var(--bg-primary);
}

/* 搜索部分 */
.search-section {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3.5rem;
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-clear:hover {
  background: var(--surface-2);
  color: var(--text-secondary);
}

.search-result {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.result-count {
  font-weight: 600;
  color: var(--primary-600);
  dark:color(var(--primary-400));
}

/* 标签部分 */
.tags-section {
  max-width: 800px;
  margin: 0 auto;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.tag-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-btn:hover {
  background: var(--surface-2);
  color: var(--text-primary);
  border-color: var(--primary-300);
  dark:border(var(--primary-700));
}

.tag-btn--active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}

/* 博客列表区域 */
.blog-list {
  padding: 2rem 0 4rem;
  background: var(--bg-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .blog-hero {
    padding: 4rem 0 3rem;
  }
  
  .blog-hero__stats {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .blog-controls {
    padding: 2rem 0 1.5rem;
  }
  
  .blog-list {
    padding: 1.5rem 0 3rem;
  }
}

@media (max-width: 640px) {
  .blog-hero__stats {
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .search-input {
    font-size: 0.9375rem;
  }
  
  .decoration-circle {
    opacity: 0.2;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .blog-hero__badge,
  .decoration-circle,
  .search-input,
  .search-clear,
  .tag-btn {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>