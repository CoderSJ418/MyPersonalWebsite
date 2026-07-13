<script setup lang="ts">
import { computed, reactive, provide } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { labRegistry } from '@/config/labRegistry'
import SEOHead from '@/components/common/SEOHead.vue'
import CodeBlock from '@/components/blog/CodeBlock.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import LabNotFound from './LabNotFound.vue'

const route = useRoute()
const effect = computed(() => labRegistry.find(e => e.id === route.params.id))

const labParams = reactive<Record<string, string | number>>({})
provide('labParams', labParams)
</script>

<template>
  <SEOHead v-if="effect" :title="effect.name" :description="effect.description" type="webpage" />
  <div v-if="effect" class="lab-layout">
    <nav aria-label="Breadcrumb" class="lab-breadcrumb">
      <RouterLink to="/lab">效果实验室</RouterLink>
      <span class="lab-breadcrumb-sep">/</span>
      <span>{{ effect.name }}</span>
    </nav>
    <Suspense>
      <template #default>
        <component :is="effect.component" />
      </template>
      <template #fallback>
        <div class="lab-loading">加载效果中...</div>
      </template>
    </Suspense>
    <LabParamPanel v-if="effect.params?.length" v-model:model-value="labParams" :params="effect.params" />
    <CodeBlock :code="effect.code" :language="effect.language" :show-copy="true" :show-line-numbers="true" />
  </div>
  <LabNotFound v-else :id="route.params.id as string" />
</template>
