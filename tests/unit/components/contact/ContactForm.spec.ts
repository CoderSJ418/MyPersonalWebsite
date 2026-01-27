import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '@/components/contact/ContactForm.vue'

describe('ContactForm.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ContactForm)
  })

  describe('渲染测试', () => {
    it('应该渲染表单', () => {
      expect(wrapper.find('.contact-form').exists()).toBe(true)
    })

    it('应该渲染所有表单字段', () => {
      expect(wrapper.find('#name').exists()).toBe(true)
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#subject').exists()).toBe(true)
      expect(wrapper.find('#message').exists()).toBe(true)
    })

    it('应该渲染提交按钮', () => {
      const submitBtn = wrapper.find('.contact-form__submit')
      expect(submitBtn.exists()).toBe(true)
      expect(submitBtn.text()).toContain('发送消息')
    })
  })

  describe('表单验证', () => {
    it('应该在姓名为空时显示错误', async () => {
      const nameInput = wrapper.find('#name')
      await nameInput.setValue('')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').exists()).toBe(true)
    })

    it('应该在邮箱格式错误时显示错误', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('invalid-email')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').exists()).toBe(true)
    })

    it('应该在主题为空时显示错误', async () => {
      const subjectInput = wrapper.find('#subject')
      await subjectInput.setValue('')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').exists()).toBe(true)
    })

    it('应该在消息为空时显示错误', async () => {
      const messageInput = wrapper.find('#message')
      await messageInput.setValue('')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').exists()).toBe(true)
    })

    it('应该在姓名少于2个字符时显示错误', async () => {
      const nameInput = wrapper.find('#name')
      await nameInput.setValue('A')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').text()).toContain('至少需要 2 个字符')
    })

    it('应该在主题少于3个字符时显示错误', async () => {
      const nameInput = wrapper.find('#name')
      const emailInput = wrapper.find('#email')
      const subjectInput = wrapper.find('#subject')
      const messageInput = wrapper.find('#message')

      await nameInput.setValue('John Doe')
      await emailInput.setValue('john@example.com')
      await subjectInput.setValue('AB')
      await messageInput.setValue('This is a test message with enough characters')

      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').text()).toContain('至少需要 3 个字符')
    })

    it('应该在消息少于10个字符时显示错误', async () => {
      const nameInput = wrapper.find('#name')
      const emailInput = wrapper.find('#email')
      const subjectInput = wrapper.find('#subject')
      const messageInput = wrapper.find('#message')

      await nameInput.setValue('John Doe')
      await emailInput.setValue('john@example.com')
      await subjectInput.setValue('Test Subject')
      await messageInput.setValue('Short')

      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.find('.contact-form__error').text()).toContain('至少需要 10 个字符')
    })
  })

  describe('表单提交', () => {
    it('应该在表单有效时提交数据', async () => {
      const nameInput = wrapper.find('#name')
      const emailInput = wrapper.find('#email')
      const subjectInput = wrapper.find('#subject')
      const messageInput = wrapper.find('#message')

      await nameInput.setValue('John Doe')
      await emailInput.setValue('john@example.com')
      await subjectInput.setValue('Test Subject')
      await messageInput.setValue('This is a test message with enough characters')

      await wrapper.find('form').trigger('submit.prevent')

      await new Promise((resolve) => setTimeout(resolve, 1600))

      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')[0][0]).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters'
      })
    })

    it('应该在提交时显示加载状态', async () => {
      const nameInput = wrapper.find('#name')
      const emailInput = wrapper.find('#email')
      const subjectInput = wrapper.find('#subject')
      const messageInput = wrapper.find('#message')

      await nameInput.setValue('John Doe')
      await emailInput.setValue('john@example.com')
      await subjectInput.setValue('Test Subject')
      await messageInput.setValue('This is a test message with enough characters')

      await wrapper.find('form').trigger('submit.prevent')

      const submitBtn = wrapper.find('.contact-form__submit')
      expect(submitBtn.text()).toContain('发送中...')
      expect(submitBtn.attributes('disabled')).toBeDefined()
    })

    it('应该在提交成功后显示成功消息', async () => {
      const nameInput = wrapper.find('#name')
      const emailInput = wrapper.find('#email')
      const subjectInput = wrapper.find('#subject')
      const messageInput = wrapper.find('#message')

      await nameInput.setValue('John Doe')
      await emailInput.setValue('john@example.com')
      await subjectInput.setValue('Test Subject')
      await messageInput.setValue('This is a test message with enough characters')

      await wrapper.find('form').trigger('submit.prevent')

      await new Promise((resolve) => setTimeout(resolve, 1600))

      expect(wrapper.find('.contact-form__success').exists()).toBe(true)
      expect(wrapper.find('.contact-form__success').text()).toContain('消息已发送')
    })

    it('应该在提交成功后重置表单', async () => {
      const nameInput = wrapper.find('#name')
      const emailInput = wrapper.find('#email')
      const subjectInput = wrapper.find('#subject')
      const messageInput = wrapper.find('#message')

      await nameInput.setValue('John Doe')
      await emailInput.setValue('john@example.com')
      await subjectInput.setValue('Test Subject')
      await messageInput.setValue('This is a test message with enough characters')

      await wrapper.find('form').trigger('submit.prevent')

      await new Promise((resolve) => setTimeout(resolve, 1600))

      expect(nameInput.element.value).toBe('')
      expect(emailInput.element.value).toBe('')
      expect(subjectInput.element.value).toBe('')
      expect(messageInput.element.value).toBe('')
    })
  })

  describe('边界情况', () => {
    it('应该处理超长输入', async () => {
      const longText = 'A'.repeat(1000)
      const messageInput = wrapper.find('#message')
      await messageInput.setValue(longText)
      expect(messageInput.element.value).toBe(longText)
    })

    it('应该处理特殊字符', async () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const nameInput = wrapper.find('#name')
      await nameInput.setValue(specialChars)
      expect(nameInput.element.value).toBe(specialChars)
    })
  })
})