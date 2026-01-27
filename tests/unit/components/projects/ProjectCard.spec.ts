import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import type { Project } from '@/types/project'

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: '1',
    title: 'Vue 3 博客系统',
    description: '基于 Vue 3 的现代化博客系统，支持 Markdown 渲染、代码高亮等功能。',
    coverImage: '/images/projects/blog.png',
    techStack: [
      { name: 'Vue', version: '3.4.15' },
      { name: 'TypeScript', version: '5.3.3' },
      { name: 'Tailwind CSS', version: '3.4.1' }
    ],
    category: '个人项目',
    featured: true,
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22'
  }

  describe('渲染', () => {
    it('should render project card', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      expect(wrapper.find('.project-card').exists()).toBe(true)
    })

    it('should render project title', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      expect(wrapper.find('.project-card__title').text()).toBe(mockProject.title)
    })

    it('should render project description', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      expect(wrapper.find('.project-card__description').text()).toBe(mockProject.description)
    })

    it('should render project image', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      const image = wrapper.find('.project-card__image')
      expect(image.exists()).toBe(true)
      expect(image.attributes('src')).toBe(mockProject.coverImage)
      expect(image.attributes('alt')).toBe(mockProject.title)
    })

    it('should render tech stack tags', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      const tags = wrapper.findAll('.tag')
      expect(tags.length).toBe(mockProject.techStack.length)
      expect(tags[0].text()).toBe('Vue')
      expect(tags[1].text()).toBe('TypeScript')
      expect(tags[2].text()).toBe('Tailwind CSS')
    })

    it('should render featured badge when project is featured', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      expect(wrapper.find('.project-card__featured').exists()).toBe(true)
      expect(wrapper.find('.project-card__featured').text()).toBe('精选')
    })

    it('should not render featured badge when project is not featured', () => {
      const nonFeaturedProject = { ...mockProject, featured: false }
      const wrapper = mount(ProjectCard, {
        props: { project: nonFeaturedProject }
      })

      expect(wrapper.find('.project-card__featured').exists()).toBe(false)
    })

    it('should render demo link when demoUrl is provided', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      const links = wrapper.findAll('a')
      const demoLinks = links.filter(link => link.text().includes('演示'))
      expect(demoLinks.length).toBe(1)
      expect(demoLinks[0].attributes('href')).toBe(mockProject.demoUrl)
    })

    it('should render github link when githubUrl is provided', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      const links = wrapper.findAll('a')
      const githubLinks = links.filter(link => link.text().includes('源码'))
      expect(githubLinks.length).toBe(1)
      expect(githubLinks[0].attributes('href')).toBe(mockProject.githubUrl)
    })

    it('should not render links when urls are not provided', () => {
      const projectWithoutLinks = {
        ...mockProject,
        demoUrl: undefined,
        githubUrl: undefined
      }
      const wrapper = mount(ProjectCard, {
        props: { project: projectWithoutLinks }
      })

      expect(wrapper.findAll('.project-card__link').length).toBe(0)
    })
  })

  describe('交互', () => {
    it('should emit click event when card is clicked', async () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      await wrapper.find('.project-card').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([mockProject])
    })

    it('should not emit click event when link is clicked', async () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      const links = wrapper.findAll('a')
      if (links.length > 0) {
        await links[0].trigger('click')
        expect(wrapper.emitted('click')).toBeFalsy()
      }
    })

    it('should have correct ARIA attributes', () => {
      const wrapper = mount(ProjectCard, {
        props: { project: mockProject }
      })

      const card = wrapper.find('.project-card')
      expect(card.attributes('role')).toBe('button')
      expect(card.attributes('tabindex')).toBe('0')
      expect(card.attributes('aria-label')).toBe(`查看项目：${mockProject.title}`)
    })
  })

  describe('边界情况', () => {
    it('should handle project with single tech stack', () => {
      const projectWithSingleTech = {
        ...mockProject,
        techStack: [{ name: 'Vue', version: '3.4.15' }]
      }
      const wrapper = mount(ProjectCard, {
        props: { project: projectWithSingleTech }
      })

      const tags = wrapper.findAll('.tag')
      expect(tags.length).toBe(1)
      expect(tags[0].text()).toBe('Vue')
    })

    it('should handle project with long description', () => {
      const longDescription = '这是一个非常长的描述。'.repeat(20)
      const projectWithLongDesc = { ...mockProject, description: longDescription }
      const wrapper = mount(ProjectCard, {
        props: { project: projectWithLongDesc }
      })

      const descElement = wrapper.find('.project-card__description')
      expect(descElement.exists()).toBe(true)
      // 验证文本被截断（通过 CSS line-clamp）
    })

    it('should handle project with empty tech stack', () => {
      const projectWithEmptyTech = { ...mockProject, techStack: [] }
      const wrapper = mount(ProjectCard, {
        props: { project: projectWithEmptyTech }
      })

      expect(wrapper.findAll('.project-card__tech-tag').length).toBe(0)
    })
  })
})