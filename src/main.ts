import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useServiceWorker } from './composables/useServiceWorker'
import './assets/styles/main.css'
import './assets/animations.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// 注册 Service Worker（仅在生产环境）
if (import.meta.env.PROD) {
  const { register } = useServiceWorker()

  // 等待应用挂载后再注册 Service Worker
  setTimeout(() => {
    register('/sw.js').then((registration) => {
      if (registration) {
        console.log('[Service Worker] Registered successfully')

        // 监听更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[Service Worker] New content is available; please refresh.')
                // 可以在这里显示更新提示
              }
            })
          }
        })
      }
    })
  }, 1000)
}

// 性能监控（仅在开发环境）
if (import.meta.env.DEV) {
  import('./composables/usePerformance').then(({ usePerformance }) => {
    const { logMetrics } = usePerformance()

    // 页面加载完成后记录性能指标
    window.addEventListener('load', () => {
      setTimeout(() => {
        logMetrics()
      }, 1000)
    })
  })
}