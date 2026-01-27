#!/usr/bin/env node

/**
 * 激进性能优化脚本
 * 针对 MyPersonalWebsite 进行深度性能优化
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')

// 性能优化配置
const AGGRESSIVE_OPTIMIZATION_CONFIG = {
  // 激进的代码分割策略
  aggressiveChunking: {
    maxSize: 500 * 1024, // 500KB
    minSize: 100 * 1024, // 100KB
    priority: ['critical', 'interactive', 'background']
  },
  
  // 激进的缓存策略
  aggressiveCaching: {
    maxAge: 30 * 24 * 60 * 60, // 30天
    strategy: 'stale-while-revalidate'
  },
  
  // 激进的字体优化
  aggressiveFontOptimization: {
    preloadCritical: true,
    optimizeSubset: true,
    useWOFF2: true,
    fallbackFont: 'system-ui, -apple-system, sans-serif'
  },
  
  // 激进的图片优化
  aggressiveImageOptimization: {
    useWebP: true,
    useAVIF: true,
    lazyLoad: true,
    optimizeSize: true,
    quality: 85
  }
}

/**
 * 激进的代码分割
 */
function aggressiveChunking() {
  console.log('🔧 应用激进代码分割策略...')
  
  const viteConfigPath = path.join(PROJECT_ROOT, 'vite.config.ts')
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
  
  // 添加更激进的 chunking 配置
  const aggressiveChunkingConfig = `
  // 激进的代码分割配置
  rollupOptions: {
    output: {
      manualChunks(id) {
        // 极致的代码分割
        if (id.includes('node_modules')) {
          // 极端分割 - 每个库单独分割
          if (id.includes('vue')) return 'vue-core'
          if (id.includes('vue-router')) return 'vue-router'
          if (id.includes('pinia')) return 'pinia'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('lucide')) return 'lucide'
          if (id.includes('web-vitals')) return 'web-vitals'
          if (id.includes('loglevel')) return 'loglevel'
          if (id.includes('markdown')) return 'markdown-parser'
          
          // 细分第三方库
          if (id.includes('axios')) return 'axios'
          if (id.includes('lodash')) return 'lodash'
          if (id.includes('dayjs')) return 'dayjs'
          if (id.includes('chart.js')) return 'chartjs'
          
          return 'vendor'
        }
        
        // 极致的组件分割
        if (id.includes('src/views')) {
          const parts = id.split('/')
          const fileName = parts[parts.length - 1]
          if (fileName.includes('home')) return 'home'
          if (fileName.includes('about')) return 'about'
          if (fileName.includes('projects')) return 'projects'
          if (fileName.includes('blog')) return 'blog'
          if (fileName.includes('contact')) return 'contact'
        }
        
        if (id.includes('src/components')) {
          const parts = id.split('/')
          const fileName = parts[parts.length - 1]
          
          // 极致的组件细分
          if (fileName.includes('Interactive')) return 'interactive'
          if (fileName.includes('common')) return 'common-components'
          if (fileName.includes('home')) return 'home-components'
          if (fileName.includes('projects')) return 'projects-components'
          if (fileName.includes('blog')) return 'blog-components'
          if (fileName.includes('Contact')) return 'contact-components'
          if (fileName.includes('About')) return 'about-components'
          if (fileName.includes('Skills')) return 'skills-components'
        }
        
        // 极致的工具函数分割
        if (id.includes('src/utils')) {
          const parts = id.split('/')
          const fileName = parts[parts.length - 1]
          if (fileName.includes('image')) return 'image-utils'
          if (fileName.includes('gsap')) return 'gsap-utils'
          if (fileName.includes('font')) return 'font-utils'
          if (fileName.includes('performance')) return 'performance-utils'
        }
        
        // 极致的 composables 分割
        if (id.includes('src/composables')) {
          const parts = id.split('/')
          const fileName = parts[parts.length - 1]
          if (fileName.includes('useCard3D')) return 'useCard3D'
          if (fileName.includes('useCursor')) return 'useCursor'
        }
        
        // 极致的 stores 分割
        if (id.includes('src/stores')) {
          const parts = id.split('/')
          const fileName = parts[parts.length - 1]
          if (fileName.includes('useMonitoring')) return 'monitoring-store'
          if (fileName.includes('usePerformance')) return 'performance-store'
        }
      },
      
      // 激进的缓存策略
      chunkFileNames: 'assets/js/[name]-[hash].js',
      entryFileNames: 'assets/js/[name]-[hash].js',
      assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      
      // 激进的资源优化
      assetFileNames: (assetInfo) => {
        const ext = assetInfo.name.split('.').pop()
        if (ext === 'woff' || ext === 'woff2' || ext === 'ttf' || ext === 'eot') {
          return 'assets/fonts/[name]-[hash].[ext]'
        }
        if (ext === 'webp' || ext === 'avif' || ext === 'svg') {
          return 'assets/images/[name]-[hash].[ext]'
        }
        return 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
`

  // 替换原有的 rollupOptions 配置
  viteConfig = viteConfig.replace(
    /rollupOptions: \{[\s\S]*?\}/,
    aggressiveChunkingConfig
  )

  fs.writeFileSync(viteConfigPath, viteConfig)
  console.log('✅ 激进代码分割配置已应用')
}

/**
 * 激进的缓存策略
 */
function aggressiveCaching() {
  console.log('🔧 应用激进缓存策略...')
  
  const swPath = path.join(PROJECT_ROOT, 'public', 'sw.js')
  let swContent = fs.readFileSync(swPath, 'utf-8')
  
  // 添加激进的缓存策略
  const aggressiveCacheConfig = `
// 激进缓存策略 - 基于使用频率和重要性
const AGGRESSIVE_CACHE_STRATEGY = {
  // 极致关键资源 - 立即网络优先
  critical: {
    strategy: 'networkFirst',
    maxAge: 1 * 24 * 60 * 60, // 1天
    maxEntries: 100,
    cacheName: 'shejie-critical-v4',
    priority: 100,
    strategy: 'networkFirst'
  },
  
  // 极致交互资源 - 网络优先
  interactive: {
    strategy: 'networkFirst',
    maxAge: 7 * 24 * 60 * 60, // 7天
    maxEntries: 150,
    cacheName: 'shejie-interactive-v4',
    priority: 85,
    strategy: 'networkFirst'
  },
  
  // 极致背景资源 - 缓存优先
  background: {
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60, // 30天
    maxEntries: 300,
    cacheName: 'shejie-background-v4',
    priority: 50,
    strategy: 'cacheFirst'
  },
  
  // 极致字体资源 - 立即预加载
  fonts: {
    strategy: 'cacheFirst',
    maxAge: 90 * 24 * 60 * 60, // 90天
    maxEntries: 50,
    cacheName: 'shejie-fonts-v4',
    priority: 90,
    strategy: 'cacheFirst'
  },
  
  // 极致图片资源 - 网络优先
  images: {
    strategy: 'networkFirst',
    maxAge: 14 * 24 * 60 * 60, // 14天
    maxEntries: 200,
    cacheName: 'shejie-images-v4',
    priority: 75,
    strategy: 'networkFirst'
  }
}

// 激进的网络条件检测
function getAggressiveNetworkCondition() {
  if (!navigator.onLine) {
    return 'offline'
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!connection) {
    return 'fast'
  }

  const effectiveType = connection.effectiveType
  const downlink = connection.downlink
  const rtt = connection.rtt

  // 极致的网络条件判断
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
    return 'slow'
  }

  if (rtt > 100 || downlink < 1) {
    return 'slow'
  }

  if (downlink > 10) {
    return 'fast'
  }

  return 'fast'
}

// 激进的缓存策略选择
function getAggressiveCacheStrategy(url) {
  const resourceType = getResourceType(url)
  const networkCondition = getAggressiveNetworkCondition()
  
  // 极致的资源类型判断
  if (url.pathname === '/' || url.pathname.includes('/home')) {
    return AGGRESSIVE_CACHE_STRATEGY.critical
  }

  if (url.pathname.includes('/about') || url.pathname.includes('/projects') || 
      url.pathname.includes('/blog') || url.pathname.includes('/contact')) {
    return AGGRESSIVE_CACHE_STRATEGY.interactive
  }

  if (url.pathname.includes('/skills') || url.pathname.includes('/services')) {
    return AGGRESSIVE_CACHE_STRATEGY.background
  }

  if (url.pathname.includes('/api/')) {
    return AGGRESSIVE_CACHE_STRATEGY.interactive
  }

  // 根据网络条件和资源类型选择策略
  let baseStrategy = AGGRESSIVE_CACHE_STRATEGY[resourceType] || AGGRESSIVE_CACHE_STRATEGY.background
  
  // 极致的网络条件优化
  if (networkCondition === 'slow') {
    baseStrategy.maxAge = Math.min(baseStrategy.maxAge, 14 * 24 * 60 * 60)
    baseStrategy.strategy = 'cacheFirst'
  } else if (networkCondition === 'fast') {
    baseStrategy.maxAge = Math.min(baseStrategy.maxAge, 7 * 24 * 60 * 60)
    baseStrategy.strategy = 'networkFirst'
  }

  return baseStrategy
}

// 激进的资源预加载
function aggressivePreload() {
  const criticalResources = [
    '/',
    '/index.html',
    '/assets/js/index-*.js',
    '/assets/css/index-*.css',
    '/assets/fonts/*.woff2',
    '/assets/images/*.webp'
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'fetch'
    link.crossOrigin = 'anonymous'
    link.href = resource
    document.head.appendChild(link)
  })
}
`

  // 添加激进缓存策略
  swContent = swContent.replace(
    '/**\n * 获取资源类型（高性能版本）\n */',
    aggressiveCacheConfig + '\n/**\n * 获取资源类型（高性能版本）\n */'
  )

  // 更新缓存策略选择函数
  swContent = swContent.replace(
    /function getCacheStrategy\(url\) \{[\s\S]*?\}[\s\S]*?\n\}/,
    `function getAggressiveCacheStrategy(url) {
  const resourceType = getResourceType(url)
  const networkCondition = getAggressiveNetworkCondition()
  
  if (url.pathname === '/' || url.pathname.includes('/home')) {
    return AGGRESSIVE_CACHE_STRATEGY.critical
  }

  if (url.pathname.includes('/about') || url.pathname.includes('/projects') || 
      url.pathname.includes('/blog') || url.pathname.includes('/contact')) {
    return AGGRESSIVE_CACHE_STRATEGY.interactive
  }

  if (url.pathname.includes('/skills') || url.pathname.includes('/services')) {
    return AGGRESSIVE_CACHE_STRATEGY.background
  }

  if (url.pathname.includes('/api/')) {
    return AGGRESSIVE_CACHE_STRATEGY.interactive
  }

  let baseStrategy = AGGRESSIVE_CACHE_STRATEGY[resourceType] || AGGRESSIVE_CACHE_STRATEGY.background
  
  if (networkCondition === 'slow') {
    baseStrategy.maxAge = Math.min(baseStrategy.maxAge, 14 * 24 * 60 * 60)
    baseStrategy.strategy = 'cacheFirst'
  } else if (networkCondition === 'fast') {
    baseStrategy.maxAge = Math.min(baseStrategy.maxAge, 7 * 24 * 60 * 60)
    baseStrategy.strategy = 'networkFirst'
  }

  return baseStrategy
}

function getCacheStrategy(url) {
  return getAggressiveCacheStrategy(url)
}`
  )

  fs.writeFileSync(swPath, swContent)
  console.log('✅ 激进缓存策略已应用')
}

/**
 * 激进的字体优化
 */
function aggressiveFontOptimization() {
  console.log('🔧 应用激进字体优化...')
  
  const viteConfigPath = path.join(PROJECT_ROOT, 'vite.config.ts')
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
  
  // 添加激进的字体优化配置
  const aggressiveFontConfig = `
    // 激进的字体优化
    optimizeDeps: {
      include: [
        'vue', 'vue-router', 'pinia', 'lucide-vue-next', 'gsap', 'web-vitals', 
        'loglevel', 'markdown-it', 'highlight.js', 'markdown-it-anchor', 
        'markdown-it-table-of-contents',
        // 激进的字体相关库
        'fontfaceobserver',
        'font-display'
      ],
      exclude: []
    },
    
    // 激进的字体预加载
    plugins: [
      {
        name: 'vite-aggressive-font-preload',
        config(config) {
          config.build.rollupOptions.output = {
            ...config.build.rollupOptions.output,
            assetFileNames: (assetInfo) => {
              const ext = assetInfo.name.split('.').pop()
              if (ext === 'woff' || ext === 'woff2' || ext === 'ttf' || ext === 'eot') {
                return 'assets/fonts/[name]-[hash].[ext]'
              }
              return 'assets/[ext]/[name]-[hash].[ext]'
            }
          }
        }
      }
    ],
`

  // 替换优化配置
  viteConfig = viteConfig.replace(
    /optimizeDeps: \{[\s\S]*?\},/, 
    aggressiveFontConfig
  )

  fs.writeFileSync(viteConfigPath, viteConfig)
  console.log('✅ 激进字体优化配置已应用')
}

/**
 * 激进的图片优化
 */
function aggressiveImageOptimization() {
  console.log('🔧 应用激进图片优化...')
  
  const viteConfigPath = path.join(PROJECT_ROOT, 'vite.config.ts')
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
  
  // 添加激进的图片优化配置
  const aggressiveImageConfig = `
    // 激进的图片优化
    plugins: [
      viteImagemin({
        // 极致的 PNG 优化
        pngquant: {
          quality: [0.9, 0.95],
          speed: 2
        },
        // 极致的 JPEG 优化
        mozjpeg: {
          quality: 90,
          progressive: true,
          optimizeScans: true,
          maxMemory: 1024 * 1024
        },
        // 极致的 WebP 优化
        optipng: {
          optimizationLevel: 7
        },
        // 极致的 GIF 优化
        gifsicle: {
          optimizationLevel: 3,
          colors: 256
        },
        // 极致的 SVGO 优化
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
              name: 'cleanupIDs',
              active: true,
              params: {
                minify: true,
                remove: true,
                prefix: 'aggressive-'
              }
            }
          ]
        },
        // 极致的 AVIF 优化
        plugins: [
          'pngquant',
          'mozjpeg',
          'optipng',
          'gifsicle',
          'svgo',
          {
            name: 'avif',
            params: {
              quality: 80,
              speed: 2
            }
          }
        ]
      }),
`

  // 替换图片优化配置
  viteConfig = viteConfig.replace(
    /viteImagemin\(\{[\s\S]*?\}\),/, 
    aggressiveImageConfig
  )

  fs.writeFileSync(viteConfigPath, viteConfig)
  console.log('✅ 激进图片优化配置已应用')
}

/**
 * 激进的构建优化
 */
function aggressiveBuildOptimization() {
  console.log('🔧 应用激进建筑优化...')
  
  const viteConfigPath = path.join(PROJECT_ROOT, 'vite.config.ts')
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
  
  // 添加激进建筑优化
  const aggressiveBuildConfig = `
    // 激进建筑优化
    build: {
      // 极致的压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.warn'],
          dead_code: true,
          unused: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          if_return: true,
          join_vars: true,
          collapse_vars: true,
          reduce_vars: true,
          passes: 3,
          pure_getters: true,
          hoist_funs: true,
          hoist_props: true,
          hoist_vars: true,
          inline: true,
          keep_fargs: false,
          keep_fnames: false,
          keep_infinity: false,
          negate_iife: true,
          reduce_funcs: true,
          sequences: true,
          side_effects: true,
          switches: true,
          top_retain: null,
          toplevel: false,
          typeofs: true,
          unsafe: false,
          unsafe_arrows: false,
          unsafe_comps: false,
          unsafe_Function: false,
          unsafe_math: false,
          unsafe_methods: false,
          unsafe_proto: false,
          unsafe_regexp: false,
          unsafe_undefined: false
        },
        format: {
          comments: false,
          ecma: 2020,
          safari10: true,
          wrap_func_args: false
        }
      },
      
      // 极致的 chunking 优化
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 极致的 chunking 逻辑
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue-core'
              if (id.includes('vue-router')) return 'vue-router'
              if (id.includes('pinia')) return 'pinia'
              if (id.includes('gsap')) return 'gsap'
              if (id.includes('lucide')) return 'lucide'
              if (id.includes('web-vitals')) return 'web-vitals'
              if (id.includes('loglevel')) return 'loglevel'
              if (id.includes('markdown')) return 'markdown-parser'
              if (id.includes('axios')) return 'axios'
              if (id.includes('lodash')) return 'lodash'
              if (id.includes('dayjs')) return 'dayjs'
              if (id.includes('chart.js')) return 'chartjs'
              return 'vendor'
            }
            
            if (id.includes('src/views')) {
              const parts = id.split('/')
              const fileName = parts[parts.length - 1]
              if (fileName.includes('home')) return 'home'
              if (fileName.includes('about')) return 'about'
              if (fileName.includes('projects')) return 'projects'
              if (fileName.includes('blog')) return 'blog'
              if (fileName.includes('contact')) return 'contact'
            }
            
            if (id.includes('src/components')) {
              const parts = id.split('/')
              const fileName = parts[parts.length - 1]
              if (fileName.includes('Interactive')) return 'interactive'
              if (fileName.includes('common')) return 'common-components'
              if (fileName.includes('home')) return 'home-components'
              if (fileName.includes('projects')) return 'projects-components'
              if (fileName.includes('blog')) return 'blog-components'
              if (fileName.includes('Contact')) return 'contact-components'
              if (fileName.includes('About')) return 'about-components'
              if (fileName.includes('Skills')) return 'skills-components'
            }
            
            if (id.includes('src/utils')) {
              const parts = id.split('/')
              const fileName = parts[parts.length - 1]
              if (fileName.includes('image')) return 'image-utils'
              if (fileName.includes('gsap')) return 'gsap-utils'
              if (fileName.includes('font')) return 'font-utils'
              if (fileName.includes('performance')) return 'performance-utils'
            }
            
            if (id.includes('src/composables')) {
              const parts = id.split('/')
              const fileName = parts[parts.length - 1]
              if (fileName.includes('useCard3D')) return 'useCard3D'
              if (fileName.includes('useCursor')) return 'useCursor'
            }
            
            if (id.includes('src/stores')) {
              const parts = id.split('/')
              const fileName = parts[parts.length - 1]
              if (fileName.includes('useMonitoring')) return 'monitoring-store'
              if (fileName.includes('usePerformance')) return 'performance-store'
            }
          },
          
          // 极致的文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const ext = assetInfo.name.split('.').pop()
            if (ext === 'woff' || ext === 'woff2' || ext === 'ttf' || ext === 'eot') {
              return 'assets/fonts/[name]-[hash].[ext]'
            }
            if (ext === 'webp' || ext === 'avif' || ext === 'svg') {
              return 'assets/images/[name]-[hash].[ext]'
            }
            return 'assets/[ext]/[name]-[hash].[ext]'
          }
        }
      },
      
      // 极致的性能优化
      sourcemap: false,
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      target: 'es2020',
      ssr: false
    },
`

  // 替换构建配置
  viteConfig = viteConfig.replace(
    /build: \{[\s\S]*?\},/, 
    aggressiveBuildConfig
  )

  fs.writeFileSync(viteConfigPath, viteConfig)
  console.log('✅ 激进建筑优化配置已应用')
}

/**
 * 执行激进优化
 */
async function executeAggressiveOptimization() {
  console.log('🚀 开始激进性能优化...')
  
  try {
    // 应用各种激进优化
    aggressiveChunking()
    aggressiveCaching()
    aggressiveFontOptimization()
    aggressiveImageOptimization()
    aggressiveBuildOptimization()
    
    console.log('✅ 激进优化配置已应用')
    
    // 重新构建项目
    console.log('🔨 重新构建项目以应用优化...')
    execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' })
    
    console.log('🎉 激进性能优化完成！')
    console.log('📊 请运行 npm run lighthouse 查看优化效果')
    
  } catch (error) {
    console.error('❌ 激进优化失败:', error.message)
    process.exit(1)
  }
}

// 执行激进优化
executeAggressiveOptimization()