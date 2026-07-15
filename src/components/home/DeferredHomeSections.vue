<template>
  <div ref="triggerRef" class="min-h-[40rem]" data-home-deferred>
    <template v-if="shouldRender">
      <FeaturedBlog />

      <div class="home-section-gap">
        <div class="stripe-divider"></div>
      </div>

      <AboutSnapshot />

      <div class="home-section-gap">
        <div class="stripe-divider"></div>
      </div>

      <CTASection />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'

const FeaturedBlog = defineAsyncComponent(() => import('@/components/home/FeaturedBlog.vue'))
const AboutSnapshot = defineAsyncComponent(() => import('@/components/home/AboutSnapshot.vue'))
const CTASection = defineAsyncComponent(() => import('@/components/home/CTASection.vue'))

const triggerRef = ref<HTMLElement | null>(null)
const shouldRender = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window) || !triggerRef.value) {
    shouldRender.value = true
    return
  }
  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    shouldRender.value = true
    observer?.disconnect()
    observer = null
  }, { rootMargin: '160px 0px', threshold: 0.01 })
  observer.observe(triggerRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.home-section-gap {
  position: relative;
  height: var(--us-space-24);
}
</style>
