/**
 * Context7 MCP 客户端
 * @description 与 MCP 服务器通信，获取官方文档和验证代码
 */

import type { IMCPClient, Document, ValidationResult } from './types'

/**
 * MCP 客户端实现
 * @description 通过 MCP 协议与 Context7 服务器通信
 */
export class MCPClient implements IMCPClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    // MCP 服务器地址（需要根据实际配置调整）
    this.baseUrl = import.meta.env.VITE_MCP_SERVER_URL || 'http://localhost:3000'
    this.timeout = 30000 // 30 秒超时
  }

  /**
   * 获取文档
   * @param libraryName 库名称
   * @param version 版本号（可选）
   * @returns Promise<string>
   */
  async fetchDocumentation(libraryName: string, version?: string): Promise<string> {
    try {
      const url = new URL(`${this.baseUrl}/docs/${libraryName}`)
      if (version) {
        url.searchParams.set('version', version)
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch documentation: ${response.statusText}`)
      }

      const data = await response.json()
      return data.content || ''
    } catch (error) {
      console.error(`Error fetching documentation for ${libraryName}:`, error)
      throw error
    }
  }

  /**
   * 验证代码与文档一致性
   * @param code 代码片段
   * @param doc 文档对象
   * @returns Promise<ValidationResult>
   */
  async validateCodeAgainstDoc(code: string, doc: Document): Promise<ValidationResult> {
    try {
      const url = new URL(`${this.baseUrl}/validate`)

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          library: doc.library,
          version: doc.version
        }),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Failed to validate code: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error validating code:', error)
      throw error
    }
  }

  /**
   * 获取库的所有可用版本
   * @param libraryName 库名称
   * @returns Promise<string[]>
   */
  async getLibraryVersions(libraryName: string): Promise<string[]> {
    try {
      const url = new URL(`${this.baseUrl}/versions/${libraryName}`)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch versions: ${response.statusText}`)
      }

      const data = await response.json()
      return data.versions || []
    } catch (error) {
      console.error(`Error fetching versions for ${libraryName}:`, error)
      throw error
    }
  }

  /**
   * 设置超时时间
   * @param timeout 超时时间（毫秒）
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout
  }

  /**
   * 设置基础 URL
   * @param baseUrl 基础 URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }
}

/**
 * 导出类型
 */
export type { IMCPClient, Document, ValidationResult } from './types'
