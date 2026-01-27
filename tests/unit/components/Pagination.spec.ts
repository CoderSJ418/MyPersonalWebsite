import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '@/components/common/Pagination.vue'

describe('Pagination', () => {
  it('should render current page and total pages', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5
      }
    })

    expect(wrapper.text()).toContain('第 1 / 5 页')
  })

  it('should disable prev button on first page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5
      }
    })

    const prevButton = wrapper.findAll('button')[0]
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  it('should disable next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 5,
        totalPages: 5
      }
    })

    const nextButton = wrapper.findAll('button').slice(-1)[0]
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('should emit page-change event when clicking next button', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5
      }
    })

    const nextButton = wrapper.findAll('button').slice(-1)[0]
    await nextButton.trigger('click')

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0]).toEqual([2])
  })

  it('should emit page-change event when clicking prev button', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 3,
        totalPages: 5
      }
    })

    const prevButton = wrapper.findAll('button')[0]
    await prevButton.trigger('click')

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0]).toEqual([2])
  })

  it('should emit page-change event when clicking page number', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5
      }
    })

    const pageButtons = wrapper.findAll('button').slice(1, -1)
    await pageButtons[1].trigger('click')

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0]).toEqual([2])
  })

  it('should show ellipsis when total pages exceed maxVisible', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 5,
        totalPages: 10,
        maxVisible: 7
      }
    })

    const text = wrapper.text()
    expect(text).toContain('...')
  })

  it('should highlight current page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 3,
        totalPages: 5
      }
    })

    const pageButtons = wrapper.findAll('button').slice(1, -1)
    const currentPageButton = pageButtons.find(btn => btn.text() === '3')

    expect(currentPageButton?.classes()).toContain('bg-theme-primary')
  })

  it('should have correct ARIA attributes', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5
      }
    })

    const nav = wrapper.find('nav')
    expect(nav.attributes('aria-label')).toBe('分页导航')

    const prevButton = wrapper.findAll('button')[0]
    expect(prevButton.attributes('aria-label')).toBe('上一页')

    const nextButton = wrapper.findAll('button').slice(-1)[0]
    expect(nextButton.attributes('aria-label')).toBe('下一页')
  })

  it('should set aria-current on current page button', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 3,
        totalPages: 5
      }
    })

    const pageButtons = wrapper.findAll('button').slice(1, -1)
    const currentPageButton = pageButtons.find(btn => btn.text() === '3')

    expect(currentPageButton?.attributes('aria-current')).toBe('page')
  })

  it('should handle single page correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 1
      }
    })

    const buttons = wrapper.findAll('button')
    // Only one page button, prev and next should be disabled
    expect(buttons.length).toBeLessThanOrEqual(3)
  })

  it('should not emit event when clicking current page', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 3,
        totalPages: 5
      }
    })

    const pageButtons = wrapper.findAll('button').slice(1, -1)
    const currentPageButton = pageButtons.find(btn => btn.text() === '3')

    await currentPageButton?.trigger('click')

    expect(wrapper.emitted('page-change')).toBeFalsy()
  })
})