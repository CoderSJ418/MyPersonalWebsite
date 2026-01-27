/**
 * 网站配置文件
 * 集中管理网站的基本信息和联系方式
 */

export const siteConfig = {
  // 基本信息
  name: '佘杰',
  title: '佘杰 - 前端开发工程师',
  description: '7年前端开发经验，Vue专家，专注于前端技术栈和工程化',

  // 联系方式（从环境变量读取，如果没有则使用默认值）
  email: import.meta.env.VITE_EMAIL || 'contact@example.com',
  github: 'https://github.com/shejie',
  linkedin: 'https://linkedin.com/in/shejie',

  // SEO 信息
  seo: {
    keywords: '佘杰, 前端开发, Vue.js, JavaScript, TypeScript, 前端工程师, 个人网站, 作品集',
    author: '佘杰',
    robots: 'index, follow',
    googlebot: 'index, follow'
  },

  // 社交媒体
  social: {
    twitter: '@shejie',
    github: 'shejie',
    linkedin: 'shejie'
  },

  // 网站 URL
  url: 'https://shejie1995.gitee.io/my-personal-website/',

  // 其他配置
  themeColor: '#3b82f6'
}

export default siteConfig
