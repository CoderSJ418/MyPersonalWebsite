/**
 * 图片优化工具
 * 用于图片懒加载、响应式图片和图片优化
 */

/**
 * 图片懒加载指令
 */
export const lazyLoadDirective = {
  mounted(el: HTMLImageElement, binding: any) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement

            // 设置真实图片地址
            if (binding.value) {
              img.src = binding.value
            } else if (img.dataset.src) {
              img.src = img.dataset.src
            }

            // 图片加载完成后移除观察
            img.onload = () => {
              img.classList.add('loaded')
            }

            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px 0px', // 提前 50px 开始加载
        threshold: 0.01
      }
    )

    observer.observe(el)
  }
}

/**
 * 生成响应式图片 srcset
 */
export const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536]
): string => {
  return sizes
    .map((size) => {
      const url = baseUrl.replace(/\.(jpg|jpeg|png|webp)$/i, `-${size}w.$1`)
      return `${url} ${size}w`
    })
    .join(', ')
}

/**
 * 生成响应式图片 sizes 属性
 */
export const generateSizes = (
  breakpoints: { width: number; size: string }[] = [
    { width: 640, size: '100vw' },
    { width: 768, size: '90vw' },
    { width: 1024, size: '800px' },
    { width: 1280, size: '1000px' }
  ]
): string => {
  return breakpoints
    .map((bp) => `(max-width: ${bp.width}px) ${bp.size}`)
    .join(', ')
}

/**
 * 检查 WebP 支持
 */
export const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
  })
}

/**
 * 获取最佳图片格式
 */
export const getOptimalImageFormat = async (originalFormat: string): Promise<string> => {
  const supportsWebP = await checkWebPSupport()

  if (supportsWebP && ['jpg', 'jpeg', 'png'].includes(originalFormat.toLowerCase())) {
    return 'webp'
  }

  return originalFormat
}

/**
 * 生成图片占位符（模糊效果）
 */
export const generatePlaceholder = (
  width: number,
  height: number,
  color = '#e5e7eb'
): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)

    // 添加一些噪点
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`
      ctx.fillRect(x, y, 1, 1)
    }
  }

  return canvas.toDataURL('image/jpeg', 0.1)
}

/**
 * 预加载图片
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

/**
 * 批量预加载图片
 */
export const preloadImages = (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map((src) => preloadImage(src)))
}

/**
 * 获取图片尺寸
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = reject
  })
}

/**
 * 计算图片的宽高比
 */
export const getAspectRatio = (src: string): Promise<number> => {
  return getImageDimensions(src).then(({ width, height }) => width / height)
}

/**
 * 压缩图片（使用 Canvas）
 */
export const compressImage = (
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    format?: 'image/jpeg' | 'image/png' | 'image/webp'
  } = {}
): Promise<Blob> => {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, format = 'image/jpeg' } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // 计算新的尺寸
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          format,
          quality
        )
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }

    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 生成图片的渐进式加载 URL
 */
export const generateProgressiveURL = (
  baseUrl: string,
  quality: number
): string => {
  // 这里可以根据实际的图片服务进行调整
  // 例如：使用 Cloudinary、Imgix 等服务
  return baseUrl
}

/**
 * 检测图片是否在视口中
 */
export const isImageInViewport = (el: HTMLImageElement): boolean => {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}