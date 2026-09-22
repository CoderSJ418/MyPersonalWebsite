<template>
  <SEOHead
    title="交互实验室"
    description="面向招聘经理与 Vue 前端开发者的 Motion Scene Gallery：Three.js、Canvas、GLSL Shader、DOM Motion、实时调参与真实实现源码。"
    type="website"
    :structured-data="structuredData"
  />
  <LabCatalog />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import LabCatalog from '@/components/lab/LabCatalog.vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { labRegistry } from '@/config/labRegistry'
import { labCollectionStructuredData } from '@/utils/structuredData'

const structuredData = labCollectionStructuredData(labRegistry)

onMounted(() => window.scrollTo({ top: 0 }))
</script>
