import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'

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
    path: '/skills',
    name: 'Skills',
    component: () => import('@/views/Skills.vue'),
    meta: {
      title: '技能展示',
      description: '我的技术栈和技能'
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
  const appStore = useAppStore()
  document.title = `${to.meta.title as string} - 佘杰`
  updateMetaTags(to.meta as any)
  appStore.closeMenu()
  next()
})

function updateMetaTags(meta: any) {
  const description = meta.description as string
  if (description) {
    const metaTag = document.querySelector('meta[name="description"]')
    if (metaTag) {
      metaTag.setAttribute('content', description)
    }
  }

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', `${meta.title as string} - 佘杰`)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription && description) {
    ogDescription.setAttribute('content', description)
  }
}

export default router