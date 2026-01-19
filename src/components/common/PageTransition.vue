<template>
  <transition
    :name="transitionName"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'

/**
 * 页面过渡类型
 */
export type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'flip'

interface Props {
  type?: TransitionType
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'fade',
  duration: 0.5,
})

const transitionName = ref(`page-${props.type}`)

/**
 * 进入前
 */
const beforeEnter = (el: Element) => {
  gsap.set(el, { opacity: 0 })
}

/**
 * 进入
 */
const enter = (el: Element, done: () => void) => {
  const duration = props.duration

  switch (props.type) {
    case 'fade':
      gsap.to(el, {
        opacity: 1,
        duration,
        ease: 'power2.out',
        onComplete: done,
      })
      break

    case 'slide-left':
      gsap.fromTo(
        el,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration,
          ease: 'power3.out',
          onComplete: done,
        }
      )
      break

    case 'slide-right':
      gsap.fromTo(
        el,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration,
          ease: 'power3.out',
          onComplete: done,
        }
      )
      break

    case 'zoom':
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration,
          ease: 'back.out(1.7)',
          onComplete: done,
        }
      )
      break

    case 'flip':
      gsap.fromTo(
        el,
        { opacity: 0, rotationY: -90 },
        {
          opacity: 1,
          rotationY: 0,
          duration,
          ease: 'power2.out',
          onComplete: done,
        }
      )
      break
  }
}

/**
 * 进入后
 */
const afterEnter = (el: Element) => {
  // 可以在这里添加进入后的回调
}

/**
 * 离开前
 */
const beforeLeave = (el: Element) => {
  // 可以在这里添加离开前的回调
}

/**
 * 离开
 */
const leave = (el: Element, done: () => void) => {
  const duration = props.duration

  switch (props.type) {
    case 'fade':
      gsap.to(el, {
        opacity: 0,
        duration,
        ease: 'power2.in',
        onComplete: done,
      })
      break

    case 'slide-left':
      gsap.to(el, {
        opacity: 0,
        x: -50,
        duration,
        ease: 'power3.in',
        onComplete: done,
      })
      break

    case 'slide-right':
      gsap.to(el, {
        opacity: 0,
        x: 50,
        duration,
        ease: 'power3.in',
        onComplete: done,
      })
      break

    case 'zoom':
      gsap.to(el, {
        opacity: 0,
        scale: 1.1,
        duration,
        ease: 'power2.in',
        onComplete: done,
      })
      break

    case 'flip':
      gsap.to(el, {
        opacity: 0,
        rotationY: 90,
        duration,
        ease: 'power2.in',
        onComplete: done,
      })
      break
  }
}

/**
 * 离开后
 */
const afterLeave = (el: Element) => {
  // 可以在这里添加离开后的回调
}
</script>

<style scoped>
/* Fade 过渡 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.5s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Slide Left 过渡 */
.page-slide-left-enter-active,
.page-slide-left-leave-active {
  transition: all 0.5s ease;
}

.page-slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.page-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Slide Right 过渡 */
.page-slide-right-enter-active,
.page-slide-right-leave-active {
  transition: all 0.5s ease;
}

.page-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.page-slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* Zoom 过渡 */
.page-zoom-enter-active,
.page-zoom-leave-active {
  transition: all 0.5s ease;
}

.page-zoom-enter-from,
.page-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Flip 过渡 */
.page-flip-enter-active,
.page-flip-leave-active {
  transition: all 0.5s ease;
}

.page-flip-enter-from,
.page-flip-leave-to {
  opacity: 0;
  transform: perspective(1000px) rotateY(-90deg);
}
</style>