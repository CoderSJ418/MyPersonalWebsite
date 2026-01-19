<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <p class="text-2xl text-gray-700 dark:text-gray-300 mb-8">页面未找到</p>
      <RouterLink
        to="/"
        class="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        返回首页
      </RouterLink>
    </div>
  </div>
</template>