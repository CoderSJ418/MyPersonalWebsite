<template>
  <section
    ref="heroRef"
    class="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
  >
    <!-- 动态背景 - 多层渐变光晕 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 主光晕 - 靛蓝紫罗兰 -->
      <div class="blob-shape blob-1" />
      <div class="blob-shape blob-2" />
      <div class="blob-shape blob-3" />
      <div class="blob-shape blob-4" />
    </div>

    <!-- 几何网格背景 -->
    <div class="absolute inset-0 opacity-[0.4]">
      <div class="grid-pattern" />
    </div>

    <!-- 粒子效果 -->
    <div ref="particlesRef" class="absolute inset-0 pointer-events-none">
      <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)" />
    </div>

    <!-- 主内容 -->
    <div class="container mx-auto px-4 py-20 md:py-24 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- 左侧内容 - 占7列 -->
        <div class="lg:col-span-7 max-w-3xl">
          <!-- 徽章标签 -->
          <div ref="badgeRef" class="inline-flex items-center gap-3 mb-6 p-2 pr-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              接受新项目委托
            </span>
          </div>

          <!-- 主标题 -->
          <h1 ref="titleRef" class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1]">
            <span class="block text-slate-900 dark:text-white">
              你好，我是
            </span>
            <span class="block text-gradient">
              佘杰
            </span>
          </h1>

          <!-- 副标题 -->
          <h2 ref="subtitleRef" class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-slate-700 dark:text-slate-300">
            Vue 专家 · 前端架构师 · 7年开发经验
          </h2>

          <!-- 描述 -->
          <p ref="descriptionRef" class="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl">
            专注于构建高性能、可维护的前端应用。擅长 Vue 3、TypeScript、现代前端架构，致力于创造卓越的用户体验和优雅的代码。
          </p>

          <!-- 关键数据统计 -->
          <div ref="statsRef" class="grid grid-cols-3 gap-6 mb-10">
            <div class="stat-card">
              <div class="text-4xl md:text-5xl font-black text-gradient-secondary">
                7+
              </div>
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                年经验
              </div>
            </div>
            <div class="stat-card">
              <div class="text-4xl md:text-5xl font-black text-gradient-accent">
                50+
              </div>
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                项目交付
              </div>
            </div>
            <div class="stat-card">
              <div class="text-4xl md:text-5xl font-black text-gradient">
                10+
              </div>
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                团队规模
              </div>
            </div>
          </div>

          <!-- CTA 按钮组 -->
          <div ref="ctaRef" class="flex flex-col sm:flex-row gap-4">
            <RouterLink
              to="/projects"
              class="btn btn-gradient px-8 py-4 text-base font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span class="mr-2">查看作品</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </RouterLink>
            <RouterLink
              to="/contact"
              class="btn bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400 px-8 py-4 text-base font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              联系我
            </RouterLink>
          </div>

          <!-- 社交链接 -->
          <div ref="socialRef" class="flex items-center gap-4 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-all duration-300 hover:scale-110"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="mailto:contact@example.com"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-all duration-300 hover:scale-110"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- 右侧装饰 - 占5列 -->
        <div ref="decorRef" class="hidden lg:block lg:col-span-5 relative">
          <!-- 3D 卡片堆叠效果 -->
          <div class="relative w-full h-[600px]">
            <!-- 卡片 1 -->
            <div class="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-primary-500/10 to-pink-500/10 dark:from-primary-500/20 dark:to-pink-500/20 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/50 transform rotate-[-6deg] translate-y-8 translate-x-8 card-stack-1" />
            
            <!-- 卡片 2 -->
            <div class="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-pink-500/10 to-amber-500/10 dark:from-pink-500/20 dark:to-amber-500/20 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/50 transform rotate-[-3deg] translate-y-4 translate-x-4 card-stack-2" />
            
            <!-- 主卡片 -->
            <div class="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-primary-500/20 to-pink-500/20 dark:from-primary-500/30 dark:to-pink-500/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-slate-700/50 shadow-2xl card-stack-main overflow-hidden">
              <!-- 卡片内容 -->
              <div class="absolute inset-0 p-8 flex flex-col justify-between">
                <!-- 顶部代码片段 -->
                <div class="bg-white/90 dark:bg-slate-900/90 rounded-xl p-4 shadow-lg">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-3 h-3 rounded-full bg-red-500" />
                    <div class="w-3 h-3 rounded-full bg-yellow-500" />
                    <div class="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre class="text-xs md:text-sm font-mono text-slate-700 dark:text-slate-300 overflow-hidden"><code>const developer = {
  name: "佘杰",
  skills: ["Vue", "TS", "Node"],
  passion: "Building Great UI"
}

developer.createAwesome() {
  return "Let's build!"
}</code></pre>
                </div>
                
                <!-- 中间图标 -->
                <div class="flex justify-center">
                  <div class="relative">
                    <div class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 shadow-2xl animate-float" />
                    <div class="absolute inset-0 flex items-center justify-center">
                      <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- 底部技术栈标签 -->
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 text-xs font-semibold bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full">Vue 3</span>
                  <span class="px-3 py-1 text-xs font-semibold bg-pink-500/20 text-pink-700 dark:text-pink-300 rounded-full">TypeScript</span>
                  <span class="px-3 py-1 text-xs font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">Vite</span>
                  <span class="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full">Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div ref="scrollRef" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-20">
      <span class="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-500">向下滚动</span>
      <div class="w-8 h-12 border-2 border-slate-300 dark:border-slate-700 rounded-full flex justify-center pt-3">
        <div class="w-1.5 h-3 bg-gradient-to-b from-primary-500 to-pink-500 rounded-full animate-bounce" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger)

// 引用元素
const heroRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const socialRef = ref<HTMLElement | null>(null)
const decorRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

// 存储动画实例
let mainTimeline: gsap.core.Timeline | null = null
let scrollAnimation: gsap.core.Tween | null = null

// 动画配置
const animationConfig = {
  duration: 0.8,
  ease: 'power3.out',
}

// 生成粒子样式
const getParticleStyle = (index: number) => {
  const positions = [
    { top: '10%', left: '20%' },
    { top: '30%', left: '80%' },
    { top: '60%', left: '15%' },
    { top: '80%', left: '70%' },
    { top: '20%', left: '50%' },
    { top: '50%', left: '10%' },
    { top: '70%', left: '85%' },
    { top: '40%', left: '45%' },
    { top: '15%', left: '75%' },
    { top: '85%', left: '30%' },
    { top: '55%', left: '95%' },
    { top: '25%', left: '5%' },
    { top: '75%', left: '55%' },
    { top: '35%', left: '60%' },
    { top: '65%', left: '35%' },
  ]
  
  const delays = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8]
  
  const size = Math.random() * 8 + 4
  const position = positions[index % positions.length]
  
  return {
    ...position,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delays[index % delays.length]}s`,
  }
}

onMounted(() => {
  // 创建入场动画时间线
  mainTimeline = gsap.timeline({
    defaults: animationConfig,
  })

  // 徽章淡入
  if (badgeRef.value) {
    mainTimeline.fromTo(
      badgeRef.value,
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, ease: 'back.out(1.7)' },
      0
    )
  }

  // 标题淡入
  if (titleRef.value) {
    mainTimeline.fromTo(
      titleRef.value,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'power3.out' },
      0.1
    )
  }

  // 副标题淡入
  if (subtitleRef.value) {
    mainTimeline.fromTo(
      subtitleRef.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, ease: 'power3.out' },
      0.2
    )
  }

  // 描述淡入
  if (descriptionRef.value) {
    mainTimeline.fromTo(
      descriptionRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: 'power3.out' },
      0.3
    )
  }

  // 统计数据交错淡入
  if (statsRef.value) {
    const statCards = statsRef.value.querySelectorAll('.stat-card')
    mainTimeline.fromTo(
      statCards,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: 'back.out(1.5)' },
      0.4
    )
  }

  // CTA 按钮淡入
  if (ctaRef.value) {
    const buttons = ctaRef.value.querySelectorAll('.btn')
    mainTimeline.fromTo(
      buttons,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: 'back.out(1.5)' },
      0.5
    )
  }

  // 社交链接淡入
  if (socialRef.value) {
    const links = socialRef.value.querySelectorAll('a')
    mainTimeline.fromTo(
      links,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, stagger: 0.1, ease: 'back.out(1.7)' },
      0.6
    )
  }

  // 右侧装饰卡片动画
  if (decorRef.value) {
    const cards = decorRef.value.querySelectorAll('[class*="card-stack"]')
    mainTimeline.fromTo(
      cards,
      { opacity: 0, y: 50, rotateX: -10 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        stagger: 0.15, 
        ease: 'power3.out',
        duration: 1
      },
      0.3
    )
  }

  // 滚动提示淡入
  if (scrollRef.value) {
    mainTimeline.fromTo(
      scrollRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      0.8
    )
  }

  // 视差滚动效果
  if (heroRef.value) {
    scrollAnimation = gsap.to(heroRef.value, {
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -100,
    })
  }
})

onUnmounted(() => {
  if (mainTimeline) {
    mainTimeline.kill()
  }
  if (scrollAnimation) {
    scrollAnimation.kill()
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* Blob 形状动画 */
.blob-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: blob-move 20s infinite ease-in-out;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: rgba(99, 102, 241, 0.3);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: rgba(139, 92, 246, 0.3);
  top: 20%;
  right: -150px;
  animation-delay: -5s;
}

.blob-3 {
  width: 400px;
  height: 400px;
  background: rgba(236, 72, 153, 0.25);
  bottom: 10%;
  left: 30%;
  animation-delay: -10s;
}

.blob-4 {
  width: 350px;
  height: 350px;
  background: rgba(245, 158, 11, 0.2);
  bottom: -100px;
  right: 20%;
  animation-delay: -15s;
}

@keyframes blob-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-30px, 30px) scale(0.95);
  }
  75% {
    transform: translate(40px, 20px) scale(1.05);
  }
}

/* 网格图案 */
.grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

/* 粒子效果 */
.particle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
  animation: particle-float 3s ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

/* 卡片堆叠动画 */
.card-stack-1 {
  transition: all 0.3s ease;
}

.card-stack-2 {
  transition: all 0.3s ease;
}

.card-stack-main {
  transition: all 0.3s ease;
}

/* 悬停效果 */
.card-stack-main:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.4);
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 统计卡片 */
.stat-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  dark:background(rgba(30, 41, 59, 0.8));
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  dark:border(rgba(51, 65, 85, 0.8));
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .blob-1,
  .blob-2,
  .blob-3,
  .blob-4 {
    width: 400px;
    height: 400px;
  }
}

@media (max-width: 768px) {
  .blob-1,
  .blob-2,
  .blob-3,
  .blob-4 {
    width: 300px;
    height: 300px;
    filter: blur(60px);
  }
  
  .grid-pattern {
    background-size: 40px 40px;
  }
}
</style>