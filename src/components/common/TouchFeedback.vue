<template>
  <div
    ref="elementRef"
    class="relative"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchCancel"
  >
    <slot />

    <!-- 触摸反馈效果 -->
    <Transition name="ripple">
      <div
        v-if="rippleActive"
        class="ripple-effect absolute rounded-full bg-primary-500/20 pointer-events-none"
        :style="rippleStyle"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type CSSProperties } from 'vue'

const elementRef = ref<HTMLElement | null>(null)
const rippleActive = ref(false)
const rippleX = ref(0)
const rippleY = ref(0)
const rippleSize = ref(0)

const rippleStyle = computed<CSSProperties>(() => ({
  left: `${rippleX.value - rippleSize.value / 2}px`,
  top: `${rippleY.value - rippleSize.value / 2}px`,
  width: `${rippleSize.value}px`,
  height: `${rippleSize.value}px`
}))

const handleTouchStart = (e: TouchEvent) => {
  if (!elementRef.value) return

  const touch = e.touches[0]
  const rect = elementRef.value.getBoundingClientRect()

  rippleX.value = touch.clientX - rect.left
  rippleY.value = touch.clientY - rect.top

  // 计算波纹大小（对角线）
  const size = Math.max(rect.width, rect.height)
  rippleSize.value = size * 2

  rippleActive.value = true
}

const handleTouchEnd = () => {
  // 延迟隐藏波纹效果
  setTimeout(() => {
    rippleActive.value = false
  }, 300)
}

const handleTouchCancel = () => {
  rippleActive.value = false
}
</script>

<style scoped>
.ripple-enter-active,
.ripple-leave-active {
  transition: all 0.3s ease-out;
}

.ripple-enter-from,
.ripple-leave-to {
  opacity: 0;
  transform: scale(0);
}

.ripple-enter-to,
.ripple-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>