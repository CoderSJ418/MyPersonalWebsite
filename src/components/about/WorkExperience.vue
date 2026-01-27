<script setup lang="ts">
import { computed } from 'vue'
import workExperienceData from '@/assets/data/work-experience.json'
import type { WorkExperience } from '@/types/project'

const workExperiences = computed<WorkExperience[]>(() => workExperienceData as WorkExperience[])

const formatDate = (date: string) => {
  const [year, month] = date.split('-')
  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ]
  return `${year}年${monthNames[parseInt(month) - 1]}`
}

const getDuration = (startDate: string, endDate?: string, current?: boolean) => {
  const start = new Date(startDate)
  const end = current ? new Date() : new Date(endDate || startDate)
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years > 0 && remainingMonths > 0) {
    return `${years}年${remainingMonths}个月`
  } else if (years > 0) {
    return `${years}年`
  } else {
    return `${remainingMonths}个月`
  }
}
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
            {{ formatDate(experience.startDate) }} -
            {{ experience.current ? '至今' : formatDate(experience.endDate || '') }} （{{
              getDuration(experience.startDate, experience.endDate, experience.current)
            }}）
          </div>
        </div>

        <p class="work-experience__description">{{ experience.description }}</p>

        <div v-if="experience.achievements.length > 0" class="work-experience__achievements">
          <h4 class="work-experience__section-title">主要成就</h4>
          <ul class="work-experience__list-items">
            <li v-for="(achievement, index) in experience.achievements" :key="index">
              {{ achievement }}
            </li>
          </ul>
        </div>

        <div v-if="experience.technologies.length > 0" class="work-experience__technologies">
          <h4 class="work-experience__section-title">技术栈</h4>
          <div class="work-experience__tags">
            <span v-for="tech in experience.technologies" :key="tech" class="work-experience__tag">
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
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
}

.work-experience__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 2rem 0;
}

.work-experience__list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.work-experience__item {
  padding: 1.5rem;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
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
  color: var(--color-text-primary);
  margin: 0;
}

.work-experience__current {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
}

.work-experience__position {
  font-size: 1rem;
  color: var(--color-primary);
  font-weight: 500;
}

.work-experience__location {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.work-experience__duration {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.work-experience__description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.work-experience__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
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
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.work-experience__list-items li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

.work-experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.work-experience__tag {
  padding: 0.375rem 0.75rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
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
