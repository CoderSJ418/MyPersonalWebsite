<template>
  <div id="app" :class="{ dark: appStore.theme === 'dark' }">
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
    <ContactCTA />
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
import ContactCTA from '@/components/common/ContactCTA.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import ScrollProgress from '@/components/common/ScrollProgress.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import RouteSkeleton from '@/components/common/RouteSkeleton.vue'

const appStore = useAppStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initialize()
})
</script>

<style scoped>
#app {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
