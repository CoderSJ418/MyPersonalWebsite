import type { LabParams } from '@/types/lab'

const toAttribute = ([key, value]: [string, string | number]): string => {
  const attribute = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  if (typeof value === 'number') return `:${attribute}="${value}"`
  return `${attribute}="${value}"`
}

export const createLabUsage = (componentName: string, params: LabParams): string => {
  const attributes = Object.entries(params).map(toAttribute).join(' ')
  return attributes.length > 0 ? `<${componentName} ${attributes} />` : `<${componentName} />`
}
