/**
 * 设备检测工具函数
 */

/**
 * 检测是否为移动设备
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * 检测是否支持触摸
 */
export const isTouch = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 检测是否为低端设备
 */
export const isLowEnd = (): boolean => {
  if (typeof window === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as any).deviceMemory || 4
  return cores < 4 || memory < 4
}

/**
 * 获取设备类型
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth

  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * 获取性能等级
 */
export const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
  if (isMobile() || isLowEnd()) return 'low'
  if (getDeviceType() === 'tablet') return 'medium'
  return 'high'
}