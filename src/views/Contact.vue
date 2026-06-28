<template>
  <main class="contact-page">
    <PageHero
title="联系方式" subtitle="联系我" badge="{ icon: '✉️', text: '取得联系' }"
      :stats="[
        { number: '24h', label: '响应时间' },
        { number: '100%', label: '项目交付' },
        { number: '7年', label: '开发经验' }
      ]"
    />

    <!-- 主要内容区 -->
    <div class="contact-content">
      <!-- 表单区域 -->
      <div class="contact-form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 class="section-title">发送消息</h2>
          <p class="section-description">
            填写下面的表单，我会尽快回复您
          </p>
        </div>
        <ContactForm @submit="handleFormSubmit" />
      </div>

      <!-- 信息区域 -->
      <div class="contact-info-section">
        <!-- 联系信息 -->
        <div class="info-card">
          <div class="info-card__header">
            <div class="info-card__icon info-card__icon--primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="info-card__title">联系方式</h3>
          </div>
          <ContactInfoDisplay :contact-info="contactInfo" />
        </div>

        <!-- 社交媒体 -->
        <div class="info-card">
          <div class="info-card__header">
            <div class="info-card__icon info-card__icon--secondary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="info-card__title">社交媒体</h3>
          </div>
          <SocialLinks :github="contactInfo.social.github" :email="contactInfo.email" :linkedin="contactInfo.social.linkedin" :twitter="contactInfo.social.twitter" />
        </div>

        <!-- 工作时间 -->
        <div class="info-card">
          <div class="info-card__header">
            <div class="info-card__icon info-card__icon--success">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="info-card__title">工作时间</h3>
          </div>
          <div class="working-hours">
            <div class="working-hours__item">
              <span class="working-hours__day">周一至周五</span>
              <span class="working-hours__time">09:00 - 18:00</span>
            </div>
            <div class="working-hours__item">
              <span class="working-hours__day">周六</span>
              <span class="working-hours__time">10:00 - 16:00</span>
            </div>
            <div class="working-hours__item working-hours__item--inactive">
              <span class="working-hours__day">周日</span>
              <span class="working-hours__time">休息</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import contactInfoData from '@/assets/data/contact-info.json'
import type { ContactInfo } from '@/types/project'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactInfoDisplay from '@/components/contact/ContactInfoDisplay.vue'
import SocialLinks from '@/components/common/SocialLinks.vue'
import type { ContactFormData } from '@/types/project'

const contactInfo = computed<ContactInfo>(() => contactInfoData as ContactInfo)

const handleFormSubmit = (data: ContactFormData) => {
  console.log('Form submitted:', data)
  // TODO: 实现实际的表单提交逻辑
  // 可以发送到后端 API 或使用第三方服务如 Formspree
}

onMounted(() => {
  document.title = '联系我 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
/* 联系页面 */
.contact-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 0;
}

/* 英雄区域 */
.contact-hero {
  position: relative;
  padding: 6rem 0 3rem;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 50%, var(--primary-200) 100%);
  overflow: hidden;
}

.dark .contact-hero {
  background: linear-gradient(135deg, var(--primary-950) 0%, var(--primary-900) 50%, var(--primary-800) 100%);
}

.contact-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.contact-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.dark .contact-hero__badge {
  background: var(--bg-secondary);
}

.contact-hero__badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.contact-hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-hero__subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}

.contact-hero__stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* 主要内容区 */
.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* 表单区域 */
.contact-form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify: center;
  background: var(--primary-50);
  border-radius: 0.75rem;
  color: var(--primary-600);
  box-shadow: var(--shadow-sm);
}

.dark .section-icon {
  background: var(--primary-950);
  color: var(--primary-400);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.section-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 信息区域 */
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.info-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify: center;
  border-radius: 0.75rem;
  color: white;
}

.info-card__icon--primary {
  background: var(--gradient-primary);
}

.info-card__icon--secondary {
  background: var(--gradient-accent);
}

.info-card__icon--success {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

.info-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 工作时间 */
.working-hours {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.working-hours__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.working-hours__item:hover {
  background: var(--primary-50);
}

.dark .working-hours__item:hover {
  background: var(--primary-950);
}

.working-hours__item--inactive {
  opacity: 0.5;
}

.working-hours__day {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.working-hours__time {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 968px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .contact-hero__stats {
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .contact-hero {
    padding: 4rem 1rem 3rem;
  }
  
  .contact-hero__stats {
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .contact-content {
    padding: 3rem 1rem;
    gap: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .contact-hero__badge,
  .info-card,
  .working-hours__item {
    transition-duration: 0.01ms !important;
  }
}
</style>
