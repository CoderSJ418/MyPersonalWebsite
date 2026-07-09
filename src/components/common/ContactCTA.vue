<template>
  <!-- ═══════════════════════════════════════════════════════════
       Contact CTA — Floating Action Button
       ═══════════════════════════════════════════════════════════
       Fixed bottom-right button that expands a contact panel.
       Shortens recruiter action path — no page navigation needed.
       ═══════════════════════════════════════════════════════════ -->
  <div class="contact-cta" :class="{ 'contact-cta--open': isOpen }">
    <!-- Expanded Panel -->
    <Transition name="contact-cta-panel">
      <div
v-if="isOpen" class="contact-cta__panel stripe-card" role="dialog"
        aria-modal="true" aria-label="联系方式">
        <div class="contact-cta__panel-header">
          <span class="contact-cta__panel-title">取得联系</span>
          <button class="contact-cta__panel-close" aria-label="关闭联系方式面板" @click="closePanel">
            <X :size="16" />
          </button>
        </div>

        <div class="contact-cta__panel-body">
          <!-- Email -->
          <a :href="'mailto:' + contactStore.contact.email" class="contact-cta__link">
            <Mail :size="18" class="contact-cta__link-icon" />
            <div class="contact-cta__link-content">
              <span class="contact-cta__link-label">邮箱</span>
              <span class="contact-cta__link-value">{{ contactStore.contact.email }}</span>
            </div>
          </a>

          <!-- GitHub -->
          <a
v-if="contactStore.contact.social.github" :href="contactStore.contact.social.github" target="_blank"
            rel="noopener noreferrer" class="contact-cta__link">
            <svg class="contact-cta__link-icon" :size="18" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <div class="contact-cta__link-content">
              <span class="contact-cta__link-label">GitHub</span>
              <span class="contact-cta__link-value">查看项目</span>
            </div>
          </a>

          <!-- LinkedIn -->
          <a
v-if="contactStore.contact.social.linkedin" :href="contactStore.contact.social.linkedin" target="_blank"
            rel="noopener noreferrer" class="contact-cta__link">
            <svg class="contact-cta__link-icon" :size="18" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <div class="contact-cta__link-content">
              <span class="contact-cta__link-label">LinkedIn</span>
              <span class="contact-cta__link-value">职业档案</span>
            </div>
          </a>
        </div>

        <div class="contact-cta__panel-footer">
          <span class="contact-cta__response-time">{{ contactStore.contact.responseTime }}</span>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
class="contact-cta__btn" :aria-label="isOpen ? '关闭联系方式' : '打开联系方式'" :aria-expanded="isOpen"
      @click="togglePanel">
      <Transition name="contact-cta-icon" mode="out-in">
        <X v-if="isOpen" :size="22" class="contact-cta__btn-icon" />
        <MessageCircle v-else :size="22" class="contact-cta__btn-icon" />
      </Transition>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useContactInfoStore } from '@/stores/useContactInfoStore'
import { MessageCircle, X, Mail } from 'lucide-vue-next'

const contactStore = useContactInfoStore()
const isOpen = ref(false)

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}

// Close on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closePanel()
  }
}

// Close on click outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (isOpen.value && !target.closest('.contact-cta')) {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   Contact CTA — Floating Action Button
   ═══════════════════════════════════════════════════════════ */

.contact-cta {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--us-space-3);
}

/* ── Floating Button ── */
.contact-cta__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--us-accent);
  color: var(--text-on-accent);
  border: none;
  box-shadow: var(--us-depth-2);
  transition:
    transform var(--us-duration-fast) var(--us-easing),
    box-shadow var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing);
}

.contact-cta__btn:hover {
  transform: scale(1.08);
  box-shadow: var(--us-depth-3);
}

.contact-cta__btn:active {
  transform: scale(0.95);
}

.contact-cta__btn:focus-visible {
  outline: 3px solid var(--us-accent);
  outline-offset: 3px;
}

.contact-cta__btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Panel ── */
.contact-cta__panel {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  width: 280px;
  background: var(--us-material-solid);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--us-depth-3);
  overflow: hidden;
}

.contact-cta__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--us-space-4) var(--us-space-4);
  border-bottom: 1px solid var(--us-border);
}

.contact-cta__panel-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--us-text-primary);
}

.contact-cta__panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-lg);
  background: transparent;
  border: none;
  color: var(--us-text-tertiary);
  transition:
    color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing);
}

.contact-cta__panel-close:hover {
  color: var(--us-text-primary);
  background: var(--us-surface-hover);
}

/* ── Panel Body ── */
.contact-cta__panel-body {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-1);
  padding: var(--us-space-2);
}

/* ── Contact Link ── */
.contact-cta__link {
  display: flex;
  align-items: center;
  gap: var(--us-space-3);
  padding: var(--us-space-3) var(--us-space-3);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--us-text-primary);
  transition:
    background var(--us-duration-fast) var(--us-easing),
    color var(--us-duration-fast) var(--us-easing);
}

.contact-cta__link:hover {
  background: var(--us-accent-subtle);
  color: var(--us-accent);
}

.contact-cta__link-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--us-accent);
}

.contact-cta__link-content {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-1);
  min-width: 0;
}

.contact-cta__link-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  letter-spacing: 0.02em;
}

.contact-cta__link-value {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-cta__link:hover .contact-cta__link-value {
  color: var(--us-accent);
}

/* ── Panel Footer ── */
.contact-cta__panel-footer {
  padding: var(--us-space-3) var(--us-space-4);
  border-top: 1px solid var(--us-border);
}

.contact-cta__response-time {
  font-size: var(--text-xs);
  color: var(--us-text-tertiary);
}

/* ═══════════════════════════════════════════════════════════
   Transitions
   ═══════════════════════════════════════════════════════════ */

.contact-cta-panel-enter-active {
  transition:
    opacity var(--us-duration-fast) var(--us-easing),
    transform var(--us-duration-fast) var(--us-easing);
}

.contact-cta-panel-leave-active {
  transition:
    opacity calc(var(--us-duration-fast) * 0.7) var(--us-easing),
    transform calc(var(--us-duration-fast) * 0.7) var(--us-easing);
}

.contact-cta-panel-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

.contact-cta-panel-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.95);
}

.contact-cta-icon-enter-active {
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.contact-cta-icon-leave-active {
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.contact-cta-icon-enter-from,
.contact-cta-icon-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════════════════════
   Responsive — Mobile (avoid MobileNav)
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 767px) {
  .contact-cta {
    bottom: 5rem;
    right: 1.25rem;
  }

  .contact-cta__btn {
    width: 48px;
    height: 48px;
  }

  .contact-cta__panel {
    width: 260px;
    right: -4px;
  }
}

/* ═══════════════════════════════════════════════════════════
   Reduced Motion
   ═══════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .contact-cta__btn {
    transition: none;
  }

  .contact-cta__btn:hover {
    transform: none;
  }

  .contact-cta__btn:active {
    transform: none;
  }

  .contact-cta__link {
    transition: none;
  }

  .contact-cta-panel-enter-active,
  .contact-cta-panel-leave-active {
    transition: none;
  }

  .contact-cta-panel-enter-from,
  .contact-cta-panel-leave-to {
    transform: none;
  }
}
</style>