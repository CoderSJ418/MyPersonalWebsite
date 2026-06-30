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
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于我',
      description: '我的个人信息、工作经历、教育背景和技能'
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
    path: '/skills',
    name: 'Skills',
    component: () => import('@/views/Skills.vue'),
    meta: {
      title: '技能展示',
      description: '我的技术栈和技能'
    }
  },
  {
    path: '/experience',
    name: 'Experience',
    component: () => import('@/views/Experience.vue'),
    meta: {
      title: '工作经历',
      description: '我的工作经历和职业发展'
    }
  },
  {
    path: '/education',
    name: 'Education',
    component: () => import('@/views/Education.vue'),
    meta: {
      title: '教育背景',
      description: '我的教育背景和学习经历'
    }
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
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    meta: {
      title: '联系方式',
      description: '联系我'
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
