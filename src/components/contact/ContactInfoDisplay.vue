<template>
  <div class="contact-info-display">
    <h3 class="contact-info-display__title">联系信息</h3>

    <div class="contact-info-display__items">
      <div v-if="contactInfo.email" class="contact-info-display__item">
        <Mail :size="20" class="contact-info-display__icon" />
        <div class="contact-info-display__content">
          <span class="contact-info-display__label">邮箱</span>
          <a
            :href="`mailto:${contactInfo.email}`"
            class="contact-info-display__value contact-info-display__value--link"
          >
            {{ contactInfo.email }}
          </a>
        </div>
      </div>

      <div v-if="contactInfo.phone" class="contact-info-display__item">
        <Phone :size="20" class="contact-info-display__icon" />
        <div class="contact-info-display__content">
          <span class="contact-info-display__label">电话</span>
          <a
            :href="`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`"
            class="contact-info-display__value contact-info-display__value--link"
          >
            {{ contactInfo.phone }}
          </a>
        </div>
      </div>

      <div v-if="contactInfo.location" class="contact-info-display__item">
        <MapPin :size="20" class="contact-info-display__icon" />
        <div class="contact-info-display__content">
          <span class="contact-info-display__label">位置</span>
          <span class="contact-info-display__value">{{ contactInfo.location }}</span>
        </div>
      </div>

      <div v-if="contactInfo.availability" class="contact-info-display__item">
        <Clock :size="20" class="contact-info-display__icon" />
        <div class="contact-info-display__content">
          <span class="contact-info-display__label">状态</span>
          <span class="contact-info-display__value">{{ contactInfo.availability }}</span>
        </div>
      </div>

      <div v-if="contactInfo.responseTime" class="contact-info-display__item">
        <MessageSquare :size="20" class="contact-info-display__icon" />
        <div class="contact-info-display__content">
          <span class="contact-info-display__label">回复时间</span>
          <span class="contact-info-display__value">{{ contactInfo.responseTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-vue-next'
import type { ContactInfo } from '@/types/project'

interface Props {
  contactInfo: ContactInfo
}

defineProps<Props>()
</script>

<style scoped>
.contact-info-display {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-info-display__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.contact-info-display__items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-info-display__item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.contact-info-display__item:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.contact-info-display__icon {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 2px;
}

.contact-info-display__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.contact-info-display__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-info-display__value {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.contact-info-display__value--link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-info-display__value--link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .contact-info-display__items {
    gap: 16px;
  }

  .contact-info-display__item {
    padding: 14px;
  }

  .contact-info-display__value {
    font-size: 15px;
  }
}
</style>
