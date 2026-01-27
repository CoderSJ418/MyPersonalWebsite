/**
 * Context7 文档服务类型定义
 * @description 定义文档服务相关的类型和接口
 */

/**
 * 文档数据结构
 */
export interface Document {
  /** 库名称 */
  library: string
  /** 版本号 */
  version: string
  /** 文档内容（Markdown 格式） */
  content: string
  /** 代码示例集合 */
  examples: Record<string, string>
  /** API 列表 */
  apis: APIInfo[]
  /** 最后更新时间（ISO 8601 格式） */
  lastUpdated: string
  /** 内容校验和（用于验证文档完整性） */
  checksum: string
}

/**
 * API 信息
 */
export interface APIInfo {
  /** API 名称 */
  name: string
  /** 签名 */
  signature: string
  /** 描述 */
  description: string
  /** 是否已废弃 */
  deprecated: boolean
  /** 废弃版本（如果已废弃） */
  deprecatedSince?: string
  /** 替代方案（如果已废弃） */
  replacement?: string
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  isValid: boolean
  /** 错误列表 */
  errors: ValidationError[]
  /** 警告列表 */
  warnings: ValidationWarning[]
}

/**
 * 验证错误
 */
export interface ValidationError {
  /** 错误类型 */
  type: 'version_mismatch' | 'api_deprecated' | 'syntax_error' | 'incompatible_api'
  /** 错误消息 */
  message: string
  /** 错误位置（可选） */
  location?: string
  /** 相关 API 名称（可选） */
  apiName?: string
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  /** 警告类型 */
  type: 'best_practice' | 'performance' | 'security' | 'accessibility'
  /** 警告消息 */
  message: string
  /** 建议（可选） */
  suggestion?: string
}

/**
 * 文档服务接口
 */
export interface IDocumentService {
  /**
   * 获取库文档
   * @param libraryName 库名称（如 'vue', 'pinia'）
   * @param version 版本号（可选，默认使用当前项目版本）
   * @returns Promise<Document>
   */
  getDocument(libraryName: string, version?: string): Promise<Document>

  /**
   * 获取代码示例
   * @param libraryName 库名称
   * @param exampleName 示例名称
   * @returns Promise<string>
   */
  getExample(libraryName: string, exampleName: string): Promise<string>

  /**
   * 验证代码与文档一致性
   * @param libraryName 库名称
   * @param code 代码片段
   * @returns Promise<ValidationResult>
   */
  validateCode(libraryName: string, code: string): Promise<ValidationResult>

  /**
   * 刷新文档缓存（仅开发环境）
   * @param libraryName 库名称
   */
  refreshCache(libraryName: string): Promise<void>

  /**
   * 获取库的所有可用版本
   * @param libraryName 库名称
   * @returns Promise<string[]>
   */
  getAvailableVersions(libraryName: string): Promise<string[]>
}

/**
 * MCP 客户端接口
 */
export interface IMCPClient {
  /**
   * 获取文档
   * @param libraryName 库名称
   * @param version 版本号（可选）
   * @returns Promise<string>
   */
  fetchDocumentation(libraryName: string, version?: string): Promise<string>

  /**
   * 验证代码与文档一致性
   * @param code 代码片段
   * @param doc 文档对象
   * @returns Promise<ValidationResult>
   */
  validateCodeAgainstDoc(code: string, doc: Document): Promise<ValidationResult>

  /**
   * 获取库的所有可用版本
   * @param libraryName 库名称
   * @returns Promise<string[]>
   */
  getLibraryVersions(libraryName: string): Promise<string[]>
}

/**
 * 代码校验器接口
 */
export interface ICodeValidator {
  /**
   * 验证组件代码
   * @param componentCode 组件代码
   * @param libraryName 库名称
   * @returns Promise<ValidationResult>
   */
  validateComponent(componentCode: string, libraryName: string): Promise<ValidationResult>

  /**
   * 验证 Pinia Store
   * @param storeCode Store 代码
   * @returns Promise<ValidationResult>
   */
  validateStore(storeCode: string): Promise<ValidationResult>

  /**
   * 验证路由配置
   * @param routerCode 路由代码
   * @returns Promise<ValidationResult>
   */
  validateRouter(routerCode: string): Promise<ValidationResult>
}

/**
 * 文档索引
 */
export interface DocumentIndex {
  /** 文档列表 */
  documents: DocumentIndexEntry[]
  /** 最后更新时间 */
  lastUpdated: string
}

/**
 * 文档索引条目
 */
export interface DocumentIndexEntry {
  /** 库名称 */
  library: string
  /** 版本 */
  version: string
  /** 文件路径 */
  filePath: string
  /** 校验和 */
  checksum: string
  /** 文件大小（字节） */
  size: number
}
