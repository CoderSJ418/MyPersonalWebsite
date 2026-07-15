import { afterEach, describe, expect, it, vi } from 'vitest'

import projects from '@/assets/data/projects.json'
import {
  debounce,
  flattenSearchResults,
  getSearchResultsTotal,
  globalSearch,
  highlightText
} from '@/utils/search'
import { createBlogPost } from '../fixtures'

describe('search utilities', () => {
  afterEach(() => vi.useRealTimers())

  it('debounces repeated calls and escapes highlight patterns', () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const debounced = debounce(callback, 20)
    debounced('first')
    debounced('second')
    vi.advanceTimersByTime(20)
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith('second')
    expect(highlightText('Vue (3)', '(3)')).toContain('<mark')
    expect(highlightText('Vue', '')).toBe('Vue')
    expect(highlightText('', 'vue')).toBe('')
  })

  it('searches every content domain and flattens results', () => {
    const skills = [
      { id: 'vue', name: 'Vue', category: 'frontend', level: 5, description: 'Vue expert' },
      { id: 'node', name: 'Node', category: 'backend', level: 4 }
    ]
    const blogs = [createBlogPost('vue', 'Vue Guide', '2026-01-01')]
    const results = globalSearch(projects, skills, blogs, 'vue')
    expect(results.projects.length).toBeGreaterThan(0)
    expect(results.skills).toHaveLength(1)
    expect(results.blogs).toHaveLength(1)
    expect(getSearchResultsTotal(results)).toBe(flattenSearchResults(results).length)
    expect(globalSearch(projects, skills, blogs, '').projects).toEqual([])
  })
})
