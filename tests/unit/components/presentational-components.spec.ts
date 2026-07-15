import { defineComponent, h, markRaw, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import BlogMarkdown from '@/components/blog/BlogMarkdown.vue'
import PostNavigation from '@/components/blog/PostNavigation.vue'
import RelatedPosts from '@/components/blog/RelatedPosts.vue'
import DetailHeader from '@/components/common/DetailHeader.vue'
import DetailMeta from '@/components/common/DetailMeta.vue'
import ContactCTA from '@/components/common/ContactCTA.vue'
import ContentCard from '@/components/common/ContentCard.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import LabCodePanel from '@/components/lab/LabCodePanel.vue'
import LabDemoLoadError from '@/components/lab/LabDemoLoadError.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import ProjectDetailContent from '@/components/projects/ProjectDetailContent.vue'
import ProjectDetailHeader from '@/components/projects/ProjectDetailHeader.vue'
import CTA from '@/components/ui/CTA.vue'
import { useBlogStore } from '@/stores/useBlogStore'
import { useSearchStore } from '@/stores/useSearchStore'
import type { ProjectDetail } from '@/types/project'
import type { LabParam } from '@/types/lab'
import type { ReaderView } from '@/types/view-contract'
import { createBlogPost } from '../fixtures'

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }))

vi.mock('vue-router', () => ({ useRouter: () => ({ push: routerPush }) }))

const fullReader: ReaderView = {
  title: 'Portfolio',
  description: 'A complete case study',
  techStack: [{ name: 'Vue', version: '3.4', displayLabel: 'Vue 3.4' }],
  background: 'Background',
  goals: ['Goal'],
  features: ['Feature'],
  techHighlights: {
    architecture: 'Architecture',
    keyImplementations: ['Implementation'],
    performanceOptimizations: ['Optimization'],
    solution: 'Solution'
  },
  results: {
    performance: 'Fast',
    business: 'Useful',
    feedback: 'Positive',
    highlights: ['Highlight']
  },
  screenshots: ['/screen.webp']
}

const emptyReader: ReaderView = {
  title: 'Empty',
  description: 'No optional content',
  techStack: [],
  background: '',
  goals: [],
  features: [],
  techHighlights: {},
  results: {},
  screenshots: []
}

const project: ProjectDetail = {
  id: 'portfolio',
  title: 'Portfolio',
  description: 'Case study',
  coverImage: '/cover.webp',
  techStack: [
    { name: 'Vue', version: '3.4' },
    { name: 'Vite', version: '' }
  ],
  category: 'Frontend',
  featured: true,
  demoUrl: 'https://example.com',
  githubUrl: 'https://github.com/example/project',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-02',
  background: fullReader.background,
  goals: fullReader.goals,
  features: fullReader.features,
  techHighlights: fullReader.techHighlights,
  results: fullReader.results,
  screenshots: fullReader.screenshots
}

describe('Lab code copy feedback', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard')
    vi.useRealTimers()
  })

  it('shows visible success and failure states beside the relevant code block', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mount(LabCodePanel, {
      props: {
        effectId: 'aurora',
        usage: '<AuroraDemo :speed="2" />',
        sourceLoader: () => Promise.resolve('<template><div /></template>')
      }
    })

    const usageButton = wrapper.findAll('button').find((button) => button.text() === '复制使用方式')
    if (!usageButton) throw new Error('Missing usage copy button')
    await usageButton.trigger('click')
    await Promise.resolve()
    await nextTick()
    expect(usageButton.text()).toBe('✓ 已复制')
    expect(usageButton.classes()).toContain('min-w-32')
    expect(wrapper.get('[role="status"]').text()).toBe('使用方式已复制')

    writeText.mockRejectedValueOnce(new Error('blocked'))
    await usageButton.trigger('click')
    await Promise.resolve()
    await nextTick()
    expect(usageButton.text()).toBe('复制失败')
    expect(wrapper.get('[role="status"]').text()).toBe('复制失败，请手动选择代码')

    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('完整 Vue SFC'))
      ?.trigger('click')
    await Promise.resolve()
    await nextTick()
    const sourceButton = wrapper
      .findAll('button')
      .find((button) => button.text() === '复制完整源码')
    if (!sourceButton) throw new Error('Missing source copy button')
    await sourceButton.trigger('click')
    await Promise.resolve()
    await nextTick()
    expect(sourceButton.text()).toBe('✓ 已复制')
    expect(wrapper.get('[role="status"]').text()).toBe('完整源码已复制')

    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(sourceButton.text()).toBe('复制完整源码')

    wrapper.unmount()
  })
})

describe('Lab parameter layout stability', () => {
  const params: LabParam[] = [
    { key: 'speed', label: '速度', type: 'range', defaultValue: 2, min: 1, max: 5, step: 1 }
  ]

  it('keeps the reset control slot mounted while hiding inactive behavior', async () => {
    const wrapper = mount(LabParamPanel, {
      props: { params, modelValue: { speed: 2 }, hasChanges: false }
    })
    const reset = wrapper.get('button')
    expect(reset.classes()).toContain('invisible')
    expect(reset.attributes('aria-hidden')).toBe('true')
    expect(reset.attributes('tabindex')).toBe('-1')

    await wrapper.setProps({ modelValue: { speed: 3 }, hasChanges: true })
    expect(wrapper.get('button').element).toBe(reset.element)
    expect(reset.classes()).not.toContain('invisible')
    expect(reset.attributes('aria-hidden')).toBe('false')
  })
})

describe('Lab asynchronous load recovery', () => {
  it('offers full reload and catalog recovery actions', () => {
    const wrapper = mount(LabDemoLoadError)
    const links = wrapper.findAll('a')
    expect(links.map((link) => link.text())).toEqual(['重新加载演示', '返回交互实验室'])
    expect(links[0]?.attributes('href')).toBe('')
    expect(links[1]?.attributes('href')).toBe('/lab')
  })
})

const mountSearchModal = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const search = useSearchStore()
  const blog = useBlogStore()
  const wrapper = mount(SearchModal, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
      stubs: { Teleport: true }
    }
  })
  return { blog, search, wrapper }
}

describe('detail presentation components', () => {
  it('renders and emits every optional header interaction', async () => {
    const wrapper = mount(DetailHeader, {
      props: {
        title: 'Case study',
        category: 'Frontend',
        description: 'Description',
        metaItems: [{ icon: 'calendar', value: '2026' }],
        tags: ['Vue'],
        coverImage: '/cover.webp',
        featured: true,
        layout: 'side-by-side'
      },
      slots: { links: '<a href="/demo">Demo</a>' }
    })
    await wrapper.get('.dh__category').trigger('click')
    await wrapper.get('.dh__category').trigger('keydown.enter')
    await wrapper.get('.dh__tag').trigger('click')
    await wrapper.get('.dh__tag').trigger('keydown.enter')
    expect(wrapper.emitted('category-click')).toHaveLength(2)
    expect(wrapper.emitted('tag-click')).toHaveLength(2)
    expect(wrapper.find('.dh__featured').exists()).toBe(true)

    const minimal = mount(DetailHeader, { props: { title: 'Minimal' } })
    expect(minimal.find('.dh__cover').exists()).toBe(false)
    expect(minimal.find('.dh__description').exists()).toBe(false)
  })

  it('renders known, unknown, dated and plain metadata', () => {
    const wrapper = mount(DetailMeta, {
      props: {
        align: 'left',
        items: [
          { icon: 'calendar', value: '2026', datetime: '2026-01-01' },
          { icon: 'unknown', value: 'Unknown' },
          { value: 'Plain' }
        ]
      }
    })
    expect(wrapper.findAll('time')).toHaveLength(1)
    expect(wrapper.findAll('.dm__item')).toHaveLength(3)
  })
})

describe('contact shortcut', () => {
  it('opens and closes through button, escape and outside click', async () => {
    const wrapper = mount(ContactCTA, { attachTo: document.body })
    const toggle = wrapper.get('.contact-cta__btn')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await toggle.trigger('click')
    expect(wrapper.find('.contact-cta__panel').exists()).toBe(true)
    expect(wrapper.findAll('.contact-cta__link')).toHaveLength(3)
    wrapper.get('.contact-cta').element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.find('.contact-cta__panel').exists()).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.find('.contact-cta__panel').exists()).toBe(false)

    await toggle.trigger('click')
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.find('.contact-cta__panel').exists()).toBe(false)
    await toggle.trigger('click')
    await wrapper.get('.contact-cta__panel-close').trigger('click')
    expect(wrapper.find('.contact-cta__panel').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('content card variants', () => {
  it('renders complete and minimal project cards', async () => {
    const wrapper = mount(ContentCard, {
      props: {
        variant: 'project',
        title: 'Project',
        description: 'Impact',
        coverImage: '/project-cover.svg',
        coverAlt: 'Project architecture',
        tags: ['Vue', 'TypeScript', 'Vite'],
        maxTags: 2,
        metrics: [
          { label: 'Speed', value: '2x' },
          { label: 'Users', value: '100' }
        ],
        href: '/projects/1',
        linkUrl: 'https://example.com',
        linkLabel: 'Live'
      }
    })
    expect(wrapper.findAll('.pc__metric')).toHaveLength(2)
    expect(wrapper.get('img').attributes('alt')).toBe('Project architecture')
    expect(wrapper.find('.pc__tag--more').text()).toContain('+1')
    await wrapper.get('.pc__tag').trigger('click')
    await wrapper.get('.pc').trigger('click')
    expect(wrapper.emitted('tag-click')?.[0]).toEqual(['Vue'])
    expect(wrapper.emitted('click')).toHaveLength(1)

    const minimal = mount(ContentCard, { props: { variant: 'project', title: 'Minimal' } })
    expect(minimal.find('.pc__metrics').exists()).toBe(false)
    expect(minimal.find('.pc__link').exists()).toBe(false)
    await minimal.get('.pc').trigger('click')
  })

  it('renders blog card metadata and semantic events', async () => {
    const wrapper = mount(ContentCard, {
      props: {
        title: 'Blog',
        description: 'Excerpt',
        coverImage: '/cover.webp',
        featured: true,
        category: 'Vue',
        date: 'invalid-date',
        readTime: 5,
        tags: ['Testing'],
        href: '/blog/1'
      }
    })
    expect(wrapper.get('.bc__date').text()).toBe('invalid-date')
    expect(wrapper.get('.bc').classes()).toContain('bc--featured')
    await wrapper.get('.bc__category').trigger('click')
    await wrapper.get('.bc__tag').trigger('click')
    await wrapper.get('.bc').trigger('click')
    expect(wrapper.emitted('category-click')?.[0]).toEqual(['Vue'])
    expect(wrapper.emitted('tag-click')?.[0]).toEqual(['Testing'])
  })

  it('renders complete and empty feed rows', async () => {
    const full = mount(ContentCard, {
      props: {
        title: 'Feed',
        layout: 'feed',
        description: 'Insight',
        category: 'AI',
        date: '2026-01-02',
        readTime: 4,
        href: '/blog/feed'
      }
    })
    expect(full.findAll('.bf__dot')).toHaveLength(2)
    await full.get('.bf').trigger('click')
    const empty = mount(ContentCard, { props: { title: 'Empty', layout: 'feed' } })
    expect(empty.find('.bf__insight').exists()).toBe(false)
    expect(empty.find('.bf__category').exists()).toBe(false)
    await empty.get('.bf').trigger('click')
  })
})

describe('CTA states', () => {
  const icon = markRaw(defineComponent({ setup: () => () => h('svg') }))

  it('renders button, link, icon and disabled states', async () => {
    const button = mount(CTA, { slots: { default: 'Submit' } })
    await button.get('button').trigger('click')
    expect(button.emitted('click')).toHaveLength(1)

    const link = mount(CTA, {
      props: { href: '/projects', target: '_blank', size: 'large', fullWidth: true },
      slots: { default: 'Projects' }
    })
    expect(link.get('a').attributes('rel')).toBe('noopener noreferrer')
    expect(link.find('.cta__arrow').exists()).toBe(true)
    const left = mount(CTA, { props: { icon }, slots: { default: 'Left' } })
    const right = mount(CTA, {
      props: { icon, iconPosition: 'right' },
      slots: { default: 'Right' }
    })
    expect(left.find('.cta__icon--left').exists()).toBe(true)
    expect(right.find('.cta__icon--right').exists()).toBe(true)

    const disabled = mount(CTA, { props: { disabled: true }, slots: { default: 'Disabled' } })
    await disabled.get('button').trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
    const loading = mount(CTA, { props: { loading: true }, slots: { default: 'Loading' } })
    await loading.get('button').trigger('click')
    expect(loading.find('.cta__spinner').exists()).toBe(true)
    expect(loading.emitted('click')).toBeUndefined()
  })
})

describe('blog presentation components', () => {
  it('switches markdown loading state and forwards content clicks', async () => {
    const wrapper = mount(BlogMarkdown, {
      props: { content: '<p>Rendered</p>', isLoading: true }
    })
    expect(wrapper.find('.bm__loading').exists()).toBe(true)
    await wrapper.setProps({ isLoading: false })
    await wrapper.get('.bm__markdown').trigger('click')
    expect(wrapper.text()).toContain('Rendered')
    expect(wrapper.emitted('contentClick')).toHaveLength(1)
  })

  it('renders, navigates and hides adjacent posts', async () => {
    const previous = createBlogPost('1', 'Previous', '2026-01-01')
    const next = createBlogPost('2', 'Next', '2026-01-02')
    const wrapper = mount(PostNavigation, {
      props: { previousPost: previous, nextPost: next }
    })
    await wrapper.findAll('a')[0]?.trigger('click')
    await wrapper.findAll('a')[1]?.trigger('click')
    expect(routerPush).toHaveBeenCalledTimes(2)
    expect(
      mount(PostNavigation, {
        props: { previousPost: null, nextPost: null }
      }).findAll('a')
    ).toHaveLength(0)
  })

  it('renders related posts and forwards card selection', async () => {
    const post = createBlogPost('1', 'Related', '2026-01-01')
    const wrapper = mount(RelatedPosts, { props: { posts: [post], title: 'More' } })
    await wrapper.get('.bc').trigger('click')
    expect(wrapper.emitted('click')?.[0]).toEqual([post])
    expect(mount(RelatedPosts, { props: { posts: [] } }).findAll('.bc')).toHaveLength(0)
  })
})

describe('project presentation components', () => {
  it('renders complete and empty reader contracts', () => {
    const full = mount(ProjectDetailContent, { props: { data: fullReader } })
    expect(full.findAll('.ds').length).toBeGreaterThan(5)
    expect(full.findAll('.pdc__screenshots img')).toHaveLength(1)

    const empty = mount(ProjectDetailContent, { props: { data: emptyReader } })
    expect(empty.findAll('.ds')).toHaveLength(2)
    expect(empty.find('.pdc__screenshots').exists()).toBe(false)
  })

  it('projects header metadata, links and technology events', async () => {
    const wrapper = mount(ProjectDetailHeader, { props: { project } })
    expect(wrapper.findAll('.pdh__link')).toHaveLength(2)
    await wrapper.findAll('.dh__tag')[0]?.trigger('click')
    expect(wrapper.emitted('techStackClick')?.[0]).toEqual(['Vue'])

    const minimalProject: ProjectDetail = {
      ...project,
      createdAt: '',
      demoUrl: undefined,
      githubUrl: undefined,
      techStack: [{ name: 'Vue', version: '' }]
    }
    const minimal = mount(ProjectDetailHeader, { props: { project: minimalProject } })
    expect(minimal.findAll('.pdh__link')).toHaveLength(0)
    expect(minimal.findAll('.dm__item')).toHaveLength(1)
  })
})

describe('search modal states', () => {
  it('opens, restores history and traps tab focus', async () => {
    const { search, wrapper } = mountSearchModal()
    expect(wrapper.find('.sm').exists()).toBe(false)
    search.history = ['Vue']
    search.openSearch()
    await nextTick()
    await nextTick()
    const input = wrapper.get<HTMLInputElement>('.sm__input')
    expect(document.activeElement).toBe(input.element)

    await wrapper.get('.sm__history-tag').trigger('click')
    expect(search.query).toBe('Vue')
    search.query = ''
    await nextTick()
    const last = wrapper.get<HTMLElement>('.sm__history-tag')
    last.element.focus()
    await wrapper.get('.sm__dialog').trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(input.element)
    input.element.focus()
    await wrapper.get('.sm__dialog').trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last.element)

    await wrapper.get('.sm__history-clear').trigger('click')
    expect(search.history).toHaveLength(0)
    await wrapper.get('.sm').trigger('click')
    expect(search.isOpen).toBe(false)
    wrapper.unmount()
  })

  it('renders loading, empty, result and keyboard navigation states', async () => {
    routerPush.mockClear()
    const { blog, search, wrapper } = mountSearchModal()
    blog.posts = [createBlogPost('1', 'Vue Guide', '2026-01-01')]
    search.openSearch()
    search.loading = true
    await nextTick()
    expect(wrapper.find('.sm__loading').exists()).toBe(true)

    search.loading = false
    search.query = 'missing'
    await nextTick()
    expect(wrapper.find('.sm__empty').exists()).toBe(true)
    await wrapper.get('.sm__input').trigger('keydown', { key: 'Enter' })
    await wrapper.get('.sm__input').trigger('keydown', { key: 'x' })

    search.query = ''
    search.history = []
    await nextTick()
    expect(wrapper.find('.sm__empty').exists()).toBe(true)
    search.query = 'Vue'
    await nextTick()
    search.results = {
      total: 2,
      items: [
        {
          id: 'one',
          title: '<mark>Vue</mark>',
          description: 'Guide',
          url: '/blog/1',
          type: 'blog',
          date: '2026-01-01'
        },
        { id: 'two', title: 'Vite', url: '/blog/2', type: 'blog' }
      ]
    }
    await nextTick()
    expect(wrapper.findAll('.sm__result')).toHaveLength(2)
    expect(wrapper.find('.sm__footer').exists()).toBe(true)
    const input = wrapper.get('.sm__input')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(search.selectedIndex).toBe(1)
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(search.selectedIndex).toBe(0)
    await wrapper.findAll('.sm__result')[1]?.trigger('mouseenter')
    expect(search.selectedIndex).toBe(1)
    await input.trigger('keydown', { key: 'Enter' })
    expect(routerPush).toHaveBeenCalledWith('/blog/2')

    search.openSearch()
    await nextTick()
    await wrapper.get('.sm__input').trigger('keydown', { key: 'Escape' })
    expect(search.isOpen).toBe(false)
    wrapper.unmount()
  })
})
