import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import '@/assets/styles/nprogress.css'
import { useAppStore } from '@/stores/useAppStore'

// 配置 NProgress
NProgress.configure({
  showSpinner: false, // 隐藏加载旋转器
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.1, // 最小百分比
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
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
  // 开始进度条
  NProgress.start()
  
  const appStore = useAppStore()
  const title = to.meta.title as string
  const description = to.meta.description as string
  
  // 更新页面标题
  document.title = `${title} - 佘杰`
  
  // 更新 Meta 标签
  updateMetaTags({
    title,
    description,
    url: window.location.href
  })
  
  appStore.closeMenu()
  next()
})

// 路由加载完成后关闭进度条
router.afterEach(() => {
  NProgress.done()
})

function updateMetaTags(meta: { title: string; description: string; url: string }) {
  // 更新 description
  const descriptionTag = document.querySelector('meta[name="description"]')
  if (descriptionTag && meta.description) {
    descriptionTag.setAttribute('content', meta.description)
  }

  // 更新 keywords
  const keywordsTag = document.querySelector('meta[name="keywords"]')
  if (keywordsTag) {
    const baseKeywords = '前端开发工程师, Vue.js, TypeScript, JavaScript, 前端工程化, 性能优化, 佘杰'
    keywordsTag.setAttribute('content', `${baseKeywords}, ${meta.title}`)
  }

  // 更新 Open Graph 标签
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', `${meta.title} - 佘杰`)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription && meta.description) {
    ogDescription.setAttribute('content', meta.description)
  }

  const ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) {
    ogUrl.setAttribute('content', meta.url)
  }

  // 更新 Twitter Card 标签
  const twitterTitle = document.querySelector('meta[name="twitter:title"]')
  if (twitterTitle) {
    twitterTitle.setAttribute('content', `${meta.title} - 佘杰`)
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]')
  if (twitterDescription && meta.description) {
    twitterDescription.setAttribute('content', meta.description)
  }
}

export default router
