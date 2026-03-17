import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    // 使用 happy-dom 作为测试环境
    environment: 'happy-dom',
    // 全局变量配置
    globals: true,
    // 测试文件匹配模式
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 排除目录
    exclude: ['node_modules', 'dist'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 覆盖率阈值 70%
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      },
      // 包含的文件
      include: ['src/**/*.{ts,vue}'],
      // 排除的文件
      exclude: [
        'src/main.ts',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
        'src/types/**'
      ]
    },
    // 设置超时时间
    testTimeout: 10000,
    // 设置钩子超时
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
