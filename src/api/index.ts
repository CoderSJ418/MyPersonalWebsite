import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useAnalyticsStore } from '@/stores/useAnalyticsStore'

/**
 * API 客户端配置
 * 封装 Axios，提供统一的 HTTP 客户端
 */

// 创建 Axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 * 在请求发送前执行
 */
apiClient.interceptors.request.use(
  (config) => {
    // 追踪 API 请求
    const analyticsStore = useAnalyticsStore()
    analyticsStore.trackRequest(config.url || '')

    // 添加认证 token（如果存在）
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求 ID（用于追踪）
    config.headers['X-Request-ID'] = generateRequestId()

    return config
  },
  (error: AxiosError) => {
    // 请求配置错误
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 在响应返回后执行
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 成功响应
    return response
  },
  (error: AxiosError) => {
    // 统一错误处理
    handleApiError(error)
    return Promise.reject(error)
  }
)

/**
 * 生成请求 ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 处理 API 错误
 */
function handleApiError(error: AxiosError): void {
  if (error.response) {
    // 服务器返回错误
    const status = error.response.status
    const data = error.response.data as any

    switch (status) {
      case 400:
        console.error('Bad Request:', data?.message || '请求参数错误')
        break
      case 401:
        console.error('Unauthorized:', '未授权，请登录')
        // 可以在这里跳转到登录页
        break
      case 403:
        console.error('Forbidden:', '无权限访问')
        break
      case 404:
        console.error('Not Found:', data?.message || '资源不存在')
        break
      case 500:
        console.error('Internal Server Error:', '服务器内部错误')
        break
      default:
        console.error('API Error:', data?.message || '未知错误')
    }
  } else if (error.request) {
    // 请求发送但无响应
    console.error('Network Error:', '网络错误，请检查网络连接')
  } else {
    // 请求配置错误
    console.error('Request Error:', error.message)
  }
}

/**
 * 封装 GET 请求
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config)
  return response.data
}

/**
 * 封装 POST 请求
 */
export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

/**
 * 封装 PUT 请求
 */
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config)
  return response.data
}

/**
 * 封装 DELETE 请求
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}

/**
 * 封装 PATCH 请求
 */
export async function patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config)
  return response.data
}

/**
 * 导出 Axios 实例（用于高级用法）
 */
export default apiClient