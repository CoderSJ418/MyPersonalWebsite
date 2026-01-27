/**
 * 玻璃效果组件风格
 * 毛玻璃效果，现代感强
 */

import type { ComponentStyle } from './types'

export const glass: ComponentStyle = {
  id: 'glass',
  name: '玻璃效果',
  description: '毛玻璃效果，现代感强',
  styles: {
    card: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-xl border border-white/20',
    button: 'bg-primary-600/80 backdrop-blur-sm text-white rounded-xl border border-white/20',
    input: 'bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl'
  },
  effects: {
    shadow: false,
    border: true,
    glass: true
  }
}
