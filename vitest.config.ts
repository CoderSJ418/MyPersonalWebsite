import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  test: {
    // 测试环境
    environment: 'happy-dom',
    
    // 全局配置
    globals: true,
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'tests/',
        'scripts/',
        'public/',
        'docs/',
      ],
      // 覆盖率阈值
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    
    // 测试文件匹配模式
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'tests/performance/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],

    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'tests/e2e', // 排除 E2E 测试，应该使用 Playwright 运行
    ],
    
    // 设置超时时间
    testTimeout: 30000,
    
    // 并发测试
    threads: true,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})