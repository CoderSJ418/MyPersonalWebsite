# 🎨 MyPersonalWebsite 炫技方案设计

**设计日期**: 2026年1月19日
**设计团队**: BMad智能体团队 + Frontend Design Claude2
**技术栈**: Vue 3 + Three.js + GSAP + Canvas/WebGL
**炫技指数**: ⭐⭐⭐⭐⭐

---

## 🎯 炫技目标

1. **展示技术深度**: 证明前端技术能力
2. **提升视觉冲击**: 吸引面试官注意力
3. **增强用户体验**: 提供流畅交互
4. **体现工程化**: 展示架构能力
5. **创造记忆点**: 让人印象深刻

---

## 🌟 炫技功能总览

| 功能 | 技术栈 | 难度 | 炫技指数 | 预估工时 |
|------|--------|------|---------|---------|
| 3D项目卡片 | Three.js | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 4h |
| 粒子动画背景 | Canvas/WebGL | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 4h |
| GSAP页面动画 | GSAP | ⭐⭐⭐ | ⭐⭐⭐⭐ | 3h |
| 技能雷达图 | Chart.js | ⭐⭐ | ⭐⭐⭐ | 3h |
| 项目时间线 | CSS3 + JS | ⭐⭐ | ⭐⭐⭐ | 2h |
| WebGL着色器 | WebGL | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 4h |
| 代码贡献热力图 | Canvas + D3 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 3h |
| 实时打字效果 | JS + CSS | ⭐⭐ | ⭐⭐⭐ | 2h |
| 音频可视化 | Web Audio API | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 3h |
| VR/AR体验 | WebXR | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 5h |

---

## 🎬 1. 3D项目卡片 (Three.js)

### 功能描述
使用Three.js创建3D项目卡片，支持鼠标交互和3D翻转效果，展示项目信息。

### 技术方案

#### 技术栈
- **Three.js**: 3D渲染引擎
- **Vue 3**: 组件框架
- **TypeScript**: 类型安全

#### 实现步骤

1. **安装依赖**
```bash
npm install three @types/three
```

2. **创建3D卡片组件**
```typescript
// src/components/projects/ProjectCard3D.vue
<template>
  <div ref="containerRef" class="project-card-3d-container">
    <canvas ref="canvasRef"></canvas>
    <div class="project-info" v-if="project">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
      <div class="tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import type { Project } from '@/types/project'

const props = defineProps<{ project: Project }>()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let card: THREE.Mesh
let animationId: number

const initThreeJS = () => {
  if (!containerRef.value || !canvasRef.value) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Card Geometry
  const geometry = new THREE.BoxGeometry(3, 4, 0.1)
  const material = new THREE.MeshPhongMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  })
  card = new THREE.Mesh(geometry, material)
  scene.add(card)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Mouse interaction
  let mouseX = 0
  let mouseY = 0

  containerRef.value.addEventListener('mousemove', (e) => {
    const rect = containerRef.value!.getBoundingClientRect()
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
  })

  // Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Smooth rotation
    card.rotation.x += (mouseY * 0.5 - card.rotation.x) * 0.1
    card.rotation.y += (mouseX * 0.5 - card.rotation.y) * 0.1

    renderer.render(scene, camera)
  }

  animate()
}

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (!containerRef.value || !camera || !renderer) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.project-card-3d-container {
  position: relative;
  width: 100%;
  height: 400px;
  perspective: 1000px;
}

.project-card-3d-container canvas {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.project-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  padding: 4px 12px;
  background: #3b82f6;
  color: white;
  border-radius: 16px;
  font-size: 12px;
}
</style>
```

3. **使用组件**
```vue
<!-- src/views/Projects.vue -->
<template>
  <div class="projects-grid">
    <ProjectCard3D
      v-for="project in projects"
      :key="project.id"
      :project="project"
    />
  </div>
</template>
```

### 效果展示
- 🎥 3D卡片翻转动画
- 🖱️ 鼠标跟随效果
- 💫 平滑过渡动画
- ✨ 玻璃拟态信息面板

### 性能优化
- 使用requestAnimationFrame优化动画
- 按需渲染，避免不必要的重绘
- 使用WebGL硬件加速

### 炫技点
- Three.js 3D渲染
- 交互式3D场景
- 鼠标跟随算法
- 玻璃拟态设计

---

## ✨ 2. 粒子动画背景 (Canvas/WebGL)

### 功能描述
在Hero区域创建动态粒子背景，粒子之间有连线效果，支持鼠标交互。

### 技术方案

#### 技术栈
- **Canvas API**: 2D绘图
- **WebGL**: 3D加速（可选）
- **TypeScript**: 类型安全

#### 实现步骤

1. **创建粒子系统**
```typescript
// src/composables/useParticleSystem.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

export function useParticleSystem(canvasRef: any) {
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const particles = ref<Particle[]>([])
  let animationId: number | null = null
  let mouse = { x: 0, y: 0 }

  const createParticles = (count: number, canvas: HTMLCanvasElement) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`
      })
    }
    particles.value = newParticles
  }

  const drawParticles = (canvas: HTMLCanvasElement) => {
    if (!ctx.value) return

    ctx.value.clearRect(0, 0, canvas.width, canvas.height)

    // Draw particles
    particles.value.forEach(particle => {
      ctx.value!.beginPath()
      ctx.value!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.value!.fillStyle = particle.color
      ctx.value!.fill()
    })

    // Draw connections
    particles.value.forEach((p1, i) => {
      particles.value.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          ctx.value!.beginPath()
          ctx.value!.moveTo(p1.x, p1.y)
          ctx.value!.lineTo(p2.x, p2.y)
          ctx.value!.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 120})`
          ctx.value!.stroke()
        }
      })

      // Mouse interaction
      const dx = p1.x - mouse.x
      const dy = p1.y - mouse.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        ctx.value!.beginPath()
        ctx.value!.moveTo(p1.x, p1.y)
        ctx.value!.lineTo(mouse.x, mouse.y)
        ctx.value!.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 150})`
        ctx.value!.stroke()

        // Attract to mouse
        p1.vx += dx * 0.0001
        p1.vy += dy * 0.0001
      }
    })
  }

  const updateParticles = (canvas: HTMLCanvasElement) => {
    particles.value.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off walls
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      // Slow down mouse attraction
      particle.vx *= 0.999
      particle.vy *= 0.999
    })
  }

  const animate = () => {
    if (!canvasRef.value) return

    const canvas = canvasRef.value
    updateParticles(canvas)
    drawParticles(canvas)

    animationId = requestAnimationFrame(animate)
  }

  const init = () => {
    if (!canvasRef.value) return

    const canvas = canvasRef.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.value = canvas.getContext('2d')

    createParticles(80, canvas)

    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    animate()
  }

  onMounted(() => {
    init()
    window.addEventListener('resize', init)
  })

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', init)
  })

  return { particles }
}
```

2. **创建粒子背景组件**
```vue
<!-- src/components/common/ParticleBackground.vue -->
<template>
  <canvas
    ref="canvasRef"
    class="particle-canvas"
    :class="{ 'dark': isDark }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useParticleSystem } from '@/composables/useParticleSystem'

const canvasRef = ref<HTMLCanvasElement>()
const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')

useParticleSystem(canvasRef)
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.particle-canvas.dark {
  opacity: 0.5;
}
</style>
```

3. **在Hero区域使用**
```vue
<!-- src/components/home/HeroSection.vue -->
<template>
  <section class="hero-section">
    <ParticleBackground />
    <div class="hero-content">
      <!-- Hero content -->
    </div>
  </section>
</template>
```

### 效果展示
- 🎆 动态粒子背景
- 🔗 粒子连线效果
- 🖱️ 鼠标交互吸引
- 🌙 暗黑模式适配

### 性能优化
- 使用Canvas 2D API
- 限制粒子数量
- 使用requestAnimationFrame
- 距离计算优化

### 炫技点
- Canvas 2D绘图
- 粒子系统算法
- 鼠标交互物理
- 连线距离计算

---

## 🎭 3. GSAP页面动画

### 功能描述
使用GSAP实现流畅的页面进入动画和滚动触发动画。

### 技术方案

#### 技术栈
- **GSAP**: 动画库
- **ScrollTrigger**: 滚动触发器
- **Vue 3**: 组件框架

#### 实现步骤

1. **安装依赖**
```bash
npm install gsap
```

2. **创建动画组合式函数**
```typescript
// src/composables/useGSAP.ts
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePageAnimation() {
  let ctx: gsap.Context

  onMounted(() => {
    ctx = gsap.context(() => {
      // Hero section animation
      const heroTimeline = gsap.timeline()

      heroTimeline
        .from('.hero-title', {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out'
        })
        .from(
          '.hero-subtitle',
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
          },
          '-=0.5'
        )
        .from(
          '.hero-description',
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
          },
          '-=0.5'
        )
        .from(
          '.hero-buttons',
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
          },
          '-=0.5'
        )

      // Scroll animations
      gsap.utils.toArray('.animate-on-scroll').forEach((element) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            markers: false
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out'
        })
      })

      // Stagger animations
      gsap.from('.stagger-item', {
        scrollTrigger: {
          trigger: '.stagger-container',
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      })

      // Parallax effect
      gsap.to('.parallax-bg', {
        scrollTrigger: {
          trigger: '.parallax-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: 100,
        ease: 'none'
      })
    })
  })

  onUnmounted(() => {
    ctx.revert()
  })
}

export function useTextReveal() {
  const revealText = (element: HTMLElement) => {
    const text = element.textContent || ''
    const letters = text.split('')

    element.innerHTML = letters
      .map((letter, i) => `<span class="letter" style="display: inline-block">${letter}</span>`)
      .join('')

    gsap.fromTo(
      '.letter',
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.out'
      }
    )
  }

  return { revealText }
}

export function useMagneticButton() {
  const initMagneticButton = (button: HTMLElement) => {
    const strength = 30

    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(button, {
        x: x * (strength / rect.width),
        y: y * (strength / rect.height),
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    })
  }

  return { initMagneticButton }
}
```

3. **在组件中使用**
```vue
<!-- src/components/home/HeroSection.vue -->
<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title animate-on-scroll">
        你好，我是<span class="text-primary">佘杰</span>
      </h1>
      <p class="hero-subtitle animate-on-scroll">
        前端开发工程师 | Vue专家
      </p>
      <p class="hero-description animate-on-scroll">
        7年前端开发经验，专注于构建高性能、可维护的前端应用
      </p>
      <div class="hero-buttons animate-on-scroll">
        <button ref="ctaButtonRef" class="cta-button magnetic-button">
          查看项目
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePageAnimation, useMagneticButton } from '@/composables/useGSAP'

const ctaButtonRef = ref<HTMLButtonElement>()

usePageAnimation()

onMounted(() => {
  const { initMagneticButton } = useMagneticButton()
  if (ctaButtonRef.value) {
    initMagneticButton(ctaButtonRef.value)
  }
})
</script>
```

### 效果展示
- 🎬 流畅的页面进入动画
- 📜 滚动触发动画
- 🎯 交错动画效果
- 🧲 磁性按钮效果
- 📐 视差滚动效果

### 性能优化
- 使用GSAP Context管理
- ScrollTrigger优化
- 合理使用will-change
- 避免过度动画

### 炫技点
- GSAP动画库
- ScrollTrigger滚动触发
- 复杂时间轴动画
- 磁性交互效果
- 视差滚动实现

---

## 📊 4. 技能雷达图 (Chart.js)

### 功能描述
使用Chart.js创建技能雷达图，可视化展示技能熟练度。

### 技术方案

#### 技术栈
- **Chart.js**: 图表库
- **Vue 3**: 组件框架
- **TypeScript**: 类型安全

#### 实现步骤

1. **安装依赖**
```bash
npm install chart.js
```

2. **创建雷达图组件**
```vue
<!-- src/components/skills/SkillRadar.vue -->
<template>
  <div class="skill-radar-container">
    <canvas ref="canvasRef"></canvas>
    <div class="skill-legend">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="skill-legend-item"
        @mouseenter="highlightSkill(skill.id)"
        @mouseleave="resetHighlight"
      >
        <div class="skill-color" :style="{ backgroundColor: skill.color }"></div>
        <span class="skill-name">{{ skill.name }}</span>
        <span class="skill-level">{{ skill.level }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, type ChartData, type ChartOptions } from 'chart.js/auto'
import { useSkillStore } from '@/stores/useSkillStore'

const canvasRef = ref<HTMLCanvasElement>()
const skillStore = useSkillStore()
let chart: Chart | null = null

const skills = skillStore.skills.map((skill, index) => ({
  ...skill,
  color: `hsl(${index * 60}, 70%, 50%)`
}))

const initChart = () => {
  if (!canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const data: ChartData = {
    labels: skills.map(s => s.name),
    datasets: [{
      label: '技能熟练度',
      data: skills.map(s => s.level),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      pointBackgroundColor: skills.map(s => s.color),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: skills.map(s => s.color),
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  }

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: (context) => {
            return `熟练度: ${context.parsed.r}%`
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  }

  chart = new Chart(ctx, {
    type: 'radar',
    data,
    options
  })
}

const highlightSkill = (skillId: string) => {
  if (!chart) return

  const skillIndex = skills.findIndex(s => s.id === skillId)
  if (skillIndex === -1) return

  chart.data.datasets[0].pointBackgroundColor = skills.map((s, i) =>
    i === skillIndex ? s.color : 'rgba(0, 0, 0, 0.1)'
  )
  chart.data.datasets[0].pointRadius = skills.map((s, i) =>
    i === skillIndex ? 10 : 4
  )
  chart.update('none')
}

const resetHighlight = () => {
  if (!chart) return

  chart.data.datasets[0].pointBackgroundColor = skills.map(s => s.color)
  chart.data.datasets[0].pointRadius = 6
  chart.update('none')
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.skill-radar-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.skill-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.skill-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-legend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.skill-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.skill-name {
  font-size: 14px;
  font-weight: 500;
}

.skill-level {
  font-size: 12px;
  color: #666;
}
</style>
```

### 效果展示
- 📊 技能雷达图
- 🎨 彩色数据点
- 🖱️ 交互式高亮
- 📝 自定义图例
- ✨ 平滑动画

### 性能优化
- 使用Chart.js优化
- 合理配置动画
- 避免频繁更新

### 炫技点
- Chart.js数据可视化
- 自定义图表配置
- 交互式数据展示
- 动态高亮效果

---

## 🎨 5. WebGL着色器效果

### 功能描述
使用WebGL着色器创建独特的视觉效果，展示图形编程能力。

### 技术方案

#### 技术栈
- **WebGL**: 图形API
- **GLSL**: 着色器语言
- **Vue 3**: 组件框架

#### 实现步骤

1. **创建着色器组件**
```vue
<!-- src/components/common/WebGLShader.vue -->
<template>
  <canvas ref="canvasRef" class="webgl-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let animationId: number | null = null

// Vertex Shader
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// Fragment Shader - 彩色波浪效果
const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Create wave effect
    float wave = sin(uv.x * 10.0 + u_time) * cos(uv.y * 10.0 + u_time * 0.5);

    // Create gradient
    vec3 color1 = vec3(0.23, 0.51, 0.96); // Blue
    vec3 color2 = vec3(0.94, 0.23, 0.23); // Red
    vec3 color3 = vec3(0.23, 0.96, 0.51); // Green

    vec3 color = mix(color1, color2, uv.x + wave * 0.2);
    color = mix(color, color3, uv.y + wave * 0.2);

    gl_FragColor = vec4(color, 1.0);
  }
`

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

const initWebGL = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  gl = canvas.getContext('webgl')
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  // Create shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  if (!vertexShader || !fragmentShader) return

  // Create program
  program = createProgram(gl, vertexShader, fragmentShader)
  if (!program) return

  // Create buffer
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Get attribute and uniform locations
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  const timeLocation = gl.getUniformLocation(program, 'u_time')

  // Animation loop
  let startTime = Date.now()

  const animate = () => {
    if (!gl || !program) return

    const currentTime = (Date.now() - startTime) / 1000

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    // Set attributes
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Set uniforms
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
    gl.uniform1f(timeLocation, currentTime)

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  initWebGL()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (!canvasRef.value || !gl) return

  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.webgl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
```

### 效果展示
- 🌈 彩色波浪效果
- ⏱️ 实时动态变化
- 🎨 GPU加速渲染
- 🎯 独特视觉风格

### 性能优化
- 使用GPU加速
- 优化着色器代码
- 避免过度计算

### 炫技点
- WebGL图形编程
- GLSL着色器语言
- GPU加速渲染
- 数学函数应用

---

## 📈 6. 代码贡献热力图

### 功能描述
创建类似GitHub的贡献热力图，展示代码提交活跃度。

### 技术方案

#### 技术栈
- **Canvas**: 2D绘图
- **Vue 3**: 组件框架
- **TypeScript**: 类型安全

#### 实现步骤

1. **创建热力图组件**
```vue
<!-- src/components/common/ContributionHeatmap.vue -->
<template>
  <div class="contribution-heatmap">
    <div class="heatmap-header">
      <h3>代码贡献</h3>
      <div class="heatmap-legend">
        <span class="legend-label">Less</span>
        <div class="legend-colors">
          <div v-for="level in 5" :key="level" class="legend-color" :class="`level-${level}`"></div>
        </div>
        <span class="legend-label">More</span>
      </div>
    </div>
    <div class="heatmap-grid">
      <div
        v-for="(day, index) in contributions"
        :key="index"
        class="heatmap-cell"
        :class="`level-${day.level}`"
        :title="`${day.date}: ${day.count} contributions`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Contribution {
  date: string
  count: number
  level: number
}

const contributions = ref<Contribution[]>([])

const generateContributions = () => {
  const days: Contribution[] = []
  const today = new Date()
  const oneYearAgo = new Date(today)
  oneYearAgo.setDate(oneYearAgo.getDate() - 365)

  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const count = Math.floor(Math.random() * 15)

    let level = 0
    if (count > 0) level = 1
    if (count > 3) level = 2
    if (count > 6) level = 3
    if (count > 9) level = 4

    days.push({
      date: dateStr,
      count,
      level
    })
  }

  contributions.value = days
}

onMounted(() => {
  generateContributions()
})
</script>

<style scoped>
.contribution-heatmap {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.heatmap-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.legend-label {
  font-size: 12px;
}

.legend-colors {
  display: flex;
  gap: 2px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  gap: 2px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #ebedf0;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.5);
  z-index: 1;
}

.heatmap-cell.level-1 {
  background: #9be9a8;
}

.heatmap-cell.level-2 {
  background: #40c463;
}

.heatmap-cell.level-3 {
  background: #30a14e;
}

.heatmap-cell.level-4 {
  background: #216e39;
}
</style>
```

### 效果展示
- 📊 GitHub风格热力图
- 🎨 颜色等级区分
- 🖱️ 悬浮显示详情
- 📱 响应式布局

### 性能优化
- 使用CSS Grid
- 优化DOM数量
- 添加过渡动画

### 炫技点
- 数据可视化
- 响应式布局
- 交互式设计
- 颜色映射算法

---

## 🎯 炫技功能集成方案

### 集成策略

1. **渐进式集成**
   - 先实现基础炫技功能
   - 逐步添加高级效果
   - 持续优化性能

2. **按需加载**
   - 炫技功能懒加载
   - 减少首屏加载时间
   - 优化用户体验

3. **性能监控**
   - 监控FPS
   - 检测性能瓶颈
   - 及时优化

### 集成顺序

```
Week 1: 基础炫技
├── GSAP页面动画
├── 粒子动画背景
└── 技能雷达图

Week 2: 中级炫技
├── 3D项目卡片
├── 项目时间线
└── 代码贡献热力图

Week 3: 高级炫技
├── WebGL着色器
├── 音频可视化
└── VR/AR体验
```

---

## 📊 炫技效果对比

| 功能 | 视觉冲击 | 技术难度 | 实用价值 | 推荐指数 |
|------|---------|---------|---------|---------|
| 3D项目卡片 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 粒子动画背景 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| GSAP页面动画 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 技能雷达图 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| WebGL着色器 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| 代码贡献热力图 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🎓 学习价值

### 技术能力展示
- ✅ Three.js 3D开发
- ✅ WebGL图形编程
- ✅ Canvas 2D绘图
- ✅ GSAP动画库
- ✅ Chart.js数据可视化
- ✅ Web Audio API
- ✅ WebXR API

### 工程能力展示
- ✅ 性能优化
- ✅ 代码组织
- ✅ 组件化设计
- ✅ 类型安全
- ✅ 响应式设计

### 创意能力展示
- ✅ 视觉设计
- ✅ 交互设计
- ✅ 用户体验
- ✅ 创新思维

---

**文档版本**: v1.0
**最后更新**: 2026年1月19日
**设计团队**: BMad智能体团队 + Frontend Design Claude2

**下一步行动**: 开始实施炫技功能，从GSAP页面动画开始。