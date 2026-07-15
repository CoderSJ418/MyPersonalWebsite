import type {
  LabCategory,
  LabEffectId,
  LabEffectMetadata,
  LabImplementationOrigin,
  LabParam
} from '@/types/lab'

const ids: LabEffectId[] = [
  'aurora',
  'grid-pattern',
  'dot-pattern',
  'noise-texture',
  'meteors',
  'spotlight',
  'tilt-card',
  'magic-card',
  'shine-border',
  'shimmer-button',
  'number-ticker',
  'marquee'
]
const categories: LabCategory[] = ['background', 'card', 'button', 'data', 'layout']
const origins: LabImplementationOrigin[] = ['original', 'clean-room', 'mit-adaptation']

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isContentArray = (value: unknown, minimum = 1): value is string[] =>
  isStringArray(value) &&
  value.length >= minimum &&
  value.every((item) => item.trim().length > 0)

const isId = (value: unknown): value is LabEffectId =>
  typeof value === 'string' && ids.some((id) => id === value)

const isCategory = (value: unknown): value is LabCategory =>
  typeof value === 'string' && categories.some((category) => category === value)

const isOrigin = (value: unknown): value is LabImplementationOrigin =>
  typeof value === 'string' && origins.some((origin) => origin === value)

const isOption = (value: unknown): boolean =>
  isRecord(value) && typeof value.label === 'string' && typeof value.value === 'string'

const isParam = (value: unknown): value is LabParam => {
  if (!isRecord(value)) return false
  const validType = value.type === 'range' || value.type === 'color' || value.type === 'select'
  const validDefault =
    typeof value.defaultValue === 'string' || typeof value.defaultValue === 'number'
  const validOptions =
    value.options === undefined || (Array.isArray(value.options) && value.options.every(isOption))
  return (
    typeof value.key === 'string' &&
    typeof value.label === 'string' &&
    validType &&
    validDefault &&
    validOptions
  )
}

const isCompatibility = (value: unknown): boolean =>
  isRecord(value) && typeof value.browsers === 'string' && typeof value.fallback === 'string'

const isPreview = (value: unknown): boolean =>
  isRecord(value) && typeof value.src === 'string' && typeof value.alt === 'string'

const isUsageLocation = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.label === 'string' &&
  value.label.trim().length > 0 &&
  typeof value.path === 'string' &&
  value.path.startsWith('/')

export const isLabEffectMetadata = (value: unknown): value is LabEffectMetadata => {
  if (!isRecord(value)) return false
  const validSource = value.sourceUrl === null || typeof value.sourceUrl === 'string'
  return (
    isId(value.id) &&
    typeof value.name === 'string' &&
    typeof value.description === 'string' &&
    isCategory(value.category) &&
    isStringArray(value.tags) &&
    Array.isArray(value.params) &&
    value.params.every(isParam) &&
    isCompatibility(value.compatibility) &&
    isPreview(value.preview) &&
    isContentArray(value.useCases, 2) &&
    isContentArray(value.avoidWhen) &&
    Array.isArray(value.pairings) &&
    value.pairings.length > 0 &&
    value.pairings.every(isId) &&
    isContentArray(value.stack) &&
    isContentArray(value.implementationNotes) &&
    isContentArray(value.performanceNotes) &&
    isContentArray(value.accessibilityNotes) &&
    Array.isArray(value.usedIn) &&
    value.usedIn.every(isUsageLocation) &&
    isStringArray(value.dependencies) &&
    value.license === 'MIT' &&
    validSource &&
    isOrigin(value.implementationOrigin)
  )
}

export const parseLabMetadata = (value: unknown): LabEffectMetadata[] => {
  if (!Array.isArray(value) || !value.every(isLabEffectMetadata)) {
    throw new Error('Lab 元数据不符合公开 Schema')
  }
  const invalidPairing = value.some(
    (effect) =>
      effect.pairings.includes(effect.id) ||
      new Set(effect.pairings).size !== effect.pairings.length
  )
  if (invalidPairing) throw new Error('Lab 搭配关系不能自引用或重复')
  return value
}
