import { describe, expect, it } from 'vitest'

import metadata from '@/assets/data/lab-effects.json'
import { parseLabMetadata } from '@/utils/labMetadata'
import { createLabUsage } from '@/utils/labUsage'

describe('Lab metadata and usage', () => {
  it('parses the complete frozen metadata document', () => {
    const effects = parseLabMetadata(metadata)
    expect(effects).toHaveLength(12)
    expect(new Set(effects.map((effect) => effect.id)).size).toBe(12)
    for (const effect of effects) {
      expect(effect.useCases.length).toBeGreaterThanOrEqual(2)
      expect(effect.avoidWhen.length).toBeGreaterThanOrEqual(1)
      expect(effect.pairings.length).toBeGreaterThanOrEqual(1)
      expect(effect.stack.length).toBeGreaterThanOrEqual(1)
      expect(effect.implementationNotes.length).toBeGreaterThanOrEqual(1)
      expect(effect.performanceNotes.length).toBeGreaterThanOrEqual(1)
      expect(effect.accessibilityNotes.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('rejects incomplete or invalid metadata', () => {
    expect(() => parseLabMetadata(null)).toThrow()
    expect(() => parseLabMetadata([{ id: 'unknown' }])).toThrow()
    expect(() => parseLabMetadata([{ ...metadata[0], license: 'GPL' }])).toThrow()
    expect(() => parseLabMetadata([{ ...metadata[0], useCases: [] }])).toThrow()
    expect(() => parseLabMetadata([{ ...metadata[0], pairings: ['missing-effect'] }])).toThrow()
    expect(() => parseLabMetadata([{ ...metadata[0], pairings: ['aurora'] }])).toThrow()
  })

  it('generates a usage snippet from current string and numeric params', () => {
    expect(createLabUsage('AuroraDemo', { speed: 4, colorTheme: 'purple' })).toBe(
      '<AuroraDemo :speed="4" color-theme="purple" />'
    )
    expect(createLabUsage('StaticDemo', {})).toBe('<StaticDemo />')
  })
})
