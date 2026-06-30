<template>
  <div class="pt-16">
    <SEOHead
      title="佘杰 - 前端开发工程师"
      description="7年前端开发经验，Vue 专家，专注于构建高性能、可维护的前端应用"
      keywords="佘杰,前端开发,Vue.js,TypeScript,JavaScript,Web开发"
      type="profile"
      :structured-data="personStructuredData()"
    />
    <HeroSection />
    <TechStack />
    <FeaturedProjects />
    <CTASection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import TechStack from '@/components/home/TechStack.vue'
import FeaturedProjects from '@/components/home/FeaturedProjects.vue'
import CTASection from '@/components/home/CTASection.vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { personStructuredData } from '@/utils/structuredData'
</script>
