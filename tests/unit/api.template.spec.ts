/**
 * API 层测试模板
 * 用于测试 API 客户端、拦截器、错误处理等
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import { get, post, put, del, patch } from '@/api/index'
import * as analyticsApi from '@/api/analytics'
import * as cmsApi from '@/api/cms'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}))

describe('API Client', () => {
  let mockAxiosInstance: any

  beforeEach(() => {
    mockAxiosInstance = axios.create()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET 请求', () => {
    it('应该成功发送 GET 请求', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockAxiosInstance.get.mockResolvedValue({ data: mockData })

      const result = await get('/test')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test')
      expect(result).toEqual(mockData)
    })

    it('应该支持请求配置', async () => {
      const mockData = { id: 1 }
      const config = { params: { page: 1 } }
      mockAxiosInstance.get.mockResolvedValue({ data: mockData })

      const result = await get('/test', config)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', config)
      expect(result).toEqual(mockData)
    })
  })

  describe('POST 请求', () => {
    it('应该成功发送 POST 请求', async () => {
      const mockData = { id: 1, name: 'Test' }
      const postData = { name: 'Test' }
      mockAxiosInstance.post.mockResolvedValue({ data: mockData })

      const result = await post('/test', postData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData)
      expect(result).toEqual(mockData)
    })

    it('应该支持请求配置', async () => {
      const mockData = { id: 1 }
      const postData = { name: 'Test' }
      const config = { headers: { 'X-Custom-Header': 'value' } }
      mockAxiosInstance.post.mockResolvedValue({ data: mockData })

      const result = await post('/test', postData, config)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData, config)
      expect(result).toEqual(mockData)
    })
  })

  describe('PUT 请求', () => {
    it('应该成功发送 PUT 请求', async () => {
      const mockData = { id: 1, name: 'Updated' }
      const putData = { name: 'Updated' }
      mockAxiosInstance.put.mockResolvedValue({ data: mockData })

      const result = await put('/test', putData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', putData)
      expect(result).toEqual(mockData)
    })
  })

  describe('DELETE 请求', () => {
    it('应该成功发送 DELETE 请求', async () => {
      const mockData = { success: true }
      mockAxiosInstance.delete.mockResolvedValue({ data: mockData })

      const result = await del('/test')

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test')
      expect(result).toEqual(mockData)
    })
  })

  describe('PATCH 请求', () => {
    it('应该成功发送 PATCH 请求', async () => {
      const mockData = { id: 1, name: 'Patched' }
      const patchData = { name: 'Patched' }
      mockAxiosInstance.patch.mockResolvedValue({ data: mockData })

      const result = await patch('/test', patchData)

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test', patchData)
      expect(result).toEqual(mockData)
    })
  })
})

describe('Analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('trackPageView', () => {
    it('应该追踪页面浏览', async () => {
      const event = {
        page: '/home',
        title: 'Home',
        referrer: '',
        timestamp: Date.now(),
      }

      await analyticsApi.trackPageView(event)

      // 验证调用
      expect(post).toHaveBeenCalledWith('/api/analytics/pageview', event)
    })
  })

  describe('trackEvent', () => {
    it('应该追踪事件', async () => {
      const event = {
        name: 'button_click',
        properties: { button: 'cta' },
        timestamp: Date.now(),
      }

      await analyticsApi.trackEvent(event)

      // 验证调用
      expect(post).toHaveBeenCalledWith('/api/analytics/event', event)
    })
  })
})

describe('CMS API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getBlogPosts', () => {
    it('应该获取博客文章列表', async () => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          items: [
            { id: '1', title: 'Test Post 1' },
            { id: '2', title: 'Test Post 2' },
          ],
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
        timestamp: Date.now(),
      }

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse })

      const result = await cmsApi.getBlogPosts()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/cms/blog/posts', {
        params: undefined,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getProjects', () => {
    it('应该获取项目列表', async () => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          items: [
            { id: '1', title: 'Test Project 1' },
            { id: '2', title: 'Test Project 2' },
          ],
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
        timestamp: Date.now(),
      }

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse })

      const result = await cmsApi.getProjects()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/cms/projects', {
        params: undefined,
      })
      expect(result).toEqual(mockResponse)
    })
  })
})

describe('错误处理', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该处理 404 错误', async () => {
    const error = {
      response: {
        status: 404,
        data: { message: 'Not Found' },
      },
    }
    mockAxiosInstance.get.mockRejectedValue(error)

    await expect(get('/test')).rejects.toThrow()
  })

  it('应该处理网络错误', async () => {
    const error = {
      request: {},
    }
    mockAxiosInstance.get.mockRejectedValue(error)

    await expect(get('/test')).rejects.toThrow()
  })
})