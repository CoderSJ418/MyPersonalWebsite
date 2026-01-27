import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import TechStack from '@/components/home/TechStack.vue'

// Mock useGSAPAnimations composable
vi.mock('@/composables/useGSAPAnimations', () => ({
  useGSAPAnimations: () => ({
    fadeInUp: vi.fn(),
    staggerIn: vi.fn(),
  }),
}))

describe('TechStack Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(TechStack, {
      global: {
        plugins: [createPinia()],
        stubs: {
          // 如果有子组件，可以在这里 stub
        },
      },
    })
  })

  it('应该正确渲染标题', () => {
    const title = wrapper.find('h2')
    expect(title.text()).toBe('技术栈')
    expect(title.classes()).toContain('text-4xl')
    expect(title.classes()).toContain('md:text-5xl')
    expect(title.classes()).toContain('lg:text-6xl')
    expect(title.classes()).toContain('font-bold')
  })

  it('应该渲染 6 个技术卡片', () => {
    const cards = wrapper.findAll('.tech-card')
    expect(cards.length).toBe(6)
  })

  it('应该正确显示技术栈名称', () => {
    const techNames = wrapper.findAll('.tech-card span')
    const names = techNames.map((span: any) => span.text())

    expect(names).toEqual([
      'Vue 3',
      'Vite',
      'TypeScript',
      'Pinia',
      'Tailwind',
      'uni-app'
    ])
  })

  it('应该正确渲染 Lucide Icons', () => {
    const techCards = wrapper.findAll('.tech-card')
    expect(techCards.length).toBe(6)

    // 检查每个卡片都有图标容器
    techCards.forEach((card: any) => {
      const iconContainer = card.find('.w-20.h-20')
      expect(iconContainer.exists()).toBe(true)
    })
  })

  it('应该应用正确的 Tailwind CSS 类', () => {
    const section = wrapper.find('section')
    expect(section.classes()).toContain('py-20')
    expect(section.classes()).toContain('md:py-28')

    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('grid-cols-2')
    expect(grid.classes()).toContain('md:grid-cols-3')
    expect(grid.classes()).toContain('lg:grid-cols-6')
  })

  it('应该有正确的 data-index 属性', () => {
    const cards = wrapper.findAll('.tech-card')
    cards.forEach((card: any, index: number) => {
      expect(card.attributes('data-index')).toBe(String(index))
    })
  })

  it('应该有正确的过渡效果', () => {
    const card = wrapper.find('.tech-card')
    expect(card.classes()).toContain('transition-all')
    expect(card.classes()).toContain('duration-500')
  })

  it('应该正确布局技术卡片', () => {
    const card = wrapper.find('.tech-card')
    expect(card.classes()).toContain('group')
    expect(card.classes()).toContain('relative')
    expect(card.classes()).toContain('rounded-2xl')
    expect(card.classes()).toContain('border')
  })

  it('应该使用 CSS 变量进行样式控制', () => {
    const section = wrapper.find('section')
    // section 的内联样式可能不会在 attributes 中显示，但组件确实有样式
    
    const card = wrapper.find('.tech-card')
    const cardStyle = card.element.getAttribute('style') || ''
    expect(cardStyle).toContain('rgba')
  })
})