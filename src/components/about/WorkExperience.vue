<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue'
import { useExperienceStore } from '@/stores/useExperienceStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const experienceStore = useExperienceStore()
const workExperiences = computed(() => experienceStore.experiences)
const { staggerIn } = useGSAPAnimations()

onMounted(() => {
  experienceStore.loadExperiences()

  nextTick(() => {
    const items = document.querySelectorAll('.experience-item')
    if (items.length > 0) {
      staggerIn(items, { duration: 0.8, delay: 0.2 })
    }
  })
})
</script>

<template>
  <div class="work-experience">
    <h2 class="work-experience__title">工作经历</h2>
    <div class="work-experience__list">
      <div v-for="experience in workExperiences" :key="experience.id" class="work-experience__item">
        <div class="work-experience__header">
          <div class="work-experience__company">
            <h3 class="work-experience__company-name">{{ experience.company }}</h3>
            <span v-if="experience.current" class="work-experience__current">当前</span>
          </div>
          <div class="work-experience__position">{{ experience.position }}</div>
          <div class="work-experience__location">{{ experience.location }}</div>
          <div class="work-experience__duration">
            {{ experience.startDate }} - {{ experience.endDate }} （{{ experience.duration }}）
          </div>
        </div>

        <p class="work-experience__description">{{ experience.description }}</p>

        <div v-if="experience.achievements.length > 0" class="work-experience__achievements">
          <h4 class="work-experience__section-title">主要成就</h4>
          <div class="space-y-3">
            <div
              v-for="achievement in experience.achievements"
              :key="achievement.title"
              class="rounded-lg p-4 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <h5 class="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                {{ achievement.title }}
              </h5>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                {{ achievement.description }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="experience.techStack.length > 0" class="work-experience__technologies">
          <h4 class="work-experience__section-title">技术栈</h4>
          <div class="work-experience__tags">
            <span v-for="tech in experience.techStack" :key="tech" class="work-experience__tag">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-experience {
  padding: 2rem;
  background-color: var(--surface-1);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-md);
}

.work-experience__title {
  font-size: 1.5rem;
  font-weight: 600;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 2rem 0;
}

.work-experience__list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.work-experience__item {
  padding: 1.5rem;
  background-color: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.work-experience__item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-500);
}

.work-experience__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.work-experience__company {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.work-experience__company-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.work-experience__current {
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-500);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
}

.work-experience__position {
  font-size: 1rem;
  color: var(--primary-500);
  font-weight: 500;
}

.work-experience__location {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.work-experience__duration {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.work-experience__description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.work-experience__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.work-experience__list-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.work-experience__list-items li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.work-experience__list-items li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-500);
  font-weight: bold;
}

.work-experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.work-experience__tag {
  padding: 0.375rem 0.75rem;
  background-color: var(--surface-1);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--border-default);
  border-radius: 0.375rem;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.work-experience__tag:hover {
  background-color: var(--surface-2);
  border-color: var(--primary-500);
}

@media (min-width: 769px) {
  .work-experience__header {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  .work-experience__company {
    flex: 1;
  }

  .work-experience__position {
    flex: 1;
  }

  .work-experience__location {
    flex: 1;
  }

  .work-experience__duration {
    flex: 1;
    text-align: right;
  }
}
</style>
