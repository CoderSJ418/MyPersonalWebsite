import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tailwindcssNesting from 'tailwindcss/nesting'
import { execFileSync } from 'child_process'
import type { Plugin } from 'vite'

/**
 * Vite plugin: blog-meta-generator
 * Generates blog-meta.json at build time and on .md file changes in dev.
 * This ensures the blog list page can load metadata instantly from a static JSON
 * instead of parsing all .md files at runtime.
 */
function blogMetaGenerator(): Plugin {
  const generate = () => {
    try {
      execFileSync(process.execPath, ['scripts/generate-blog-meta.mjs'], { stdio: 'pipe' })
    } catch (e) {
      console.warn('[blog-meta-generator] Failed to generate blog-meta.json:', e)
    }
  }

  return {
    name: 'blog-meta-generator',
    buildStart() {
      generate()
    },
    handleHotUpdate({ file }) {
      if (file.endsWith('.md') && file.includes('assets/blog')) {
        generate()
      }
    }
  }
}

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcssNesting, tailwindcss, autoprefixer]
    }
  },
  // Vercel base 路径（根路径）
  base: '/',

  plugins: [
    vue(),
    blogMetaGenerator(),
    // 压缩配置 — gzip + brotli 双格式，brotli比gzip再小15-20%
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 只压缩大于 10KB 的文件
      deleteOriginFile: false
    }),
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
  optimizeDeps: {
    entries: ['index.html'],
    include: [
      'vue',
      'vue-router',
      'pinia',
      'lucide-vue-next',
      'gsap',
      'highlight.js/lib/core',
      'highlight.js/lib/languages/javascript',
      'highlight.js/lib/languages/typescript',
      'highlight.js/lib/languages/css',
      'highlight.js/lib/languages/xml',
      'highlight.js/lib/languages/markdown'
    ],
    exclude: ['@gsap/react', 'axios']
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        // 文件名哈希
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 代码分割 - 将大型第三方库单独打包
        manualChunks: {
          // Vue 生态
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // GSAP 动画库
          gsap: ['gsap'],
          // 图标库
          icons: ['lucide-vue-next'],
          // Markdown 渲染链（highlight.js 按需导入由 Vite 自动 code-split，不纳入 manualChunks）
          markdown: ['markdown-it', 'markdown-it-table-of-contents', 'markdown-it-anchor'],
          // YAML 解析 + Buffer polyfill — 不纳入 manualChunks，让 Vite 自然 code-split 到博客路由 chunk
          // 原因：yaml-parser 仅在博客页面使用，纳入 manualChunks 会导致 modulepreload 预加载到首页
          // HTML 安全
          sanitizer: ['dompurify'],
          // 进度条
          nprogress: ['nprogress']
        }
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 目标浏览器 — 现代浏览器（Chrome80+/Firefox80+/Safari14+/Edge80+）
    // esnext 消除 async/await/?. /?? 的downlevel转换，bundle体积减少15-25%
    target: 'esnext',
    // 最小化 - 使用 esbuild（支持 drop_console，性能优于 terser）
    minify: 'esbuild',
    // esbuild 配置 - 移除生产环境的 console 和 debugger
    esbuild: {
      drop: ['console', 'debugger']
    },
    chunkSizeWarningLimit: 1000,
    // 模块预加载优化 — 现代浏览器原生支持modulepreload，无需polyfill
    modulePreload: {
      polyfill: false
    },
  },
  server: {
    open: false,
    // 开发服务器性能优化
    hmr: {
      overlay: false
    }
  }
})
