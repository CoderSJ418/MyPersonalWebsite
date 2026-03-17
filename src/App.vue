<template>
  <div id="app" :class="{ dark: appStore.theme === 'dark' }">
    <!-- 交互式效果 - 已禁用粒子效果以消除 AI 味 -->
    <!-- <ParticleBackground :theme="appStore.theme" /> -->
    
    <Header />
    <main id="main-content" class="min-h-screen pb-16 md:pb-0">
      <RouterView v-slot="{ Component }">
        <PageTransition type="fade">
          <component :is="Component" />
        </PageTransition>
      </RouterView>
    </main>
    <Footer />
    <!-- 移动端底部导航 -->
    <MobileNav />
    <ScrollProgress />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useThemeStore } from '@/stores/useThemeStore'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import MobileNav from '@/components/common/MobileNav.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import ScrollProgress from '@/components/common/ScrollProgress.vue'
// import ParticleBackground from '@/components/interactive/ParticleBackground.vue'

const appStore = useAppStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initialize()
})
</script>

<style scoped>
#app {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
