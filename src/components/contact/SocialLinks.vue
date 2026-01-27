<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.platform"
      :href="link.url"
      :aria-label="link.label"
      target="_blank"
      rel="noopener noreferrer"
      class="social-links__link"
      :title="link.label"
    >
      <component :is="link.icon" :size="24" />
      <span class="social-links__label">{{ link.label }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SocialLink } from '@/types/project'
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Youtube,
  Instagram,
  Facebook
} from 'lucide-vue-next'

interface Props {
  social?: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
    website?: string
    youtube?: string
    instagram?: string
    facebook?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  social: () => ({})
})

const iconMap: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
  website: Globe,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook
}

const socialLinks = computed<SocialLink[]>(() => {
  const links: SocialLink[] = []

  if (props.social.github) {
    links.push({
      platform: 'github',
      url: props.social.github,
      icon: iconMap.github,
      label: 'GitHub'
    })
  }

  if (props.social.linkedin) {
    links.push({
      platform: 'linkedin',
      url: props.social.linkedin,
      icon: iconMap.linkedin,
      label: 'LinkedIn'
    })
  }

  if (props.social.twitter) {
    links.push({
      platform: 'twitter',
      url: props.social.twitter,
      icon: iconMap.twitter,
      label: 'Twitter'
    })
  }

  if (props.social.email) {
    links.push({
      platform: 'email',
      url: props.social.email,
      icon: iconMap.email,
      label: 'Email'
    })
  }

  if (props.social.website) {
    links.push({
      platform: 'website',
      url: props.social.website,
      icon: iconMap.website,
      label: 'Website'
    })
  }

  if (props.social.youtube) {
    links.push({
      platform: 'youtube',
      url: props.social.youtube,
      icon: iconMap.youtube,
      label: 'YouTube'
    })
  }

  if (props.social.instagram) {
    links.push({
      platform: 'instagram',
      url: props.social.instagram,
      icon: iconMap.instagram,
      label: 'Instagram'
    })
  }

  if (props.social.facebook) {
    links.push({
      platform: 'facebook',
      url: props.social.facebook,
      icon: iconMap.facebook,
      label: 'Facebook'
    })
  }

  return links
})
</script>

<style scoped>
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.social-links__link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--surface-1);
  border: 2px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
}

.social-links__link:hover {
  border-color: var(--primary-500);
  background: var(--primary-500);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.social-links__link:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.social-links__label {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .social-links {
    gap: 12px;
  }

  .social-links__link {
    padding: 10px 16px;
    font-size: 13px;
  }

  .social-links__label {
    display: none;
  }

  .social-links__link {
    padding: 12px;
  }
}
</style>
