<template>
  <section class="hero-section">
    <div class="hero-container">
      <!-- 背景动画 -->
      <div class="hero-background">
        <div ref="shape1Ref" class="background-shape shape-1" />
        <div ref="shape2Ref" class="background-shape shape-2" />
        <div ref="shape3Ref" class="background-shape shape-3" />
      </div>

      <!-- 内容区域 -->
      <div class="hero-content">
        <div class="content-wrapper">
          <!-- 头像占位符 -->
          <div class="avatar-placeholder">
            <div class="avatar-shape" />
          </div>

          <!-- 标题区域 -->
          <div class="title-area">
            <h1 ref="titleRef" class="main-title">
              <span class="title-text">佘杰</span>
              <span class="title-subtitle">前端开发工程师</span>
            </h1>
            
            <div ref="underlineRef" class="title-underline" />
          </div>

          <!-- 描述区域 -->
          <div class="description-area">
            <p ref="descriptionRef" class="main-description">
              Vue 3 & Next.js 前端专家 | AI 辅助开发 | 性能优化大师
            </p>
          </div>

          <!-- 技能标签 -->
          <div ref="skillsRef" class="skills-tags">
            <span class="skill-tag">Vue 3</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">Tailwind CSS</span>
            <span class="skill-tag">GSAP</span>
            <span class="skill-tag">Next.js</span>
          </div>

          <!-- CTA 按钮 -->
          <div class="cta-buttons">
            <button ref="ctaPrimaryRef" class="cta-button primary">
              <span class="button-text">查看项目</span>
            </button>
            <button ref="ctaSecondaryRef" class="cta-button secondary">
              <span class="button-text">联系我</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 滚动指示器 -->
      <div ref="scrollIndicatorRef" class="scroll-indicator">
        <div class="scroll-arrow" />
        <span class="scroll-text">向下滚动</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAPAnimation } from '@/utils/gsapOptimizer'

// 注册插件
gsap.registerPlugin(ScrollTrigger)

const {
  createAnimation,
  createScrollAnimation,
  killAll
} = useGSAPAnimation()

// 引用元素
const heroRef = ref<HTMLElement>()
const shape1Ref = ref<HTMLElement>()
const shape2Ref = ref<HTMLElement>()
const shape3Ref = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const underlineRef = ref<HTMLElement>()
const descriptionRef = ref<HTMLElement>()
const skillsRef = ref<HTMLElement>()
const ctaPrimaryRef = ref<HTMLElement>()
const ctaSecondaryRef = ref<HTMLElement>()
const scrollIndicatorRef = ref<HTMLElement>()

// 动画配置
const animationConfig = {
  duration: 1.2,
  ease: 'power3.out',
  stagger: 0.1
}

// 创建背景动画
const createBackgroundAnimations = () => {
  if (!shape1Ref.value || !shape2Ref.value || !shape3Ref.value) return

  // 形状1：旋转和缩放
  createAnimation(shape1Ref.value, {
    rotation: 360,
    scale: 1.2,
    transformOrigin: 'center'
  }, {
    duration: 20,
    repeat: -1,
    ease: 'none'
  })

  // 形状2：上下浮动
  createAnimation(shape2Ref.value, {
    y: -20,
    rotation: 180
  }, {
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 形状3：缩放和透明度
  createAnimation(shape3Ref.value, {
    scale: 1.5,
    opacity: 0.8
  }, {
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
}

// 创建标题动画
const createTitleAnimations = () => {
  if (!titleRef.value) return

  // 标题文本动画
  const textElements = titleRef.value.querySelectorAll('.title-text, .title-subtitle')
  textElements.forEach((el, index) => {
    createAnimation(el, {
      opacity: 0,
      y: 50,
      scale: 0.8
    }, {
      ...animationConfig,
      delay: index * 0.2,
      onStart: () => {
        (el as HTMLElement).style.opacity = '0'
      }
    })
  })

  // 下划线动画
  if (underlineRef.value) {
    createAnimation(underlineRef.value, {
      width: '100%'
    }, {
      ...animationConfig,
      delay: 0.6
    })
  }
}

// 创建描述动画
const createDescriptionAnimation = () => {
  if (!descriptionRef.value) return

  createAnimation(descriptionRef.value, {
    opacity: 0,
    y: 30
  }, {
    ...animationConfig,
    delay: 0.8
  })
}

// 创建技能标签动画
const createSkillsAnimation = () => {
  if (!skillsRef.value) return

  const skillTags = skillsRef.value.querySelectorAll('.skill-tag')
  skillTags.forEach((tag, index) => {
    createAnimation(tag, {
      opacity: 0,
      scale: 0.5,
      rotate: -10
    }, {
      ...animationConfig,
      delay: 1.0 + index * 0.1,
      onStart: () => {
        (tag as HTMLElement).style.opacity = '0'
      }
    })
  })
}

// 创建 CTA 按钮动画
const createCTAAnimations = () => {
  if (!ctaPrimaryRef.value || !ctaSecondaryRef.value) return

  // 主要按钮
  createAnimation(ctaPrimaryRef.value, {
    opacity: 0,
    y: 30,
    scale: 0.9
  }, {
    ...animationConfig,
    delay: 1.3
  })

  // 次要按钮
  createAnimation(ctaSecondaryRef.value, {
    opacity: 0,
    y: 30,
    scale: 0.9
  }, {
    ...animationConfig,
    delay: 1.5
  })
}

// 创建滚动指示器动画
const createScrollIndicatorAnimation = () => {
  if (!scrollIndicatorRef.value) return

  createAnimation(scrollIndicatorRef.value, {
    y: 10,
    opacity: 0.7
  }, {
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

// 创建滚动触发器
const createScrollTriggers = () => {
  if (!heroRef.value) return

  // 主题切换动画
  createScrollAnimation(heroRef.value, {
    '--gradient-start': '#667eea',
    '--gradient-end': '#764ba2'
  }, {
    trigger: heroRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  })

  // 背景形状跟随滚动
  createScrollAnimation(shape1Ref.value, {
    rotation: 360,
    scale: 1.5
  }, {
    trigger: heroRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5
  })
}

// 初始化动画
const initAnimations = () => {
  createBackgroundAnimations()
  createTitleAnimations()
  createDescriptionAnimation()
  createSkillsAnimation()
  createCTAAnimations()
  createScrollIndicatorAnimation()
  createScrollTriggers()
}

// 清理动画
const cleanupAnimations = () => {
  killAll()
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

// 组件挂载
onMounted(() => {
  initAnimations()
})

// 组件卸载
onUnmounted(() => {
  cleanupAnimations()
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--gradient-start, #667eea) 0%, var(--gradient-end, #764ba2) 100%);
  transition: background 0.3s ease;
}

.hero-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.background-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  will-change: transform;
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -200px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -150px;
  animation: float 6s ease-in-out infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 10%;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: pulse 3s ease-in-out infinite;
}

.avatar-shape {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
}

@keyframes shimmer {
  0%, 100% {
    background: rgba(255, 255, 255, 0.3);
  }
  50% {
    background: rgba(255, 255, 255, 0.6);
  }
}

.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.main-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  margin: 0;
}

.title-subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  letter-spacing: 0.1em;
}

.title-underline {
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.description-area {
  max-width: 600px;
}

.main-description {
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s ease;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0;
  transform: scale(0.5) rotate(-10deg);
  transition: all 0.3s ease;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  position: relative;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: translateY(30px) scale(0.9);
  opacity: 0;
  min-width: 140px;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button.primary {
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  color: #667eea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cta-button.primary:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.cta-button.secondary {
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cta-button.secondary:hover {
  transform: translateY(-2px) scale(1.05);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.cta-button .button-text {
  position: relative;
  z-index: 1;
}

.cta-button:hover .button-text {
  transform: scale(1.05);
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  transform: translateY(10px);
  transition: all 0.5s ease;
}

.scroll-arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid rgba(255, 255, 255, 0.9);
  animation: bounce 2s infinite;
}

.scroll-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>