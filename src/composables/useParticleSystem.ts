/**
 * 粒子系统 Composable
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { isMobile, isLowEnd } from '@/utils/deviceDetection'

/**
 * 粒子配置
 */
export interface ParticleConfig {
  count?: number
  connectionDistance?: number
  mouseInteraction?: 'repel' | 'attract' | 'none'
  theme?: 'light' | 'dark'
  speed?: number
}

/**
 * 粒子
 */
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

/**
 * 使用粒子系统
 */
export function useParticleSystem(config: ParticleConfig = {}) {
  const {
    count: defaultCount = 200,
    connectionDistance = 150,
    mouseInteraction = 'none',
    theme = 'dark',
    speed = 1
  } = config

  const canvas = ref<HTMLCanvasElement | null>(null)
  const particles = ref<Particle[]>([])
  const mousePosition = ref({ x: 0, y: 0 })
  const isEnabled = ref(!isMobile())

  let ctx: CanvasRenderingContext2D | null = null
  let animationId: number | null = null
  let resizeObserver: ResizeObserver | null = null

  /**
   * 获取主题颜色
   */
  const getThemeColor = (theme: string): string => {
    return theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
  }

  /**
   * 创建粒子
   */
  const createParticle = (width: number, height: number): Particle => {
    const size = Math.random() * 3 + 1
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size,
      color: getThemeColor(theme),
      alpha: Math.random() * 0.5 + 0.2
    }
  }

  /**
   * 初始化粒子
   */
  const initParticles = () => {
    if (!canvas.value) return

    ctx = canvas.value.getContext('2d')
    if (!ctx) return

    const width = canvas.value.width
    const height = canvas.value.height

    // 根据设备性能调整粒子数量
    let particleCount = defaultCount
    if (isMobile()) {
      particleCount = 50
    } else if (isLowEnd()) {
      particleCount = 100
    }

    particles.value = []
    for (let i = 0; i < particleCount; i++) {
      particles.value.push(createParticle(width, height))
    }
  }

  /**
   * 更新粒子位置
   */
  const updateParticles = () => {
    if (!canvas.value) return

    const width = canvas.value.width
    const height = canvas.value.height

    particles.value.forEach((particle) => {
      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界检测
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1
      }

      // 鼠标交互
      if (mouseInteraction !== 'none') {
        const dx = particle.x - mousePosition.value.x
        const dy = particle.y - mousePosition.value.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150
          const angle = Math.atan2(dy, dx)

          if (mouseInteraction === 'repel') {
            particle.vx += Math.cos(angle) * force * 0.5
            particle.vy += Math.sin(angle) * force * 0.5
          } else if (mouseInteraction === 'attract') {
            particle.vx -= Math.cos(angle) * force * 0.5
            particle.vy -= Math.sin(angle) * force * 0.5
          }
        }
      }

      // 限制速度
      const maxSpeed = speed * 2
      const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
      if (currentSpeed > maxSpeed) {
        particle.vx = (particle.vx / currentSpeed) * maxSpeed
        particle.vy = (particle.vy / currentSpeed) * maxSpeed
      }
    })
  }

  /**
   * 绘制粒子
   */
  const drawParticles = () => {
    if (!ctx || !canvas.value) return

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 绘制连线
    particles.value.forEach((particle, i) => {
      for (let j = i + 1; j < particles.value.length; j++) {
        const other = particles.value[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          const alpha = (1 - distance / connectionDistance) * 0.3
          ctx.strokeStyle = theme === 'dark' ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    })

    // 绘制粒子
    particles.value.forEach((particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.alpha
      ctx.fill()
      ctx.globalAlpha = 1
    })
  }

  /**
   * 动画循环
   */
  const animate = () => {
    updateParticles()
    drawParticles()
    animationId = requestAnimationFrame(animate)
  }

  /**
   * 调整画布大小
   */
  const resizeCanvas = () => {
    if (!canvas.value) return

    const parent = canvas.value.parentElement
    if (!parent) return

    canvas.value.width = parent.clientWidth
    canvas.value.height = parent.clientHeight

    initParticles()
  }

  /**
   * 鼠标移动事件
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvas.value) return

    const rect = canvas.value.getBoundingClientRect()
    mousePosition.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  /**
   * 初始化
   */
  const init = () => {
    if (!canvas.value || !isEnabled.value) return

    resizeCanvas()
    animate()

    // 鼠标事件
    canvas.value.addEventListener('mousemove', handleMouseMove)

    // Resize Observer
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(canvas.value.parentElement!)
  }

  /**
   * 销毁
   */
  const destroy = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    if (canvas.value) {
      canvas.value.removeEventListener('mousemove', handleMouseMove)
    }

    particles.value = []
    ctx = null
  }

  /**
   * 组件挂载
   */
  onMounted(() => {
    init()
  })

  /**
   * 组件卸载
   */
  onUnmounted(() => {
    destroy()
  })

  return {
    canvas,
    particles,
    isEnabled,
    init,
    destroy,
    resizeCanvas
  }
}