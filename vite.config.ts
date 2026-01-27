import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
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
    // 图片优化
    viteImagemin({
      // PNG 优化
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      // JPEG 优化
      mozjpeg: {
        quality: 80,
        progressive: true
      },
      // GIF 优化
      gifsicle: {
        optimizationLevel: 3
      },
      // SVGO 优化
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          },
          {
            name: 'removeUnusedNS',
            active: true
          },
          {
            name: 'mergePaths',
            active: true
          },
          {
            name: 'removeEmptyContainers',
            active: true
          },
          {
            name: 'removeHiddenElems',
            active: true
          },
          {
            name: 'cleanupIds',
            active: true
          },
          {
            name: 'minifyStyles',
            active: true
          },
          {
            name: 'convertStyleToAttrs',
            active: true
          },
          {
            name: 'removeComments',
            active: true
          }
        ]
      }
    }),
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
          // GSAP 动画库单独打包
          'gsap': ['gsap'],
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