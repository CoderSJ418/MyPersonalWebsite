<script setup lang="ts">
import { computed, onMounted } from 'vue'
import personalInfoData from '@/assets/data/personal-info.json'
import type { PersonalInfo } from '@/types/project'
import SafeImage from '@/components/common/SafeImage.vue'

const personalInfo = computed<PersonalInfo>(() => personalInfoData as PersonalInfo)

onMounted(() => {
  document.title = `关于我 - ${personalInfo.value.name}`
})
</script>

<template>
  <div class="personal-info">
    <div class="personal-info__avatar">
      <SafeImage
        :src="personalInfo.avatar"
        :alt="personalInfo.name"
        width="200"
        height="200"
        object-fit="cover"
      />
    </div>

    <div class="personal-info__content">
      <h1 class="personal-info__name">{{ personalInfo.name }}</h1>
      <p class="personal-info__title">{{ personalInfo.title }}</p>
      <p class="personal-info__bio">{{ personalInfo.bio }}</p>

      <div class="personal-info__details">
        <div class="personal-info__detail">
          <span class="personal-info__label">📍 位置:</span>
          <span class="personal-info__value">{{ personalInfo.location }}</span>
        </div>
        <div class="personal-info__detail">
          <span class="personal-info__label">📧 邮箱:</span>
          <a :href="`mailto:${personalInfo.email}`" class="personal-info__link">
            {{ personalInfo.email }}
          </a>
        </div>
        <div v-if="personalInfo.phone" class="personal-info__detail">
          <span class="personal-info__label">📱 电话:</span>
          <a :href="`tel:${personalInfo.phone}`" class="personal-info__link">
            {{ personalInfo.phone }}
          </a>
        </div>
        <div class="personal-info__detail">
          <span class="personal-info__label">💼 工作经验:</span>
          <span class="personal-info__value">{{ personalInfo.yearsOfExperience }} 年</span>
        </div>
      </div>

      <div class="personal-info__social">
        <a
          v-if="personalInfo.website"
          :href="personalInfo.website"
          target="_blank"
          rel="noopener noreferrer"
          class="personal-info__social-link"
        >
          🌐 个人网站
        </a>
        <a
          v-if="personalInfo.github"
          :href="personalInfo.github"
          target="_blank"
          rel="noopener noreferrer"
          class="personal-info__social-link"
        >
          GitHub
        </a>
        <a
          v-if="personalInfo.linkedin"
          :href="personalInfo.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="personal-info__social-link"
        >
          LinkedIn
        </a>
        <a
          v-if="personalInfo.twitter"
          :href="personalInfo.twitter"
          target="_blank"
          rel="noopener noreferrer"
          class="personal-info__social-link"
        >
          Twitter
        </a>
      </div>

      <div v-if="personalInfo.languages.length > 0" class="personal-info__languages">
        <h3 class="personal-info__section-title">语言能力</h3>
        <div class="personal-info__tags">
          <span
            v-for="language in personalInfo.languages"
            :key="language"
            class="personal-info__tag"
          >
            {{ language }}
          </span>
        </div>
      </div>

      <div v-if="personalInfo.interests.length > 0" class="personal-info__interests">
        <h3 class="personal-info__section-title">兴趣爱好</h3>
        <div class="personal-info__tags">
          <span
            v-for="interest in personalInfo.interests"
            :key="interest"
            class="personal-info__tag"
          >
            {{ interest }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: var(--surface-1);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-md);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.personal-info:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.personal-info__avatar {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary-500);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.personal-info__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.personal-info__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}

.personal-info__name {
  font-size: 2rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.personal-info__title {
  font-size: 1.25rem;
  color: var(--primary-500);
  font-weight: 600;
  margin: 0;
}

.personal-info__bio {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.personal-info__details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.personal-info__detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.personal-info__label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 80px;
}

.personal-info__value {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.personal-info__link {
  font-size: 0.875rem;
  color: var(--primary-500);
  text-decoration: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.personal-info__link:hover {
  color: var(--primary-600);
  text-decoration: underline;
}

.personal-info__social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.personal-info__social-link {
  padding: 0.5rem 1rem;
  background-color: var(--primary-500);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.personal-info__social-link:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.personal-info__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.personal-info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.personal-info__tag {
  padding: 0.375rem 0.75rem;
  background-color: var(--surface-2);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--border-default);
  border-radius: 0.375rem;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.personal-info__tag:hover {
  background-color: var(--surface-1);
  border-color: var(--primary-500);
}

@media (min-width: 769px) {
  .personal-info {
    flex-direction: row;
    align-items: flex-start;
  }

  .personal-info__avatar {
    margin: 0;
    flex-shrink: 0;
  }

  .personal-info__content {
    text-align: left;
    flex: 1;
  }

  .personal-info__social {
    justify-content: flex-start;
  }

  .personal-info__tags {
    justify-content: flex-start;
  }
}
</style>
