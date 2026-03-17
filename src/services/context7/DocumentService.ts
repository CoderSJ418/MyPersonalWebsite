/**
 * Context7 文档服务
 * @description 提供统一的文档获取接口，支持开发/生产环境自动切换
 */

import type {
  IDocumentService,
  Document,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './types'

/**
 * 环境检测工具
 */
function isDev(): boolean {
  return import.meta.env.DEV
}

/**
 * 文档服务工厂
 * @description 根据环境创建对应的文档服务实例
 * @returns IDocumentService
 */
export async function createDocumentService(): Promise<IDocumentService> {
  if (isDev()) {
    // 开发环境：使用 MCP 获取文档
    const { DevDocumentService } = await import('./DevDocumentService')
    return new DevDocumentService()
  } else {
    // 生产环境：使用缓存文档
    const { ProdDocumentService } = await import('./ProdDocumentService')
    return new ProdDocumentService()
  }
}

/**
 * 基础文档服务类
 * @description 提供通用的文档处理方法
 */
export abstract class BaseDocumentService implements IDocumentService {
  protected cache: Map<string, Document> = new Map()

  /**
   * 生成缓存键
   * @param libraryName 库名称
   * @param version 版本号
   * @returns 缓存键
   */
  protected getCacheKey(libraryName: string, version?: string): string {
    return `${libraryName}@${version || 'default'}`
  }

  /**
   * 生成内容校验和
   * @param content 内容
   * @returns 校验和
   */
  protected generateChecksum(content: string): string {
    // 使用 Base64 编码的前 16 个字符作为校验和
    return Buffer.from(content).toString('base64').slice(0, 16)
  }

  /**
   * 验证校验和
   * @param content 内容
   * @param expectedChecksum 期望的校验和
   * @returns 是否匹配
   */
  protected verifyChecksum(content: string, expectedChecksum: string): boolean {
    const actualChecksum = this.generateChecksum(content)
    return actualChecksum === expectedChecksum
  }

  /**
   * 解析 API 信息
   * @param content 文档内容
   * @returns API 信息列表
   */
  protected parseAPIs(content: string): any[] {
    // 简化实现：从文档中提取 API 信息
    // 实际实现需要根据文档格式进行解析
    const apiRegex = /```typescript\s+export\s+(function|const|class|interface)\s+(\w+)/g
    const apis: any[] = []
    let match

    while ((match = apiRegex.exec(content)) !== null) {
      apis.push({
        name: match[2],
        signature: match[0],
        description: '',
        deprecated: false
      })
    }

    return apis
  }

  /**
   * 静态验证代码
   * @param code 代码片段
   * @param doc 文档对象
   * @returns 验证结果
   */
  protected staticValidate(code: string, doc: Document): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // 检查是否使用了已废弃的 API
    doc.apis.forEach((api) => {
      if (api.deprecated && code.includes(api.name)) {
        errors.push({
          type: 'api_deprecated',
          message: `API '${api.name}' 已废弃（废弃版本：${api.deprecatedSince}）`,
          location: 'unknown',
          apiName: api.name
        })

        if (api.replacement) {
          warnings.push({
            type: 'best_practice',
            message: `建议使用替代方案：${api.replacement}`,
            suggestion: `将 '${api.name}' 替换为 '${api.replacement}'`
          })
        }
      }
    })

    // 检查 Vue 2 API（如果文档是 Vue 3）
    if (doc.library === 'vue' && doc.version.startsWith('3.')) {
      if (code.includes('new Vue(')) {
        errors.push({
          type: 'version_mismatch',
          message: '检测到 Vue 2 API，应该使用 Vue 3 Composition API',
          location: 'unknown'
        })
      }

      if (code.includes('this.$')) {
        warnings.push({
          type: 'best_practice',
          message: '检测到 Options API，建议使用 Composition API',
          suggestion: '考虑使用 setup() 和 Composition API'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * 获取库文档（抽象方法，子类必须实现）
   */
  abstract getDocument(libraryName: string, version?: string): Promise<Document>

  /**
   * 获取代码示例
   * @param libraryName 库名称
   * @param exampleName 示例名称
   * @returns Promise<string>
   */
  async getExample(libraryName: string, exampleName: string): Promise<string> {
    const doc = await this.getDocument(libraryName)
    return doc.examples[exampleName] || ''
  }

  /**
   * 验证代码与文档一致性
   * @param libraryName 库名称
   * @param code 代码片段
   * @returns Promise<ValidationResult>
   */
  async validateCode(libraryName: string, code: string): Promise<ValidationResult> {
    const doc = await this.getDocument(libraryName)
    return this.staticValidate(code, doc)
  }

  /**
   * 刷新文档缓存（抽象方法，子类必须实现）
   */
  abstract refreshCache(libraryName: string): Promise<void>

  /**
   * 获取库的所有可用版本（抽象方法，子类必须实现）
   */
  abstract getAvailableVersions(libraryName: string): Promise<string[]>
}

/**
 * 导出类型
 */
export type {
  IDocumentService,
  Document,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './types'
