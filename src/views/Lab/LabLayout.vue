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

import SEOHead from '@/components/common/SEOHead.vue'
import LabDemoPage from '@/components/lab/LabDemoPage.vue'
import { findLabEffect } from '@/config/labRegistry'
import { labEffectStructuredData } from '@/utils/structuredData'
import LabNotFound from './LabNotFound.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const routeId = computed(() => props.id)
const effect = computed(() => findLabEffect(routeId.value))
const structuredData = computed(() =>
  effect.value ? labEffectStructuredData(effect.value) : undefined
)

onMounted(() => window.scrollTo({ top: 0 }))
</script>
