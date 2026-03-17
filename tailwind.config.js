/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        /* ============================================
           Aurora Bento 配色系统 v3.0
           ============================================ */
        
        /* Aurora 主色系 - Cyan */
        aurora: {
          cyan: {
            DEFAULT: '#00FFFF',
            50: '#E0FFFF',
            100: '#B2FFFF',
            200: '#80FFFF',
            300: '#4DFFFF',
            400: '#1AFFFF',
            500: '#00FFFF',
            600: '#00CCCC',
            700: '#009999',
            800: '#006666',
            900: '#003333',
          },
          /* Aurora 主色系 - Purple */
          purple: {
            DEFAULT: '#8B00FF',
            50: '#E8D5FF',
            100: '#D1ABFF',
            200: '#B580FF',
            300: '#9A56FF',
            400: '#8B00FF',
            500: '#7700E0',
            600: '#6300C2',
            700: '#4F00A3',
            800: '#3B0085',
            900: '#270066',
          },
          /* Electric Blue */
          electric: {
            DEFAULT: '#0080FF',
            light: '#3399FF',
            dark: '#0066CC',
          },
          /* Magenta */
          magenta: {
            DEFAULT: '#FF1493',
            light: '#FF4DA6',
            dark: '#CC0075',
          },
        },
        
        /* Bento 背景色 - 深色 */
        dark: {
          DEFAULT: '#0D0D0D',
          primary: '#0D0D0D',
          secondary: '#1A1A1A',
          tertiary: '#262626',
          elevated: '#333333',
          card: '#1F1F1F',
        },
        
        /* Bento 背景色 - 亮色 */
        light: {
          DEFAULT: '#FFFFFF',
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
          tertiary: '#EBEBEB',
          elevated: '#FAFAFA',
          card: '#FFFFFF',
        },
        
        /* 语义化颜色 */
        surface: {
          DEFAULT: 'var(--bg-card)',
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          elevated: 'var(--bg-elevated)',
        },
        
        text: {
          DEFAULT: 'var(--text-primary)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
        },
        
        /* 功能色 */
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        
        /* 复古像素风格配色（保留用于特定区域） */
        pixel: {
          cyan: '#00FFFF',
          purple: '#FF00FF',
          dark: '#121212',
          light: '#F8F8F8',
          gray: '#888888',
          'cyan-light': '#66FFFF',
          'cyan-dark': '#008888',
          'purple-light': '#FF66FF',
          'purple-dark': '#880088',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.025em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '0.025em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.025em' }],
      },
      
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
      },
      
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
        'full': '9999px',
        /* Bento 风格圆角 */
        'bento': '16px',
        'bento-sm': '12px',
        'bento-lg': '24px',
        /* 复古像素风格圆角 */
        'pixel': '2px',
        'pixel-sm': '1px',
        'pixel-lg': '4px',
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.15)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.2)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        
        /* Aurora 光晕效果 */
        'aurora-cyan': '0 0 40px rgba(0, 255, 255, 0.4)',
        'aurora-purple': '0 0 40px rgba(139, 0, 255, 0.4)',
        'aurora-electric': '0 0 40px rgba(0, 128, 255, 0.4)',
        'aurora-magenta': '0 0 40px rgba(255, 20, 147, 0.4)',
        
        /* Bento 阴影 */
        'bento': '0 4px 24px rgba(0, 0, 0, 0.1)',
        'bento-hover': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'bento-glow': '0 0 24px rgba(0, 255, 255, 0.15)',
        
        /* 内发光 */
        'inner-glow-cyan': 'inset 0 0 24px rgba(0, 255, 255, 0.1)',
        'inner-glow-purple': 'inset 0 0 24px rgba(139, 0, 255, 0.1)',
        
        /* 复古像素风格阴影 */
        'pixel': '0 2px 0 0 #00FFFF',
        'pixel-lg': '0 4px 0 0 #00FFFF',
        'pixel-xl': '0 6px 0 0 #00FFFF',
      },
      
      backgroundImage: {
        /* Aurora 渐变 */
        'aurora-primary': 'linear-gradient(135deg, #0080FF 0%, #FF1493 100%)',
        'aurora-primary-reverse': 'linear-gradient(135deg, #FF1493 0%, #0080FF 100%)',
        'aurora-cyan-purple': 'linear-gradient(135deg, #00FFFF 0%, #8B00FF 100%)',
        'aurora-purple-cyan': 'linear-gradient(135deg, #8B00FF 0%, #00FFFF 100%)',
        'aurora-flow': 'linear-gradient(135deg, #00FFFF 0%, #0080FF 25%, #8B00FF 50%, #FF1493 75%, #00FFFF 100%)',
        'aurora-bg': 'linear-gradient(180deg, rgba(0, 255, 255, 0.1) 0%, rgba(139, 0, 255, 0.1) 50%, rgba(255, 20, 147, 0.05) 100%)',
        'aurora-border': 'linear-gradient(90deg, #00FFFF, #0080FF, #8B00FF, #FF1493)',
        
        /* 通用渐变 */
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      animation: {
        /* Aurora 动画 */
        'aurora-flow': 'aurora-flow 8s ease infinite',
        'aurora-float': 'aurora-float 6s ease-in-out infinite',
        'aurora-pulse': 'aurora-pulse 4s ease-in-out infinite',
        'aurora-glow': 'aurora-glow 2s ease-in-out infinite',
        
        /* Bento 动画 */
        'bento-hover': 'bento-hover 0.25s ease-out',
        
        /* 基础动画 */
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-down': 'slide-down 0.25s ease-out',
      },
      
      keyframes: {
        'aurora-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'aurora-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'aurora-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'aurora-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 0, 255, 0.4)' },
        },
        'bento-hover': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        'aurora': '8000ms',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'aurora': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      
      zIndex: {
        'base': '0',
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
        'max': '9999',
      },
    },
  },
  plugins: [],
}
