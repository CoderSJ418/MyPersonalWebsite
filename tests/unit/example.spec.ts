import { describe, it, expect } from 'vitest'

describe('Vitest 配置测试', () => {
  it('应该能够运行基本的测试', () => {
    expect(1 + 1).toBe(2)
  })

  it('应该能够测试异步代码', async () => {
    const promise = Promise.resolve(42)
    await expect(promise).resolves.toBe(42)
  })

  it('应该能够测试对象', () => {
    const obj = { name: '测试', value: 100 }
    expect(obj).toHaveProperty('name')
    expect(obj).toHaveProperty('value', 100)
  })
})