<script setup lang="ts">
import { computed } from 'vue'
import educationData from '@/assets/data/education.json'
import type { Education } from '@/types/project'

const educations = computed<Education[]>(() => educationData as Education[])

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
</script>

<template>
  <div class="education">
    <h2 class="education__title">教育背景</h2>
    <div class="education__list">
      <div v-for="edu in educations" :key="edu.id" class="education__item">
        <div class="education__header">
          <div class="education__school">
            <h3 class="education__school-name">{{ edu.school }}</h3>
          </div>
          <div class="education__degree">
            <span class="education__degree-text">{{ edu.degree }}</span>
            <span v-if="edu.major" class="education__major">{{ edu.major }}</span>
          </div>
          <div class="education__date">
            {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
          </div>
        </div>

        <div v-if="edu.description" class="education__description">{{ edu.description }}</div>

        <div v-if="edu.gpa" class="education__gpa">
          <span class="education__label">GPA:</span>
          <span class="education__value">{{ edu.gpa }}</span>
        </div>

        <div v-if="edu.achievements && edu.achievements.length > 0" class="education__achievements">
          <h4 class="education__section-title">主要成就</h4>
          <ul class="education__list-items">
            <li v-for="(achievement, index) in edu.achievements" :key="index">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.education {
  padding: 2rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
}

.education__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 2rem 0;
}

.education__list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.education__item {
  padding: 1.5rem;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.education__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.education__school-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.education__degree {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.education__degree-text {
  font-size: 1rem;
  color: var(--color-primary);
  font-weight: 600;
}

.education__major {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.education__date {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.education__description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.education__gpa {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.education__label {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.education__value {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.education__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
}

.education__list-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.education__list-items li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.education__list-items li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

@media (min-width: 769px) {
  .education__header {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  .education__school {
    flex: 1;
  }

  .education__degree {
    flex: 1;
  }

  .education__date {
    flex: 1;
    text-align: right;
  }
}
</style>
