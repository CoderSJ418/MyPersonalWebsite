import { describe, expect, it } from 'vitest'

import projects from '@/assets/data/projects.json'
import metadata from '@/assets/data/lab-effects.json'
import { labRegistry } from '@/config/labRegistry'
import { getReaderView, getRecruitView } from '@/composables/useProjectProjection'
import { formatDate, formatYearMonth } from '@/utils/format'
import {
  blogPostStructuredData,
  breadcrumbStructuredData,
  labCollectionStructuredData,
  labEffectStructuredData,
  personStructuredData,
  projectStructuredData
} from '@/utils/structuredData'
import { createBlogPost } from '../fixtures'

describe('domain projections', () => {
  it('projects complete and fallback project contracts', () => {
    const project = projects[0]
    expect(project).toBeDefined()
    if (!project) return
    expect(getRecruitView(project)?.narrative.metrics).toHaveLength(3)
    expect(getReaderView(project).background).toBe(project.background)
    expect(getRecruitView({ ...project, narrative: undefined })).toBeNull()
  })

  it('generates page-level schema data', () => {
    const project = projects[0]
    const effect = labRegistry[0]
    expect(project).toBeDefined()
    expect(effect).toBeDefined()
    if (!project || !effect) return
    expect(personStructuredData()['@type']).toBe('Person')
    expect(blogPostStructuredData(createBlogPost('one', 'Post', '2026-01-01'))['@type']).toBe(
      'BlogPosting'
    )
    expect(projectStructuredData(project).about).toContain('Vue')
    expect(breadcrumbStructuredData([{ name: 'Home', url: '/' }]).itemListElement[0]?.position).toBe(1)
    expect(labCollectionStructuredData(metadata).hasPart).toHaveLength(12)
    expect(labEffectStructuredData(effect).programmingLanguage).toBe('Vue')
  })

  it('formats supported date variants', () => {
    expect(formatDate('2026-07-14', 'long')).toBeTruthy()
    expect(formatDate('2026-07-14', 'numeric')).toBeTruthy()
    expect(formatDate('2026-07-14')).toBeTruthy()
    expect(formatYearMonth('2026-07')).toContain('2026')
  })
})
