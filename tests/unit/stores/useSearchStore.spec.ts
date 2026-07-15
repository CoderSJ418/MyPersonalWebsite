import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useSearchStore } from '@/stores/useSearchStore'
import { createBlogPost } from '../fixtures'

describe('useSearchStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('searches, navigates, persists and resets results', () => {
    const store = useSearchStore()
    const posts = [createBlogPost('one', 'Vue Patterns', '2026-01-01')]
    store.openSearch()
    expect(document.body.style.overflow).toBe('hidden')
    store.performSearch('', posts)
    expect(store.results.total).toBe(0)
    store.performSearch('vue', posts)
    expect(store.selectedResult?.id).toBe('blog-one')
    store.selectNext()
    store.selectPrevious()
    expect(store.history).toEqual(['vue'])
    store.performSearch('vue', posts)
    store.clearHistory()
    store.closeSearch()
    expect(store.isOpen).toBe(false)
  })

  it('wraps selection and tolerates storage failures', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const store = useSearchStore()
    const posts = [
      createBlogPost('one', 'Vue One', '2026-01-01'),
      createBlogPost('two', 'Vue Two', '2026-01-02')
    ]
    store.performSearch('vue', posts)
    store.selectPrevious()
    expect(store.selectedIndex).toBe(1)
    store.selectNext()
    expect(store.selectedIndex).toBe(0)
    expect(warn).toHaveBeenCalled()
  })
})
