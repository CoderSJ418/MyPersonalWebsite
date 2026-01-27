import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'

// 导入所有像素组件
import {
  PixelButton,
  PixelCard,
  PixelCodeBlock,
  PixelNavbar,
  PixelInput,
  PixelTag,
  PixelTabs,
  PixelLayout,
  PixelGrid,
  PixelSpacing,
  PixelHeading,
  PixelList,
  PixelDivider,
  PixelIcon,
  PixelBadge
} from '@/components/pixel'

describe('像素风格组件库', () => {
  let app: any

  beforeEach(() => {
    app = createApp({})
    // 注册所有组件
    app.component('PixelButton', PixelButton)
    app.component('PixelCard', PixelCard)
    app.component('PixelCodeBlock', PixelCodeBlock)
    app.component('PixelNavbar', PixelNavbar)
    app.component('PixelInput', PixelInput)
    app.component('PixelTag', PixelTag)
    app.component('PixelTabs', PixelTabs)
    app.component('PixelLayout', PixelLayout)
    app.component('PixelGrid', PixelGrid)
    app.component('PixelSpacing', PixelSpacing)
    app.component('PixelHeading', PixelHeading)
    app.component('PixelList', PixelList)
    app.component('PixelDivider', PixelDivider)
    app.component('PixelIcon', PixelIcon)
    app.component('PixelBadge', PixelBadge)
  })

  describe('PixelButton', () => {
    it('应该渲染默认按钮', () => {
      const wrapper = mount(PixelButton, {
        slots: {
          default: '按钮文本'
        }
      })
      expect(wrapper.text()).toBe('按钮文本')
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelButton, {
        props: {
          variant: 'primary'
        },
        slots: {
          default: '主要按钮'
        }
      })
      expect(wrapper.classes()).toContain('pixel-button--primary')
    })

    it('应该支持不同的大小', () => {
      const wrapper = mount(PixelButton, {
        props: {
          size: 'large'
        },
        slots: {
          default: '大按钮'
        }
      })
      expect(wrapper.classes()).toContain('pixel-button--large')
    })

    it('应该支持加载状态', () => {
      const wrapper = mount(PixelButton, {
        props: {
          loading: true
        },
        slots: {
          default: '加载中'
        }
      })
      expect(wrapper.classes()).toContain('pixel-button--loading')
    })

    it('应该支持禁用状态', () => {
      const wrapper = mount(PixelButton, {
        props: {
          disabled: true
        },
        slots: {
          default: '禁用按钮'
        }
      })
      expect(wrapper.classes()).toContain('pixel-button--disabled')
    })

    it('应该触发点击事件', async () => {
      const wrapper = mount(PixelButton, {
        slots: {
          default: '点击按钮'
        }
      })
      
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('PixelCard', () => {
    it('应该渲染卡片', () => {
      const wrapper = mount(PixelCard, {
        slots: {
          default: '卡片内容'
        }
      })
      expect(wrapper.text()).toContain('卡片内容')
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelCard, {
        props: {
          variant: 'gradient'
        },
        slots: {
          default: '渐变卡片'
        }
      })
      expect(wrapper.classes()).toContain('pixel-card--gradient')
    })

    it('应该支持标题', () => {
      const wrapper = mount(PixelCard, {
        props: {
          title: '卡片标题'
        },
        slots: {
          default: '卡片内容'
        }
      })
      expect(wrapper.text()).toContain('卡片标题')
    })

    it('应该支持插槽', () => {
      const wrapper = mount(PixelCard, {
        slots: {
          header: '头部',
          default: '内容',
          footer: '底部'
        }
      })
      expect(wrapper.text()).toContain('头部')
      expect(wrapper.text()).toContain('内容')
      expect(wrapper.text()).toContain('底部')
    })
  })

  describe('PixelInput', () => {
    it('应该渲染输入框', () => {
      const wrapper = mount(PixelInput, {
        props: {
          modelValue: '初始值',
          placeholder: '请输入内容',
          label: '输入标签'
        }
      })
      expect(wrapper.find('input').element.value).toBe('初始值')
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelInput, {
        props: {
          variant: 'outline'
        }
      })
      expect(wrapper.classes()).toContain('pixel-input--outline')
    })

    it('应该支持错误状态', () => {
      const wrapper = mount(PixelInput, {
        props: {
          error: '请输入有效内容'
        }
      })
      expect(wrapper.classes()).toContain('pixel-input--error')
    })

    it('应该支持禁用状态', () => {
      const wrapper = mount(PixelInput, {
        props: {
          disabled: true
        }
      })
      expect(wrapper.classes()).toContain('pixel-input--disabled')
    })

    it('应该支持只读状态', () => {
      const wrapper = mount(PixelInput, {
        props: {
          readonly: true
        }
      })
      expect(wrapper.find('input').element.readOnly).toBe(true)
    })

    it('应该更新输入值', async () => {
      const wrapper = mount(PixelInput, {
        props: {
          modelValue: ''
        }
      })
      
      await wrapper.find('input').setValue('新值')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新值'])
    })
  })

  describe('PixelTabs', () => {
    const tabs = [
      { id: 'tab1', label: '选项 1' },
      { id: 'tab2', label: '选项 2' },
      { id: 'tab3', label: '选项 3' }
    ]

    it('应该渲染标签页', () => {
      const wrapper = mount(PixelTabs, {
        props: {
          tabs: tabs,
          modelValue: 'tab1'
        }
      })
      expect(wrapper.text()).toContain('选项 1')
      expect(wrapper.text()).toContain('选项 2')
      expect(wrapper.text()).toContain('选项 3')
    })

    it('应该切换活动标签', async () => {
      const wrapper = mount(PixelTabs, {
        props: {
          tabs: tabs,
          modelValue: 'tab1'
        }
      })
      
      const secondTab = wrapper.findAll('.pixel-tabs__tab')[1]
      await secondTab.trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
    })

    it('应该显示活动标签的内容', () => {
      const wrapper = mount(PixelTabs, {
        props: {
          tabs: tabs,
          modelValue: 'tab2'
        },
        slots: {
          'panel-tab1': '内容 1',
          'panel-tab2': '内容 2',
          'panel-tab3': '内容 3'
        }
      })
      expect(wrapper.text()).toContain('内容 2')
    })
  })

  describe('PixelCodeBlock', () => {
    it('应该渲染代码块', () => {
      const wrapper = mount(PixelCodeBlock, {
        props: {
          code: 'console.log("Hello");',
          language: 'javascript'
        }
      })
      expect(wrapper.text()).toContain('console.log("Hello");')
    })

    it('应该显示语言标签', () => {
      const wrapper = mount(PixelCodeBlock, {
        props: {
          code: 'console.log("Hello");',
          language: 'javascript'
        }
      })
      expect(wrapper.text()).toContain('javascript')
    })

    it('应该支持复制功能', async () => {
      const wrapper = mount(PixelCodeBlock, {
        props: {
          code: 'console.log("Hello");',
          language: 'javascript',
          copyable: true
        }
      })
      
      const copyButton = wrapper.find('.pixel-code-block__copy-btn')
      await copyButton.trigger('click')
      
      // 这里可以添加复制成功的测试逻辑
      expect(copyButton.exists()).toBe(true)
    })
  })

  describe('PixelTag', () => {
    it('应该渲染标签', () => {
      const wrapper = mount(PixelTag, {
        slots: {
          default: '标签文本'
        }
      })
      expect(wrapper.text()).toBe('标签文本')
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelTag, {
        props: {
          variant: 'primary'
        },
        slots: {
          default: '主要标签'
        }
      })
      expect(wrapper.classes()).toContain('pixel-tag--primary')
    })

    it('应该支持不同的大小', () => {
      const wrapper = mount(PixelTag, {
        props: {
          size: 'large'
        },
        slots: {
          default: '大标签'
        }
      })
      expect(wrapper.classes()).toContain('pixel-tag--large')
    })

    it('应该支持可点击状态', async () => {
      const wrapper = mount(PixelTag, {
        props: {
          clickable: true
        },
        slots: {
          default: '可点击标签'
        }
      })
      
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('应该支持插槽', () => {
      const wrapper = mount(PixelTag, {
        slots: {
          default: '插槽标签'
        }
      })
      expect(wrapper.text()).toContain('插槽标签')
    })
  })

  describe('PixelBadge', () => {
    it('应该渲染徽章', () => {
      const wrapper = mount(PixelBadge, {
        slots: {
          default: '10'
        }
      })
      expect(wrapper.text()).toBe('10')
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelBadge, {
        props: {
          variant: 'primary'
        },
        slots: {
          default: '20'
        }
      })
      expect(wrapper.classes()).toContain('pixel-badge--primary')
    })

    it('应该支持不同的大小', () => {
      const wrapper = mount(PixelBadge, {
        props: {
          size: 'large'
        },
        slots: {
          default: '30'
        }
      })
      expect(wrapper.classes()).toContain('pixel-badge--large')
    })

    it('应该支持点状徽章', () => {
      const wrapper = mount(PixelBadge, {
        props: {
          dot: true
        }
      })
      expect(wrapper.classes()).toContain('pixel-badge--dot')
    })
  })

  describe('PixelHeading', () => {
    it('应该渲染标题', () => {
      const wrapper = mount(PixelHeading, {
        props: {
          level: 1
        },
        slots: {
          default: '标题文本'
        }
      })
      expect(wrapper.text()).toBe('标题文本')
    })

    it('应该支持不同的级别', () => {
      const wrapper = mount(PixelHeading, {
        props: {
          level: 2
        },
        slots: {
          default: '二级标题'
        }
      })
      expect(wrapper.classes()).toContain('pixel-heading--2')
    })

    it('应该支持像素字体', () => {
      const wrapper = mount(PixelHeading, {
        props: {
          pixelFont: true
        },
        slots: {
          default: '像素字体标题'
        }
      })
      expect(wrapper.classes()).toContain('pixel-heading--pixel-font')
    })
  })

  describe('PixelList', () => {
    it('应该渲染列表', () => {
      const wrapper = mount(PixelList, {
        props: {
          type: 'ul'
        },
        slots: {
          default: '<li>列表项</li>'
        }
      })
      expect(wrapper.find('ul').exists()).toBe(true)
    })

    it('应该支持有序列表', () => {
      const wrapper = mount(PixelList, {
        props: {
          type: 'ol'
        },
        slots: {
          default: '<li>有序列表项</li>'
        }
      })
      expect(wrapper.find('ol').exists()).toBe(true)
    })

    it('应该支持无序列表', () => {
      const wrapper = mount(PixelList, {
        props: {
          type: 'ul'
        },
        slots: {
          default: '<li>无序列表项</li>'
        }
      })
      expect(wrapper.find('ul').exists()).toBe(true)
    })
  })

  describe('PixelDivider', () => {
    it('应该渲染分隔线', () => {
      const wrapper = mount(PixelDivider)
      expect(wrapper.find('.pixel-divider').exists()).toBe(true)
    })

    it('应该支持不同的样式', () => {
      const wrapper = mount(PixelDivider, {
        props: {
          variant: 'dashed'
        }
      })
      expect(wrapper.classes()).toContain('pixel-divider--dashed')
    })

    it('应该支持带内容的分隔线', () => {
      const wrapper = mount(PixelDivider, {
        slots: {
          default: '内容'
        }
      })
      expect(wrapper.text()).toContain('内容')
    })
  })

  describe('PixelLayout', () => {
    it('应该渲染布局', () => {
      const wrapper = mount(PixelLayout, {
        slots: {
          default: '布局内容'
        }
      })
      expect(wrapper.text()).toContain('布局内容')
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelLayout, {
        props: {
          variant: 'card'
        },
        slots: {
          default: '卡片布局'
        }
      })
      expect(wrapper.classes()).toContain('pixel-layout--card')
    })

    it('应该支持插槽', () => {
      const wrapper = mount(PixelLayout, {
        slots: {
          default: '插槽内容'
        }
      })
      expect(wrapper.text()).toContain('插槽内容')
    })
  })

  describe('PixelGrid', () => {
    it('应该渲染网格', () => {
      const wrapper = mount(PixelGrid, {
        slots: {
          default: '<div>网格项</div>'
        }
      })
      expect(wrapper.find('.pixel-grid').exists()).toBe(true)
    })

    it('应该支持不同的变体', () => {
      const wrapper = mount(PixelGrid, {
        props: {
          variant: 'cards'
        },
        slots: {
          default: '<div>卡片</div>'
        }
      })
      expect(wrapper.classes()).toContain('pixel-grid--cards')
    })

    it('应该支持插槽', () => {
      const wrapper = mount(PixelGrid, {
        slots: {
          default: '<div>插槽项</div>'
        }
      })
      expect(wrapper.text()).toContain('插槽项')
    })
  })

  describe('PixelSpacing', () => {
    it('应该渲染间距', () => {
      const wrapper = mount(PixelSpacing, {
        props: {
          size: 'lg'
        }
      })
      expect(wrapper.classes()).toContain('pixel-spacing--lg')
    })

    it('应该支持不同的大小', () => {
      const wrapper = mount(PixelSpacing, {
        props: {
          size: 'xl'
        }
      })
      expect(wrapper.classes()).toContain('pixel-spacing--xl')
    })
  })

  describe('PixelIcon', () => {
    it('应该渲染图标', () => {
      const wrapper = mount(PixelIcon, {
        props: {
          size: 'medium',
          color: 'cyan'
        }
      })
      expect(wrapper.find('.pixel-icon').exists()).toBe(true)
    })

    it('应该支持不同的大小', () => {
      const wrapper = mount(PixelIcon, {
        props: {
          size: 'large'
        }
      })
      expect(wrapper.classes()).toContain('pixel-icon--large')
    })

    it('应该支持不同的颜色', () => {
      const wrapper = mount(PixelIcon, {
        props: {
          color: 'purple'
        }
      })
      expect(wrapper.classes()).toContain('pixel-icon--purple')
    })

    it('应该支持旋转动画', () => {
      const wrapper = mount(PixelIcon, {
        props: {
          rotate: true
        }
      })
      expect(wrapper.classes()).toContain('pixel-icon--rotate')
    })
  })

  describe('PixelNavbar', () => {
    const menuItems = [
      { id: 'home', label: '首页' },
      { id: 'about', label: '关于' },
      { id: 'contact', label: '联系' }
    ]

    it('应该渲染导航栏', () => {
      const wrapper = mount(PixelNavbar, {
        props: {
          menuItems: menuItems,
          modelValue: 'home'
        }
      })
      expect(wrapper.text()).toContain('首页')
      expect(wrapper.text()).toContain('关于')
      expect(wrapper.text()).toContain('联系')
    })

    it('应该支持菜单切换', async () => {
      const wrapper = mount(PixelNavbar, {
        props: {
          menuItems: menuItems,
          modelValue: 'home'
        }
      })
      
      const aboutTab = wrapper.findAll('.pixel-navbar__item')[1]
      await aboutTab.trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['about'])
    })

    it('应该支持插槽', () => {
      const wrapper = mount(PixelNavbar, {
        props: {
          menuItems: menuItems,
          modelValue: 'home'
        },
        slots: {
          brand: '品牌',
          actions: '操作'
        }
      })
      expect(wrapper.text()).toContain('品牌')
      expect(wrapper.text()).toContain('操作')
    })
  })
})