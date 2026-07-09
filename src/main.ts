/**
 * 应用入口
 * 
 * 职责：创建 Vue 应用实例，注册插件，挂载应用
 * 初始化逻辑已拆分到 src/boot/ 目录
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeApp } from './boot'
import { installRoutePrefetch } from './utils/routePrefetch'

// 样式导入
import './assets/styles/main.css'
import './assets/styles/design-system.css'
import './assets/stripe-effects.css'

// 创建应用实例
const app = createApp(App)
const pinia = createPinia()

// 注册插件
app.use(pinia)
app.use(router)

// 路由 hover 预加载 — 用户 hover 导航链接时预加载目标 chunk
installRoutePrefetch(router)

// 注册全局指令
import { vSpotlight } from '@/composables/useCardSpotlight'
app.directive('spotlight', vSpotlight)

// 挂载应用（不阻塞字体加载，优先渲染）
app.mount('#app')

// 初始化子系统（字体非阻塞加载、监控、Service Worker）
initializeApp(app)