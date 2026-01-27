/**
 * 扁平化组件风格
 * 简洁、无阴影，现代感强
 */

import type { ComponentStyle } from './types'

export const flat: ComponentStyle = {
  id: 'flat',
  name: '扁平化',
  description: '简洁、无阴影，现代感强',
  styles: {
    card: 'bg-white dark:bg-gray-800 rounded-lg',
    button: 'bg-primary-600 text-white rounded-lg',
    input: 'border-2 border-gray-300 rounded-lg'
  },
  effects: {
    shadow: false,
    border: true,
    glass: false
  }
}
