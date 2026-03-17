import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tailwindcssNesting from 'tailwindcss/nesting'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcssNesting,
        tailwindcss,
        autoprefixer
      ]
    }
  },
  // Vercel base 路径（根路径）
  base: '/',

  plugins: [
    vue(),
    // 压缩配置
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 只压缩大于 10KB 的文件
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 文件名哈希
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 代码分割 - 将大型第三方库单独打包
        manualChunks: {
          // Vue 生态单独打包（最新最佳实践）
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // GSAP 动画库单独打包（不包含 React 版本，Vue 项目不需要）
          'gsap': ['gsap'],
          // 工具库单独打包
          'utils': ['axios', 'loglevel'],
          // Markdown 相关库单独打包
          'markdown': ['markdown-it', 'markdown-it-table-of-contents', 'markdown-it-anchor'],
          // 代码高亮库单独打包
          'highlight': ['highlight.js']
        }
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 目标浏览器
    target: 'es2015',
    // 最小化 - 使用 esbuild（支持 drop_console，性能优于 terser）
    minify: 'esbuild',
    // esbuild 配置 - 移除生产环境的 console 和 debugger
    esbuild: {
      drop: ['console', 'debugger']
    },
    chunkSizeWarningLimit: 1000,
    // 模块预加载优化
    modulePreload: {
      polyfill: true  // 自动注入模块预加载 polyfill
    },
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