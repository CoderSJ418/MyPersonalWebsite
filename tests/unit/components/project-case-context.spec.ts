import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProjectCaseContext from '@/components/projects/ProjectCaseContext.vue'
import ProjectViewModeSwitch from '@/components/projects/ProjectViewModeSwitch.vue'
import type { ProjectCaseView } from '@/types/view-contract'

const context: ProjectCaseView = {
  role: '核心前端开发',
  teamContext: '多人协作并以 Git 核验',
  platforms: ['微信小程序', 'H5'],
  responsibilities: ['状态建模'],
  teamResults: ['双端交付'],
  constraints: ['不公开客户内部信息']
}

describe('project case context', () => {
  it('keeps team results out of the recruit summary', () => {
    const wrapper = mount(ProjectCaseContext, { props: { data: context, density: 'recruit' } })
    expect(wrapper.text()).toContain('核心前端开发')
    expect(wrapper.text()).toContain('微信小程序')
    expect(wrapper.text()).toContain('状态建模')
    expect(wrapper.text()).not.toContain('双端交付')
  })

  it('shows the complete reader context and hides an empty context', () => {
    const reader = mount(ProjectCaseContext, { props: { data: context, density: 'reader' } })
    expect(reader.text()).toContain('团队成果')
    expect(reader.text()).toContain('双端交付')
    expect(reader.text()).toContain('案例边界')
    expect(
      mount(ProjectCaseContext, { props: { data: {}, density: 'reader' } })
        .find('section')
        .exists()
    ).toBe(false)
  })

  it('emits both accessible view-mode actions', async () => {
    const wrapper = mount(ProjectViewModeSwitch, {
      props: { isRecruit: true, isReader: false }
    })
    const buttons = wrapper.findAll('button')
    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')
    expect(wrapper.emitted('select-recruit')).toHaveLength(1)
    expect(wrapper.emitted('select-reader')).toHaveLength(1)
    expect(buttons[0]?.attributes('aria-pressed')).toBe('true')
  })
})
