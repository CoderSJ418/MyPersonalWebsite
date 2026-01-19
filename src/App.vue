<template>
  <div id="app" :class="{ 'dark': appStore.theme === 'dark' }">
    <Header />
    <main class="min-h-screen pb-16 md:pb-0">
      <PageTransition type="fade">
        <RouterView />
      </PageTransition>
    </main>
    <Footer />
    <!-- 移动端底部导航 -->
    <MobileNav />
    <ScrollProgress />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import MobileNav from '@/components/common/MobileNav.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import ScrollProgress from '@/components/common/ScrollProgress.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.handleScroll()
})
</script>

<style scoped>
#app {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>