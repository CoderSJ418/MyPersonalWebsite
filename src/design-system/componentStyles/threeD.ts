/**
 * 3D效果组件风格
 * 3D质感，视觉冲击力大
 */

import type { ComponentStyle } from './types'

export const threeD: ComponentStyle = {
  id: '3d',
  name: '3D效果',
  description: '3D质感，视觉冲击力大',
  styles: {
    card: 'bg-white dark:bg-gray-800 rounded-xl shadow-xl',
    button: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl shadow-lg',
    input: 'border-2 border-gray-300 rounded-xl shadow-lg'
  },
  effects: {
    shadow: true,
    border: true,
    glass: false
  }
}
