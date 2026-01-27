/**
 * 动画配置 Token
 * 定义动画时长和缓动函数
 */

export const animation = {
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.6, 1)'
  }
}
