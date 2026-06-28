<template>
  <footer class="footer">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- 主要内容区 -->
      <div class="footer__main">
        <!-- Logo和简介 -->
        <div class="footer__brand">
          <div class="footer__logo">
            <div class="logo-text">佘杰</div>
            <div class="logo-dot"></div>
          </div>
          <p class="footer__tagline">
            7年前端开发工程师，专注于构建精美的用户界面
          </p>
        </div>

        <!-- 快速链接 -->
        <div class="footer__links">
          <h3 class="footer__title">快速链接</h3>
          <ul class="footer__list">
            <li>
              <RouterLink to="/" class="footer__link">首页</RouterLink>
            </li>
            <li>
              <RouterLink to="/projects" class="footer__link">项目</RouterLink>
            </li>
            <li>
              <RouterLink to="/skills" class="footer__link">技能</RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="footer__link">博客</RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="footer__link">联系</RouterLink>
            </li>
          </ul>
        </div>

        <!-- 社交媒体 -->
        <div class="footer__social">
          <h3 class="footer__title">社交媒体</h3>
          <SocialLinks
            github="https://github.com/shejie"
            linkedin="https://linkedin.com/in/shejie"
            email="912999051@qq.com"
            twitter="https://twitter.com/shejie"
          />
        </div>

        <!-- 联系信息 -->
        <div class="footer__contact">
          <h3 class="footer__title">联系我</h3>
          <ul class="footer__list">
            <li>
              <a href="mailto:912999051@qq.com" class="footer__link footer__link--email">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                912999051@qq.com
              </a>
            </li>
            <li>
              <span class="footer__link footer__link--location">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                中国 · 长沙
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="footer__bottom">
        <div class="footer__copyright">
          <p>&copy; {{ currentYear }} 佘杰. All rights reserved.</p>
        </div>
        
        <div class="footer__tech">
          <span class="tech-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Vue 3
          </span>
          <span class="tech-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
            TypeScript
          </span>
          <span class="tech-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Vite
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Footer */
.footer {
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: 4rem 0 2rem;
  margin-top: 6rem;
  transition: all 0.3s ease;
}

.dark .footer {
  background: var(--surface-2);
}

/* 主要内容区 */
.footer__main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

/* Logo和简介 */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-500);
  box-shadow: 0 0 10px var(--primary-500);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.footer__tagline {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 300px;
}

/* 链接区 */
.footer__links,
.footer__social,
.footer__contact {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.footer__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.footer__link:hover {
  color: var(--primary-600);
  transform: translateX(4px);
}

.dark .footer__link:hover {
  color: var(--primary-400);
}

.footer__link--email,
.footer__link--location {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* 社交链接 */
.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--primary-50);
  color: var(--primary-600);
  border-color: var(--primary-300);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.dark .social-link:hover {
  background: var(--primary-950);
  color: var(--primary-400);
  border-color: var(--primary-700);
}

/* 底部版权 */
.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
}

.footer__copyright {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.footer__tech {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.tech-badge:hover {
  background: var(--primary-50);
  color: var(--primary-600);
  border-color: var(--primary-300);
}

.dark .tech-badge:hover {
  background: var(--primary-950);
  color: var(--primary-400);
  border-color: var(--primary-700);
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer__main {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .footer__main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer__bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer__tech {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .footer,
  .footer__link,
  .social-link,
  .tech-badge {
    transition-duration: 0.01ms !important;
  }
  
  .logo-dot {
    animation-duration: 0.01ms !important;
  }
}
</style>