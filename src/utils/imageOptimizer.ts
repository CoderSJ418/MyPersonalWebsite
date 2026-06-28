/**
 * 高性能图片优化和懒加载系统
 * 支持 WebP 格式、渐进式加载、虚拟滚动等优化
 */

// 图片优化配置
export interface ImageOptimizationConfig {
  quality?: number;
  formats?: ('webp' | 'jpeg' | 'avif')[];
  sizes?: string[];
  breakpoints?: Record<string, string>;
  lazyLoad?: boolean;
  placeholder?: 'blur' | 'color' | 'none';
  aspectRatio?: string;
}

// 图片优化器类
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private supportedFormats: Set<string>;
  private userAgent: string;

  private constructor() {
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    this.supportedFormats = this.detectSupportedFormats();
  }

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  /**
   * 检测浏览器支持的图片格式
   */
  private detectSupportedFormats(): Set<string> {
    const formats = new Set<string>();
    
    // 检测 WebP 支持
    if (this.isWebPSupported()) {
      formats.add('webp');
    }
    
    // 检测 AVIF 支持
    if (this.isAvifSupported()) {
      formats.add('avif');
    }
    
    // JPEG 总是支持
    formats.add('jpeg');
    
    return formats;
  }

  /**
   * 检测 WebP 支持
   */
  private isWebPSupported(): boolean {
    if (typeof document === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch {
      return false;
    }
  }

  /**
   * 检测 AVIF 支持
   */
  private isAvifSupported(): boolean {
    if (typeof document === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * 获取最优图片格式
   */
  getOptimalFormat(): string {
    // 优先级：AVIF > WebP > JPEG
    if (this.supportedFormats.has('avif')) return 'avif';
    if (this.supportedFormats.has('webp')) return 'webp';
    return 'jpeg';
  }

  /**
   * 生成图片 URL（包含格式和尺寸优化）
   */
  generateImageUrl(
    originalUrl: string,
    config: ImageOptimizationConfig = {}
  ): string {
    const {
      quality = 80,
      _formats = ['webp', 'jpeg'],
      sizes = ['320w', '640w', '1024w', '1920w'],
      lazyLoad = true,
      aspectRatio
    } = config;

    const format = this.getOptimalFormat();
    const optimizedUrl = this.applyOptimizations(originalUrl, format, quality, aspectRatio);
    
    if (lazyLoad) {
      return this.generateSrcSet(optimizedUrl, sizes, format);
    }
    
    return optimizedUrl;
  }

  /**
   * 应用图片优化
   */
  private applyOptimizations(
    url: string,
    format: string,
    quality: number,
    aspectRatio?: string
  ): string {
    let optimizedUrl = url;

    // 添加格式参数
    if (format === 'avif') {
      optimizedUrl += '?format=avif';
    } else if (format === 'webp') {
      optimizedUrl += '?format=webp';
    }

    // 添加质量参数
    optimizedUrl += `&quality=${quality}`;

    // 添加尺寸参数
    if (aspectRatio) {
      optimizedUrl += `&aspectRatio=${aspectRatio}`;
    }

    return optimizedUrl;
  }

  /**
   * 生成 srcset 属性
   */
  private generateSrcSet(
    baseUrl: string,
    sizes: string[],
    format: string
  ): string {
    return sizes
      .map(size => {
        const [width] = size.split('w');
        const optimizedUrl = this.applyOptimizations(baseUrl, format, 80);
        return `${optimizedUrl}&width=${width} ${size}`;
      })
      .join(', ');
  }

  /**
   * 创建图片预加载器
   */
  createPreloader(
    imageUrls: string[],
    callback: (progress: number) => void = () => {}
  ): () => void {
    let loadedCount = 0;
    const totalCount = imageUrls.length;

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          callback((loadedCount / totalCount) * 100);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    const preloadAll = async () => {
      for (const url of imageUrls) {
        try {
          await preloadImage(url);
        } catch (_error) {
          console.warn(`Failed to preload image: ${url}`);
        }
      }
    };

    preloadAll();
    return () => {
      loadedCount = 0;
      callback(0);
    };
  }

  /**
   * 创建虚拟滚动图片组件
   */
  createVirtualScrollImages(
    imageUrls: string[],
    renderItem: (url: string, index: number) => HTMLElement
  ): { container: HTMLElement; cleanup: () => void } {
    const container = document.createElement('div');
    container.className = 'virtual-scroll-container';
    
    const bufferSize = 5; // 缓冲区大小
    const visibleRange = { start: 0, end: 10 };

    const renderVisibleItems = () => {
      container.innerHTML = '';
      
      for (let i = visibleRange.start; i <= visibleRange.end; i++) {
        if (imageUrls[i]) {
          const item = renderItem(imageUrls[i], i);
          container.appendChild(item);
        }
      }
    };

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = 200; // 假设每个项目高度为 200px
      
      visibleRange.start = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
      visibleRange.end = Math.min(
        imageUrls.length - 1,
        Math.floor((scrollTop + container.clientHeight) / itemHeight) + bufferSize
      );

      renderVisibleItems();
    };

    container.addEventListener('scroll', handleScroll);
    renderVisibleItems();

    // 返回容器和清理函数
    return {
      container,
      cleanup: () => {
        container.removeEventListener('scroll', handleScroll);
        container.innerHTML = '';
      }
    };
  }

  /**
   * 生成图片占位符
   */
  generatePlaceholder(
    width: number,
    height: number,
    format: 'blur' | 'color' | 'none' = 'blur'
  ): string {
    if (format === 'none') return '';
    
    if (format === 'color') {
      const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='${randomColor}' width='${width}' height='${height}'/%3E%3C/svg%3E`;
    }

    // 生成模糊占位符
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3Crect width='${width}' height='${height}' filter='url(%23blur)' fill='%23667eea'/%3E%3C/svg%3E`;
  }
}

// 全局图片优化器实例
export const imageOptimizer = ImageOptimizer.getInstance();

// Vue 组合式函数：图片懒加载
export function useImageOptimization() {
  const optimizedUrl = ref('');
  const isLoaded = ref(false);
  const isLoading = ref(false);

  const loadOptimizedImage = async (
    originalUrl: string,
    config: ImageOptimizationConfig = {}
  ) => {
    isLoading.value = true;
    try {
      optimizedUrl.value = imageOptimizer.generateImageUrl(originalUrl, config);
      // 这里可以添加图片加载完成后的回调
    } finally {
      isLoading.value = false;
      isLoaded.value = true;
    }
  };

  return {
    optimizedUrl,
    isLoaded,
    isLoading,
    loadOptimizedImage
  };
}

// 导出类型
export type { ImageOptimizationConfig };