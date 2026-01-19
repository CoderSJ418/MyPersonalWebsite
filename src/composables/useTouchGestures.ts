import { ref, Ref, onMounted, onUnmounted } from 'vue'

export interface TouchGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onLongPress?: () => void
  onDoubleTap?: () => void
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
}

export function useTouchGestures(
  elementRef: Ref<HTMLElement | null>,
  options: TouchGestureOptions = {}
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onLongPress,
    onDoubleTap,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300
  } = options

  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchEndX = ref(0)
  const touchEndY = ref(0)
  const longPressTimer = ref<number | null>(null)
  const lastTapTime = ref(0)
  const isLongPressTriggered = ref(false)

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    touchStartX.value = touch.clientX
    touchStartY.value = touch.clientY
    touchEndX.value = touch.clientX
    touchEndY.value = touch.clientY
    isLongPressTriggered.value = false

    // 长按检测
    if (onLongPress) {
      longPressTimer.value = window.setTimeout(() => {
        isLongPressTriggered.value = true
        onLongPress()
      }, longPressDelay)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    touchEndX.value = touch.clientX
    touchEndY.value = touch.clientY

    // 如果移动距离超过阈值，取消长按
    const deltaX = Math.abs(touchEndX.value - touchStartX.value)
    const deltaY = Math.abs(touchEndY.value - touchStartY.value)

    if (longPressTimer.value && (deltaX > 10 || deltaY > 10)) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    // 清除长按定时器
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }

    // 如果已经触发长按，不处理其他手势
    if (isLongPressTriggered.value) return

    const deltaX = touchEndX.value - touchStartX.value
    const deltaY = touchEndY.value - touchStartY.value
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 双击检测
    if (onDoubleTap) {
      const currentTime = Date.now()
      const timeDiff = currentTime - lastTapTime.value

      if (timeDiff < doubleTapDelay) {
        onDoubleTap()
        lastTapTime.value = 0
        return
      }
      lastTapTime.value = currentTime
    }

    // 滑动检测（只检测水平或垂直滑动，取较大的方向）
    if (Math.max(absDeltaX, absDeltaY) > swipeThreshold) {
      if (absDeltaX > absDeltaY) {
        // 水平滑动
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // 垂直滑动
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }
  }

  const handleTouchCancel = () => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }

  onMounted(() => {
    const element = elementRef.value
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true })
      element.addEventListener('touchmove', handleTouchMove, { passive: true })
      element.addEventListener('touchend', handleTouchEnd, { passive: true })
      element.addEventListener('touchcancel', handleTouchCancel, { passive: true })
    }
  })

  onUnmounted(() => {
    const element = elementRef.value
    if (element) {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchCancel)
    }

    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
    }
  })

  return {
    touchStartX,
    touchStartY,
    touchEndX,
    touchEndY
  }
}

// 下拉刷新 Hook
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  threshold = 80
) {
  const isPulling = ref(false)
  const pullDistance = ref(0)
  const isRefreshing = ref(false)
  const startY = ref(0)

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing.value) {
      startY.value = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing.value && startY.value > 0) {
      const currentY = e.touches[0].clientY
      const distance = currentY - startY.value

      if (distance > 0) {
        isPulling.value = true
        // 添加阻尼效果
        pullDistance.value = distance * 0.5
      }
    }
  }

  const handleTouchEnd = async () => {
    if (isPulling.value && pullDistance.value >= threshold) {
      isRefreshing.value = true
      pullDistance.value = threshold

      try {
        await onRefresh()
      } finally {
        isRefreshing.value = false
        pullDistance.value = 0
      }
    } else {
      isPulling.value = false
      pullDistance.value = 0
    }

    startY.value = 0
  }

  onMounted(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    isPulling,
    pullDistance,
    isRefreshing
  }
}