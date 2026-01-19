import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  // Gitee Pages base 路径
  base: '/my-personal-website/',

  plugins: [
    vue(),
    // Gzip 压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 只压缩大于 10KB 的文件
      deleteOriginFile: false
    }),
    // Brotli 压缩
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 目标浏览器
    target: 'es2015',
    // 最小化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      format: {
        comments: false // 移除注释
      }
    },
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Vue 核心库
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor'
            }
            // 动画库
            if (id.includes('gsap')) {
              return 'animation-vendor'
            }
            // UI 库
            if (id.includes('lucide')) {
              return 'ui-vendor'
            }
            // 其他第三方库
            return 'vendor'
          }
        },
        // 文件名哈希
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    // 预构建依赖
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'lucide-vue-next', 'gsap'],
      exclude: []
    }
  },
  server: {
    port: 5173,
    open: true,
    // 开发服务器性能优化
    hmr: {
      overlay: false
    }
  }
})