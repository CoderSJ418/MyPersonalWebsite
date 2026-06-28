/**
 * Context7 生产环境文档服务
 * @description 生产环境使用静态文档文件，无需网络请求
 */

import { BaseDocumentService } from './DocumentService'
import type { Document } from './types'
import path from 'path'
import fs from 'fs/promises'

/**
 * 生产环境文档服务
 * @description 使用静态文档文件，提供高性能的文档访问
 */
export class ProdDocumentService extends BaseDocumentService {
  private docsDir: string
  private initialized: boolean = false

  constructor() {
    super()
    // 文档存储目录
    this.docsDir = path.join(process.cwd(), 'public', 'docs')
  }

  /**
   * 初始化文档缓存
   * @description 在服务初始化时加载所有文档到内存
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      console.log('📚 初始化生产环境文档缓存...')

      // 确保目录存在
      await fs.mkdir(this.docsDir, { recursive: true })

      // 读取所有文档文件
      const files = await fs.readdir(this.docsDir)
      const jsonFiles = files.filter((file) => file.endsWith('.json') && file !== 'index.json')

      console.log(`📄 发现 ${jsonFiles.length} 个文档文件`)

      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.docsDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const doc: Document = JSON.parse(content)

          // 验证校验和
          if (!this.verifyChecksum(doc.content, doc.checksum)) {
            console.warn(`⚠️  文档校验和不匹配: ${file}`)
          }

          // 缓存文档
          const cacheKey = this.getCacheKey(doc.library, doc.version)
          this.cache.set(cacheKey, doc)

          console.log(`✅ 已加载: ${doc.library}@${doc.version}`)
        } catch (error) {
          console.error(`❌ 加载文档失败: ${file}`, error)
        }
      }

      this.initialized = true
      console.log(`✅ 文档缓存初始化完成: ${this.cache.size} 个文档`)
    } catch (error) {
      console.error('❌ 初始化文档缓存失败:', error)
      // 不抛出错误，允许应用继续运行
    }
  }

  /**
   * 获取库文档
   * @param libraryName 库名称
   * @param version 版本号（可选）
   * @returns Promise<Document>
   */
  async getDocument(libraryName: string, version?: string): Promise<Document> {
    // 确保已初始化
    if (!this.initialized) {
      await this.initialize()
    }

    const cacheKey = this.getCacheKey(libraryName, version)

    // 从缓存读取
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // 尝试从静态文件加载
    try {
      const doc = await this.loadStaticFile(libraryName, version)
      this.cache.set(cacheKey, doc)
      return doc
    } catch (error) {
      console.error(`❌ 加载文档失败: ${libraryName}`, error)
      throw new Error(`文档未找到: ${libraryName}${version ? `@${version}` : ''}`)
    }
  }

  /**
   * 从静态文件加载文档
   * @param libraryName 库名称
   * @param version 版本号
   * @returns Promise<Document>
   */
  private async loadStaticFile(libraryName: string, version?: string): Promise<Document> {
    // 构建文件名
    const fileName = version ? `${libraryName}-${version}.json` : `${libraryName}-latest.json`

    const filePath = path.join(this.docsDir, fileName)

    // 读取文件
    const content = await fs.readFile(filePath, 'utf-8')
    const doc: Document = JSON.parse(content)

    // 验证校验和
    if (!this.verifyChecksum(doc.content, doc.checksum)) {
      console.warn(`⚠️  文档校验和不匹配: ${fileName}`)
    }

    return doc
  }

  /**
   * 刷新文档缓存
   * @param libraryName 库名称
   * @throws Error 生产环境不支持刷新
   */
  async refreshCache(_libraryName: string): Promise<void> {
    throw new Error('生产环境不支持刷新文档缓存，请在开发环境中更新文档')
  }

  /**
   * 获取库的所有可用版本
   * @param libraryName 库名称
   * @returns Promise<string[]>
   */
  async getAvailableVersions(libraryName: string): Promise<string[]> {
    // 确保已初始化
    if (!this.initialized) {
      await this.initialize()
    }

    // 从缓存中查找该库的所有版本
    const versions = Array.from(this.cache.keys())
      .filter((key) => key.startsWith(`${libraryName}@`))
      .map((key) => key.split('@')[1])
      .filter((version) => version !== 'default')

    return versions
  }

  /**
   * 获取所有已缓存的文档
   * @returns Document[]
   */
  getAllCachedDocuments(): Document[] {
    return Array.from(this.cache.values())
  }

  /**
   * 获取缓存统计信息
   * @returns 缓存统计
   */
  getCacheStats(): {
    totalDocuments: number
    libraries: string[]
    totalSize: number
  } {
    const documents = this.getAllCachedDocuments()
    const libraries = Array.from(new Set(documents.map((doc) => doc.library)))
    const totalSize = documents.reduce((sum, doc) => sum + doc.content.length, 0)

    return {
      totalDocuments: documents.length,
      libraries,
      totalSize
    }
  }

  /**
   * 清除缓存
   * @description 清除所有缓存，重新初始化
   */
  async clearCache(): Promise<void> {
    this.cache.clear()
    this.initialized = false
    console.log('🗑️  文档缓存已清除')
  }

  /**
   * 预热缓存
   * @description 预加载常用文档到缓存
   * @param libraries 库列表
   */
  async warmupCache(libraries: string[]): Promise<void> {
    console.log(`🔥 预热缓存: ${libraries.length} 个库`)

    for (const library of libraries) {
      try {
        await this.getDocument(library)
      } catch (error) {
        console.error(`❌ 预热缓存失败: ${library}`, error)
      }
    }

    console.log('✅ 缓存预热完成')
  }
}

/**
 * 导出类型
 */
export type { Document } from './types'
