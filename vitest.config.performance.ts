/**
 * 性能回归测试配置
 * 用于监控性能指标，确保性能不会退化
 */

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['tests/performance/**/*.test.ts'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    },
    // 性能测试超时设置
    testTimeout: 30000,
    hookTimeout: 10000
  },
  define: {
    __PERFORMANCE_TESTS__: true
  }
})