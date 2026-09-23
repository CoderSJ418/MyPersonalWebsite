<template>
  <SEOHead
    :title="recipe?.title ?? '动效配方不存在'"
    :description="recipe?.summary ?? '没有找到这个动效配方。'"
    type="website"
    :robots="recipe && scene ? 'index,follow' : 'noindex,nofollow'"
    :structured-data="structuredData"
  />
  <PromptRecipeExperience v-if="recipe && scene" :recipe="recipe" :scene="scene" />
  <PromptRecipeNotFound v-else :id="id" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import SEOHead from '@/components/common/SEOHead.vue'
import PromptRecipeNotFound from '@/components/lab/PromptRecipeNotFound.vue'
import PromptRecipeExperience from '@/components/lab/PromptRecipeExperience.vue'
import {
  findPromptRecipe,
  resolvePromptRecipeScene
} from '@/config/promptRecipeRegistry'
import { promptRecipeStructuredData } from '@/utils/structuredData'

interface Props {
  id: string
}

const props = defineProps<Props>()
const recipe = computed(() => findPromptRecipe(props.id))
const scene = computed(() => {
  const current = recipe.value
  return current ? resolvePromptRecipeScene(current) : undefined
})
const structuredData = computed(() =>
  recipe.value && scene.value ? promptRecipeStructuredData(recipe.value, scene.value) : undefined
)

onMounted(() => window.scrollTo({ top: 0 }))
</script>
