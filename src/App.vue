<template>
  <div id="app" :class="{ dark: appStore.theme === 'dark' }" class="vs-bg-layered">
    <!-- ═══════════════════════════════════════════════════════════
         Global Visual System — 5-Layer Architecture
         ═══════════════════════════════════════════════════════════
         Layer 0: Background Field — noise + grid + vignette
         Layer 1: Light Field — global spotlight (唯一光源)
         Layer 2: Surface System — cards / blog / hero blocks
         Layer 3: Interaction Layer — hover glow / tilt / spotlight
         Layer 4: Content — text / metrics / code
         ═══════════════════════════════════════════════════════════ -->

    <!-- Layer 0: Background Field — static noise texture (replaced feTurbulence for GPU perf) -->
    <div class="vs-noise-overlay" aria-hidden="true"></div>
    <div class="vs-grid-overlay" aria-hidden="true"></div>
    <div class="vs-vignette-overlay" aria-hidden="true"></div>

    <!-- 交互式效果 - 已禁用粒子效果以消除 AI 味 -->
    <!-- <ParticleBackground :theme="appStore.theme" /> -->
    
    <Header />
    <main id="main-content" class="min-h-screen min-h-dvh pb-16 md:pb-0">
      <RouterView v-slot="{ Component, route }">
        <Suspense :timeout="300">
          <PageTransition type="fade">
            <ErrorBoundary>
              <component :is="Component" :key="route.path" />
            </ErrorBoundary>
          </PageTransition>
          <template #fallback>
            <RouteSkeleton />
          </template>
        </Suspense>
      </RouterView>
    </main>
    <Footer />
    <!-- 移动端底部导航 -->
    <MobileNav />
    <!-- 浮动联系CTA按钮 -->
    <ContactCTA />
    <ScrollProgress />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useCursorInteraction } from '@/composables/useCursorInteraction'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import MobileNav from '@/components/common/MobileNav.vue'
import ContactCTA from '@/components/common/ContactCTA.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import ScrollProgress from '@/components/common/ScrollProgress.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import RouteSkeleton from '@/components/common/RouteSkeleton.vue'
// import ParticleBackground from '@/components/interactive/ParticleBackground.vue'

const appStore = useAppStore()
const themeStore = useThemeStore()

// Global Light System — 全站唯一光源 + cursor glow + magnetic + distortion
// 设置 --global-light-x/y (viewport %) on <html>
// 所有组件通过此光源驱动光效，禁止独立mouse tracking
useCursorInteraction({
  enableGlow: true,
  enableMagnetic: true,
  enableDistortion: true,
  enableSurface: true,
  enableFocus: true,
})

onMounted(() => {
  themeStore.initialize()
})
</script>

<style scoped>
#app {
  position: relative;
  min-height: 100vh; /* fallback for older browsers */
  min-height: 100dvh; /* dynamic viewport height for mobile */
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
