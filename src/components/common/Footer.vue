<template>
  <footer class="bg-gray-100 dark:bg-gray-800 py-6 md:py-8 mt-16 transition-colors duration-300 pb-safe-bottom md:pb-8">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- 版权信息 -->
        <div class="text-center md:text-left">
          <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">
            &copy; {{ currentYear }} 佘杰. All rights reserved.
          </p>
        </div>

        <!-- 社交链接 -->
        <div class="flex items-center gap-4 md:gap-6">
          <a
            href="https://github.com/shejie"
            target="_blank"
            rel="noopener noreferrer"
            class="min-h-touch min-w-touch flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            aria-label="GitHub"
          >
            <Github class="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a
            href="https://linkedin.com/in/shejie"
            target="_blank"
            rel="noopener noreferrer"
            class="min-h-touch min-w-touch flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            aria-label="LinkedIn"
          >
            <Linkedin class="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a
            href="mailto:shejie@example.com"
            class="min-h-touch min-w-touch flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            aria-label="Email"
          >
            <Mail class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
/* 添加安全区域支持 */
@supports (padding-bottom: max(0px)) {
  footer {
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  }
}
</style>