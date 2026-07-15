<template>
  <template v-if="effect">
    <SEOHead
      :title="effect.name"
      :description="effect.description"
      type="website"
      :structured-data="structuredData"
    />
    <LabDemoPage :effect="effect" />
  </template>
  <LabNotFound v-else :id="routeId" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import SEOHead from '@/components/common/SEOHead.vue'
import LabDemoPage from '@/components/lab/LabDemoPage.vue'
import { findLabEffect } from '@/config/labRegistry'
import { labEffectStructuredData } from '@/utils/structuredData'
import LabNotFound from './LabNotFound.vue'

const route = useRoute()
const routeId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const effect = computed(() => findLabEffect(routeId.value))
const structuredData = computed(() =>
  effect.value ? labEffectStructuredData(effect.value) : undefined
)

onMounted(() => window.scrollTo({ top: 0 }))
</script>
