/**
 * Context7 开发环境文档服务
 * @description 开发环境使用 MCP 获取官方文档，生成静态文件
 */

import { BaseDocumentService } from './DocumentService'
import { MCPClient } from './MCPClient'
import type { Document, APIInfo } from './types'
import path from 'path'
import fs from 'fs/promises'

/**
 * 开发环境文档服务
 * @description 使用 MCP 获取官方文档，生成静态文件供生产环境使用
 */
export class DevDocumentService extends BaseDocumentService {
  private mcpClient: MCPClient
  private docsDir: string

  constructor() {
    super()
    this.mcpClient = new MCPClient()
    // 文档存储目录
    this.docsDir = path.join(process.cwd(), 'public', 'docs')
  }

  /**
   * 获取库文档
   * @param libraryName 库名称
   * @param version 版本号（可选）
   * @returns Promise<Document>
   */
  async getDocument(libraryName: string, version?: string): Promise<Document> {
    const cacheKey = this.getCacheKey(libraryName, version)

    // 检查缓存
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      // 1. 通过 MCP 获取官方文档
      const rawDoc = await this.mcpClient.fetchDocumentation(libraryName, version)

      // 2. 解析文档内容
      const parsed = this.parseDocument(rawDoc, libraryName, version)

      // 3. 生成静态文件
      await this.generateStaticFile(libraryName, parsed)

      // 4. 缓存文档
      this.cache.set(cacheKey, parsed)

      console.log(`✅ 文档已获取: ${libraryName}@${parsed.version}`)
      return parsed
    } catch (error) {
      console.error(`❌ 获取文档失败: ${libraryName}`, error)
      throw error
    }
  }

  /**
   * 解析文档内容
   * @param raw 原始文档内容
   * @param libraryName 库名称
   * @param version 版本号
   * @returns Document
   */
  private parseDocument(raw: string, libraryName: string, version?: string): Document {
    // 解析代码示例
    const examples = this.parseExamples(raw)

    // 解析 API 信息
    const apis = this.parseAPIs(raw)

    // 确定版本号
    const docVersion = version || this.extractVersion(raw) || 'latest'

    return {
      library: libraryName,
      version: docVersion,
      content: raw,
      examples,
      apis,
      lastUpdated: new Date().toISOString(),
      checksum: this.generateChecksum(raw)
    }
  }

  /**
   * 解析代码示例
   * @param content 文档内容
   * @returns 代码示例集合
   */
  private parseExamples(content: string): Record<string, string> {
    const examples: Record<string, string> = {}

    // 匹配代码块
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g
    let match
    let exampleIndex = 0

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'typescript'
      const code = match[2].trim()

      // 提取示例名称（如果有）
      const nameMatch = code.match(/\/\/\s*示例[:：]\s*(.+)/)
      const exampleName = nameMatch ? nameMatch[1].trim() : `example-${exampleIndex}`

      examples[exampleName] = code
      exampleIndex++
    }

    return examples
  }

  /**
   * 提取版本号
   * @param content 文档内容
   * @returns 版本号
   */
  private extractVersion(content: string): string {
    // 尝试从文档中提取版本号
    const versionMatch = content.match(/version[:：]\s*([\d.]+)/i)
    return versionMatch ? versionMatch[1] : 'latest'
  }

  /**
   * 生成静态文件
   * @param libraryName 库名称
   * @param doc 文档对象
   */
  private async generateStaticFile(libraryName: string, doc: Document): Promise<void> {
    try {
      // 确保目录存在
      await fs.mkdir(this.docsDir, { recursive: true })

      // 生成文件名
      const fileName = `${libraryName}-${doc.version}.json`
      const filePath = path.join(this.docsDir, fileName)

      // 写入文件
      await fs.writeFile(filePath, JSON.stringify(doc, null, 2), 'utf-8')

      console.log(`📄 静态文件已生成: ${fileName}`)
    } catch (error) {
      console.error(`❌ 生成静态文件失败: ${libraryName}`, error)
      throw error
    }
  }

  /**
   * 刷新文档缓存
   * @param libraryName 库名称
   */
  async refreshCache(libraryName: string): Promise<void> {
    // 清除缓存
    const cacheKeysToRemove = Array.from(this.cache.keys()).filter((key) =>
      key.startsWith(`${libraryName}@`)
    )

    cacheKeysToRemove.forEach((key) => this.cache.delete(key))

    // 重新获取文档
    await this.getDocument(libraryName)

    console.log(`🔄 文档缓存已刷新: ${libraryName}`)
  }

  /**
   * 获取库的所有可用版本
   * @param libraryName 库名称
   * @returns Promise<string[]>
   */
  async getAvailableVersions(libraryName: string): Promise<string[]> {
    try {
      return await this.mcpClient.getLibraryVersions(libraryName)
    } catch (error) {
      console.error(`❌ 获取版本列表失败: ${libraryName}`, error)
      return []
    }
  }

  /**
   * 批量获取多个库的文档
   * @param libraries 库列表
   * @returns Promise<Record<string, Document>>
   */
  async fetchMultipleDocuments(
    libraries: Array<{ name: string; version?: string }>
  ): Promise<Record<string, Document>> {
    const results: Record<string, Document> = {}

    console.log(`📚 开始获取 ${libraries.length} 个库的文档...`)

    for (const { name, version } of libraries) {
      try {
        results[name] = await this.getDocument(name, version)
      } catch (error) {
        console.error(`❌ 获取文档失败: ${name}`, error)
      }
    }

    console.log(`✅ 文档获取完成: ${Object.keys(results).length}/${libraries.length}`)
    return results
  }

  /**
   * 生成文档索引
   * @returns Promise<void>
   */
  async generateIndex(): Promise<void> {
    try {
      // 读取所有文档文件
      const files = await fs.readdir(this.docsDir)
      const jsonFiles = files.filter((file) => file.endsWith('.json'))

      const entries = []

      for (const file of jsonFiles) {
        const filePath = path.join(this.docsDir, file)
        const stats = await fs.stat(filePath)

        // 提取库名和版本
        const match = file.match(/^(.+)-(.+)\.json$/)
        if (match) {
          const [, library, version] = match

          // 读取文档获取校验和
          const content = await fs.readFile(filePath, 'utf-8')
          const doc = JSON.parse(content) as Document

          entries.push({
            library,
            version,
            filePath,
            checksum: doc.checksum,
            size: stats.size
          })
        }
      }

      // 生成索引文件
      const index = {
        documents: entries,
        lastUpdated: new Date().toISOString()
      }

      const indexPath = path.join(this.docsDir, 'index.json')
      await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8')

      console.log(`📋 文档索引已生成: ${entries.length} 个文档`)
    } catch (error) {
      console.error('❌ 生成文档索引失败:', error)
      throw error
    }
  }
}

/**
 * 导出类型
 */
export type { Document, APIInfo } from './types'
