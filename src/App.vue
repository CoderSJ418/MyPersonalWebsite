<template>
  <div id="app">
    <Header />
    <main id="main-content" class="min-h-screen min-h-dvh pb-16 md:pb-0">
      <RouterView v-slot="{ Component, route }">
        <Suspense :timeout="300">
          <Transition name="route-fade" mode="out-in">
            <ErrorBoundary>
              <component :is="Component" :key="route.path" />
            </ErrorBoundary>
          </Transition>
          <template #fallback>
            <RouteSkeleton />
          </template>
        </Suspense>
      </RouterView>
    </main>
    <Footer />
    <ContactCTA />
    <ScrollProgress v-if="showScrollProgress" />
    <PrivacyPreferences />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import ContactCTA from '@/components/common/ContactCTA.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import RouteSkeleton from '@/components/common/RouteSkeleton.vue'
import PrivacyPreferences from '@/components/common/PrivacyPreferences.vue'

const ScrollProgress = defineAsyncComponent(
  () => import('@/components/common/ScrollProgress.vue')
)
const showScrollProgress = ref(false)
let scrollProgressTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  scrollProgressTimer = setTimeout(() => {
    showScrollProgress.value = true
  }, 2500)
})

onUnmounted(() => clearTimeout(scrollProgressTimer))
</script>

<style scoped>
#app {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background: #fff;
  color: #0f172a;
}

.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 180ms ease;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .route-fade-enter-active,
  .route-fade-leave-active {
    transition: none;
  }
}
</style>
