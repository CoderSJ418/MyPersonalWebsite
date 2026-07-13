/**
 * Shader-to-Component Shared Palette
 *
 * 设计原则：
 * - shader 用什么色，组件就用什么色
 * - 所有颜色定义在一个地方，保证全局视觉统一
 * - shader 输出的每一帧颜色都来自这个 palette
 * - 组件从 palette 取色，绝不硬编码
 *
 * 调色方案：Stripe-inspired
 * - 基底：白色（左侧白底）
 * - 丝带：紫 → 粉 → 橙 → 蓝 → 青
 * - accent：#6366F1（indigo-500，与项目现有 accent 统一）
 */

// ═══════════════════════════════════════════
// Shader Ribbon Palette（丝带渐变用色）
// ═══════════════════════════════════════════

export const ribbonColors = {
  /**
   * 丝带主色板 — 从暖到冷的 5 色渐变
   * 对应 shader 中 3 个 wave layer 的颜色分配
   *
   * Layer 0（低频大丝带）：紫色系
   * Layer 1（中频中丝带）：粉/橙系
   * Layer 2（高频细丝带）：蓝/青系
   */
  purple:  { rgb: [0.48, 0.30, 0.93], hex: '#7B4EED' },   // #7B4EED
  magenta: { rgb: [0.94, 0.22, 0.50], hex: '#F03880' },   // #F03880
  orange:  { rgb: [1.00, 0.38, 0.01], hex: '#FF6102' },   // #FF6102
  blue:    { rgb: [0.00, 0.32, 1.00], hex: '#0052FF' },   // #0052FF
  cyan:    { rgb: [0.00, 0.72, 0.78], hex: '#00B8C8' },   // #00B8C8
} as const

/**
 * 丝带噪声层的 wave 配置
 * 每个 layer 有独立的：颜色、噪声频率、流动速度、种子、ribbon 宽窄
 */
export const ribbonLayers = [
  {
    // Layer 0 — 最宽的丝带，紫色系
    color: ribbonColors.purple.rgb,
    hex: ribbonColors.purple.hex,
    noiseFreq: [3.0, 4.0],      // 噪声频率 X/Y
    noiseCeil: 0.50,             // ribbon 上边界
    noiseFloor: 0.42,            // ribbon 下边界
    noiseSpeed: 6.0,             // 时间速度
    noiseFlow: 4.0,              // 流动偏移
    noiseSeed: 7,                // 随机种子
  },
  {
    // Layer 1 — 中等丝带，粉/橙系
    color: ribbonColors.magenta.rgb,
    hex: ribbonColors.magenta.hex,
    noiseFreq: [4.0, 5.0],
    noiseCeil: 0.60,
    noiseFloor: 0.52,
    noiseSpeed: 6.5,
    noiseFlow: 4.5,
    noiseSeed: 17,
  },
  {
    // Layer 2 — 最细的丝带，蓝/青系
    color: ribbonColors.blue.rgb,
    hex: ribbonColors.blue.hex,
    noiseFreq: [5.0, 6.0],
    noiseCeil: 0.70,
    noiseFloor: 0.62,
    noiseSpeed: 7.0,
    noiseFlow: 5.0,
    noiseSeed: 27,
  },
] as const

/**
 * 噪声坐标缩放 — 从 UV 到噪声空间的映射
 * whatamesh 使用极小的值（14e-5, 29e-5）因为它在顶点着色器运行
 * fragment shader 需要更大的值才能在 per-pixel 分辨率下看到变化
 */
export const noiseScale = {
  x: 0.00014,   // 14e-5
  y: 0.00029,   // 29e-5
} as const

/**
 * 丝带锐化参数
 * pow(smoothstep(floor, ceil, noise), 4) → 4 次方让边缘变锐利
 */
export const ribbonSharpness = 4.0

// ═══════════════════════════════════════════
// Component UI Palette（从 shader 取色）
// ═══════════════════════════════════════════

export const uiPalette = {
  /**
   * 主 accent 色 — 使用紫色（与 shader Layer 0 统一）
   */
  accent: {
    primary: '#7B4EED',          // 紫色（ribbon primary）
    secondary: '#F03880',        // 粉红（ribbon layer 1）
    tertiary: '#0052FF',         // 蓝色（ribbon layer 2）
    gradient: 'linear-gradient(135deg, #7B4EED 0%, #F03880 50%, #0052FF 100%)',
    gradientHorizontal: 'linear-gradient(90deg, #7B4EED 0%, #F03880 50%, #0052FF 100%)',
  },

  /**
   * 玻璃拟态（Glass Morphism）
   * 与 shader 丝带背景搭配的组件材质
   */
  glass: {
    bg: 'rgba(255, 255, 255, 0.06)',
    bgLight: 'rgba(255, 255, 255, 0.10)',
    bgHover: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.12)',
    borderHover: 'rgba(255, 255, 255, 0.20)',
    borderAccent: 'rgba(123, 78, 237, 0.30)',
    borderAccentHover: 'rgba(123, 78, 237, 0.50)',
    blur: 'blur(16px)',
    blurSm: 'blur(8px)',
  },

  /**
   * 渐变边框
   */
  gradientBorder: {
    purple: 'linear-gradient(135deg, #7B4EED, #9B6AFF)',
    pink: 'linear-gradient(135deg, #F03880, #FF6B9D)',
    blue: 'linear-gradient(135deg, #0052FF, #3D7AFF)',
    full: 'linear-gradient(135deg, #7B4EED 0%, #F03880 50%, #0052FF 100%)',
  },

  /**
   * 发光效果
   */
  glow: {
    purple: '0 0 20px rgba(123, 78, 237, 0.2)',
    pink: '0 0 20px rgba(240, 56, 128, 0.2)',
    blue: '0 0 20px rgba(0, 82, 255, 0.2)',
  },
} as const

// ═══════════════════════════════════════════
// Typography Style Tokens
// ═══════════════════════════════════════════

export const shaderTypography = {
  heroName: {
    fontSize: 'clamp(64px, 8vw, 96px)',
    fontWeight: 700,
    lineHeight: '1.0',
    letterSpacing: '-0.04em',
    color: '#1a1a2e',           // 深蓝黑，在 shader 丝带上保持可读
  },
  subtitle: {
    fontSize: 'clamp(18px, 2.2vw, 22px)',
    fontWeight: 500,
    letterSpacing: '0.04em',
    color: '#4B5563',           // 在 shader 背景上可读
  },
  positioning: {
    fontSize: 'clamp(15px, 1.6vw, 17px)',
    fontWeight: 400,
    lineHeight: '1.625',
    color: '#6B7280',
  },
} as const
