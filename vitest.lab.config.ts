import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/unit/lab/**/*.spec.ts', 'tests/unit/services/privacyAnalytics.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      include: [
        'src/views/Lab/demos/*.vue',
        'src/services/privacyAnalytics.ts',
        'src/utils/labMetadata.ts',
        'src/utils/labUsage.ts'
      ],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 }
    }
  },
  resolve: { alias: { '@': resolve(__dirname, 'src') } }
})
