import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 移动端性能优化 Hook
 */
export function useMobilePerformance() {
  const isMobile = ref(false)
  const isLowEndDevice = ref(false)
  const prefersReducedMotion = ref(false)

  // 检测是否为移动设备
  const checkMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as Window).opera
    isMobile.value =
      /android|ipad|iphone|ipod/i.test(userAgent) || (window as Window).isMobile !== undefined
  }

  // 检测低端设备
  const checkLowEndDevice = () => {
    // 基于 CPU 核心数和内存
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as Navigator).deviceMemory || 8

    // 少于 4 核或少于 4GB 内存视为低端设备
    isLowEndDevice.value = cores < 4 || memory < 4
  }

  // 检测用户是否偏好减少动画
  const checkReducedMotion = () => {
    const mediaQuery = (window as Window).matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
  }

  // 监听减少运动偏好变化
  const handleReducedMotionChange = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }

  onMounted(() => {
    checkMobile()
    checkLowEndDevice()
    checkReducedMotion()

    // 监听减少运动偏好变化
    const mediaQuery = (window as Window).matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', handleReducedMotionChange)
  })

  onUnmounted(() => {
    const mediaQuery = (window as Window).matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.removeEventListener('change', handleReducedMotionChange)
  })

  return {
    isMobile,
    isLowEndDevice,
    prefersReducedMotion
  }
}