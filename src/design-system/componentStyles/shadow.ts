/**
 * 微阴影组件风格
 * 轻微阴影，层次感强
 */

import type { ComponentStyle } from './types'

export const shadow: ComponentStyle = {
  id: 'shadow',
  name: '微阴影',
  description: '轻微阴影，层次感强',
  styles: {
    card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md',
    button: 'bg-primary-600 text-white rounded-lg shadow-sm',
    input: 'border-2 border-gray-300 rounded-lg shadow-sm'
  },
  effects: {
    shadow: true,
    border: true,
    glass: false
  }
}
