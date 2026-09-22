<template>
  <SEOHead
    :title="recipe?.title ?? '动效配方不存在'"
    :description="recipe?.summary ?? '没有找到这个动效配方。'"
    type="website"
    :robots="recipe && effect ? 'index,follow' : 'noindex,nofollow'"
    :structured-data="structuredData"
  />
  <PromptRecipeStudio v-if="recipe && effect" :recipe="recipe" :effect="effect" />
  <PromptRecipeNotFound v-else :id="id" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import SEOHead from '@/components/common/SEOHead.vue'
import PromptRecipeNotFound from '@/components/lab/PromptRecipeNotFound.vue'
import PromptRecipeStudio from '@/components/lab/PromptRecipeStudio.vue'
import {
  findPromptRecipe,
  resolvePromptRecipeEffect
} from '@/config/promptRecipeRegistry'
import { promptRecipeStructuredData } from '@/utils/structuredData'

interface Props {
  id: string
}

const props = defineProps<Props>()
const recipe = computed(() => findPromptRecipe(props.id))
const effect = computed(() => {
  const current = recipe.value
  return current ? resolvePromptRecipeEffect(current) : undefined
})
const structuredData = computed(() =>
  recipe.value && effect.value ? promptRecipeStructuredData(recipe.value, effect.value) : undefined
)

onMounted(() => window.scrollTo({ top: 0 }))
</script>
