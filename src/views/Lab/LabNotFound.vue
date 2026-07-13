<script setup lang="ts">
import { useRoute } from 'vue-router'
import SEOHead from '@/components/common/SEOHead.vue'

const route = useRoute()
</script>

<template>
  <SEOHead title="效果不存在" description="该效果未找到" type="webpage" />
  <div class="lab-not-found">
    <h1>404</h1>
    <p>效果 "{{ route.params.id }}" 不存在</p>
    <RouterLink to="/lab">浏览所有效果 →</RouterLink>
  </div>
</template>
