import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import '@/assets/styles/nprogress.css'
import { useAppStore } from '@/stores/useAppStore'

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  barSelector: '[role="progressbar"]',
  spinnerSelector: '[role="status"]',
  template:
    '<div class="bar" role="progressbar" aria-label="页面加载进度"><div class="peg"></div></div><div class="spinner" role="status"><div class="spinner-icon"></div></div>'
})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      description: '佘杰 - 前端开发工程师个人网站'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects.vue'),
    meta: {
      title: '项目展示',
      description: '我的项目作品集'
    }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: {
      title: '项目详情',
      description: '项目详细信息'
    },
    props: true
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/Blog.vue'),
    meta: {
      title: '技术博客',
      description: '我的技术文章'
    }
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/views/BlogDetail.vue'),
    meta: {
      title: '文章详情',
      description: '技术文章详情'
    },
    props: true
  },
  {
    path: '/lab',
    name: 'Lab',
    component: () => import('@/views/Lab/LabIndex.vue'),
    meta: {
      title: '交互实验室',
      description: '12 个可调参数、可复制源码的 Vue 交互效果'
    }
  },
  {
    path: '/lab/:id',
    name: 'LabDemo',
    component: () => import('@/views/Lab/LabLayout.vue'),
    props: true,
    meta: {
      title: '交互实验室',
      description: '可调参数并复制完整 Vue SFC 源码'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      description: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const appStore = useAppStore()
  appStore.closeMenu()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
