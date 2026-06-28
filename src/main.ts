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

// 样式导入
import './assets/styles/main.css'
import './assets/styles/design-system.css'

// 创建应用实例
const app = createApp(App)
const pinia = createPinia()

// 注册插件
app.use(pinia)
app.use(router)

// 挂载应用
app.mount('#app')

// 初始化子系统（字体、监控、Service Worker）
initializeApp(app)