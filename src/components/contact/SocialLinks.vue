<template>
  <div class="social-links">
    <a
v-for="link in socialLinks" :key="link.platform" :href="link.url" :aria-label="link.label" target="_blank"
      rel="noopener noreferrer" class="social-links__link" :title="link.label">
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
  gap: var(--us-space-4);
}

.social-links__link {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-3) var(--us-space-5);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  color: var(--us-text-primary);
  text-decoration: none;
  transition: transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing),
    color var(--us-duration-fast) var(--us-easing),
    background-color var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing),
    opacity var(--us-duration-fast) var(--us-easing);
  font-weight: 500;
}

.social-links__link:hover {
  border-color: var(--us-accent);
  background: var(--us-accent);
  color: var(--text-on-accent);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.social-links__link:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

.social-links__label {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .social-links {
    gap: var(--us-space-3);
  }

  .social-links__link {
    padding: var(--us-space-3) var(--us-space-4);
    font-size: var(--text-sm);
  }

  .social-links__label {
    display: none;
  }

  .social-links__link {
    padding: var(--us-space-3);
  }
}
</style>
