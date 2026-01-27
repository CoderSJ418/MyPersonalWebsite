# 测试指南

本文档提供了 MyPersonalWebsite 项目的测试指南和最佳实践。

## 目录

- [测试策略](#测试策略)
- [单元测试](#单元测试)
- [组件测试](#组件测试)
- [E2E 测试](#e2e-测试)
- [测试覆盖率](#测试覆盖率)
- [最佳实践](#最佳实践)

## 测试策略

### 测试金字塔

```
        /\
       /E2E\      少量端到端测试
      /------\
     /Component\  适量组件测试
    /----------\
   /   Unit     \ 大量单元测试
  /--------------\
```

- **单元测试**: 测试独立的函数和工具
- **组件测试**: 测试 Vue 组件的行为
- **E2E 测试**: 测试完整的用户流程

## 单元测试

使用 Vitest 进行单元测试。

### 配置

测试配置文件：`vitest.config.ts`

### 基本示例

**测试工具函数**

```typescript
// src/utils/math.test.ts
import { describe, it, expect } from 'vitest'
import { add, subtract, multiply, divide } from '@/utils/math'

describe('math utils', () => {
  describe('add', () => {
    it('should add two numbers correctly', () => {
      expect(add(1, 2)).toBe(3)
      expect(add(-1, 1)).toBe(0)
    })

    it('should handle decimal numbers', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3)
    })
  })

  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2)
      expect(subtract(3, 5)).toBe(-2)
    })
  })

  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero')
    })
  })
})
```

**测试异步函数**

```typescript
// src/utils/api.test.ts
import { describe, it, expect, vi } from 'vitest'
import { fetchUser } from '@/utils/api'

describe('fetchUser', () => {
  it('should fetch user data successfully', async () => {
    const user = await fetchUser('1')
    expect(user).toHaveProperty('id', '1')
    expect(user).toHaveProperty('name')
  })

  it('should handle errors', async () => {
    await expect(fetchUser('invalid')).rejects.toThrow()
  })
})
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test src/utils/math.test.ts
```

## 组件测试

使用 Vitest 和 Vue Test Utils 进行组件测试。

### 基本示例

**测试组件渲染**

```typescript
// src/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/common/Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
```

**测试组件 Props**

```typescript
describe('Button variants', () => {
  it('applies primary variant class', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary' }
    })
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('applies secondary variant class', () => {
    const wrapper = mount(Button, {
      props: { variant: 'secondary' }
    })
    expect(wrapper.classes()).toContain('btn-secondary')
  })
})
```

**测试组件 Slots**

```typescript
describe('Button slots', () => {
  it('renders default slot', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Custom text'
      }
    })
    expect(wrapper.text()).toBe('Custom text')
  })

  it('renders icon slot', () => {
    const wrapper = mount(Button, {
      slots: {
        icon: '<span class="icon">★</span>'
      }
    })
    expect(wrapper.find('.icon').exists()).toBe(true)
  })
})
```

### 测试 Composables

```typescript
// src/composables/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter()
    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('decrements count', () => {
    const { count, decrement } = useCounter()
    expect(count.value).toBe(0)
    decrement()
    expect(count.value).toBe(-1)
  })

  it('resets count', () => {
    const { count, increment, reset } = useCounter()
    increment()
    increment()
    reset()
    expect(count.value).toBe(0)
  })
})
```

## E2E 测试

使用 Playwright 进行端到端测试。

### 配置

测试配置文件：`playwright.config.ts`

### 基本示例

**测试页面导航**

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navigates to home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/My Personal Website/)
  })

  test('navigates to projects page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Projects')
    await expect(page).toHaveURL(/.*projects/)
  })

  test('navigates to blog page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Blog')
    await expect(page).toHaveURL(/.*blog/)
  })
})
```

**测试表单提交**

```typescript
// tests/e2e/contact.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test('submits contact form successfully', async ({ page }) => {
    await page.goto('/contact')

    // 填写表单
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('textarea[name="message"]', 'Hello!')

    // 提交表单
    await page.click('button[type="submit"]')

    // 验证成功消息
    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('shows validation errors', async ({ page }) => {
    await page.goto('/contact')

    // 提交空表单
    await page.click('button[type="submit"]')

    // 验证错误消息
    await expect(page.locator('.error-message')).toBeVisible()
  })
})
```

**测试响应式设计**

```typescript
// tests/e2e/responsive.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test('mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // 验证移动端菜单
    await expect(page.locator('.mobile-menu')).toBeVisible()
  })

  test('desktop view', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    // 验证桌面端导航
    await expect(page.locator('.desktop-nav')).toBeVisible()
  })
})
```

### 运行 E2E 测试

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 运行特定测试文件
npm run test:e2e tests/e2e/contact.spec.ts

# 调试模式
npm run test:e2e -- --debug

# 生成测试报告
npm run test:e2e -- --reporter=html
```

## 测试覆盖率

### 生成覆盖率报告

```bash
npm run test:coverage
```

覆盖率报告将生成在 `coverage/` 目录。

### 覆盖率目标

- **语句覆盖率**: >= 80%
- **分支覆盖率**: >= 75%
- **函数覆盖率**: >= 80%
- **行覆盖率**: >= 80%

### 查看覆盖率报告

```bash
# 在浏览器中打开
open coverage/index.html
```

## 最佳实践

### 1. 测试命名

**使用描述性的测试名称**

```typescript
// ✅ 推荐
it('should increment count when increment function is called')

// ❌ 不推荐
it('test increment')
```

### 2. 测试隔离

**每个测试应该独立运行**

```typescript
// ✅ 推荐
describe('Counter', () => {
  beforeEach(() => {
    // 重置状态
  })

  it('increments count', () => {
    // 测试逻辑
  })
})

// ❌ 不推荐
describe('Counter', () => {
  it('increments count', () => {
    // 修改全局状态
  })

  it('decrements count', () => {
    // 依赖上一个测试的状态
  })
})
```

### 3. 使用 Mock

**Mock 外部依赖**

```typescript
import { vi } from 'vitest'

// Mock API 调用
vi.mock('@/utils/api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: '1', name: 'John' }))
}))
```

### 4. 测试异步代码

**正确处理异步操作**

```typescript
// ✅ 推荐
it('fetches data asynchronously', async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// ❌ 不推荐
it('fetches data asynchronously', () => {
  fetchData().then(data => {
    expect(data).toBeDefined()
  })
})
```

### 5. 测试边界情况

**测试边界值和错误情况**

```typescript
describe('divide', () => {
  it('handles positive numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })

  it('handles zero', () => {
    expect(divide(0, 5)).toBe(0)
  })

  it('throws error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow()
  })
})
```

## 持续集成

### GitHub Actions

项目使用 GitHub Actions 自动运行测试：

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

## 相关资源

- [Vitest 文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright 文档](https://playwright.dev/)
- [测试最佳实践](https://testingjavascript.com/)