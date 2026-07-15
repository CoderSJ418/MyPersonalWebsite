<template>
  <SEOHead
    title="交互实验室"
    description="面向招聘经理与 Vue 开发者的交互能力展示：实时调参、可运行源码、真实应用与工程边界。"
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
