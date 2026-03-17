/**
 * Context7 代码校验器
 * @description 校验代码与文档一致性，检测版本不匹配和废弃 API
 */

import type { ICodeValidator, ValidationResult, IDocumentService } from './types'
import { createDocumentService } from './DocumentService'

/**
 * 代码校验器实现
 * @description 提供组件、Store、路由等代码的校验功能
 */
export class CodeValidator implements ICodeValidator {
  private documentService: IDocumentService | null = null

  constructor() {
    this.init()
  }

  private async init(): Promise<void> {
    this.documentService = await createDocumentService()
  }

  private async getService(): Promise<IDocumentService> {
    if (!this.documentService) {
      await this.init()
    }
    return this.documentService!
  }

  /**
   * 验证组件代码
   * @param componentCode 组件代码
   * @param libraryName 库名称（默认 'vue'）
   * @returns Promise<ValidationResult>
   */
  async validateComponent(
    componentCode: string,
    libraryName: string = 'vue'
  ): Promise<ValidationResult> {
    const service = await this.getService()
    return service.validateCode(libraryName, componentCode)
  }

  /**
   * 验证 Pinia Store
   * @param storeCode Store 代码
   * @returns Promise<ValidationResult>
   */
  async validateStore(storeCode: string): Promise<ValidationResult> {
    return this.validateComponent(storeCode, 'pinia')
  }

  /**
   * 验证路由配置
   * @param routerCode 路由代码
   * @returns Promise<ValidationResult>
   */
  async validateRouter(routerCode: string): Promise<ValidationResult> {
    return this.validateComponent(routerCode, 'vue-router')
  }

  /**
   * 验证 Vite 配置
   * @param viteConfigCode Vite 配置代码
   * @returns Promise<ValidationResult>
   */
  async validateViteConfig(viteConfigCode: string): Promise<ValidationResult> {
    return this.validateComponent(viteConfigCode, 'vite')
  }

  /**
   * 验证 TypeScript 代码
   * @param tsCode TypeScript 代码
   * @returns Promise<ValidationResult>
   */
  async validateTypeScript(tsCode: string): Promise<ValidationResult> {
    return this.validateComponent(tsCode, 'typescript')
  }

  /**
   * 批量验证多个文件
   * @param files 文件列表（文件名和代码）
   * @returns Promise<Record<string, ValidationResult>>
   */
  async validateBatch(
    files: Record<string, { code: string; library: string }>
  ): Promise<Record<string, ValidationResult>> {
    const results: Record<string, ValidationResult> = {}

    for (const [fileName, { code, library }] of Object.entries(files)) {
      try {
        results[fileName] = await this.validateComponent(code, library)
      } catch (error) {
        console.error(`Error validating ${fileName}:`, error)
        results[fileName] = {
          isValid: false,
          errors: [
            {
              type: 'syntax_error',
              message: `验证失败: ${error instanceof Error ? error.message : 'Unknown error'}`,
              location: fileName
            }
          ],
          warnings: []
        }
      }
    }

    return results
  }

  /**
   * 生成验证报告
   * @param results 验证结果
   * @returns 验证报告（Markdown 格式）
   */
  generateReport(results: Record<string, ValidationResult>): string {
    let report = '# 代码验证报告\n\n'
    report += `生成时间: ${new Date().toISOString()}\n\n`

    let totalErrors = 0
    let totalWarnings = 0

    for (const [fileName, result] of Object.entries(results)) {
      report += `## ${fileName}\n\n`
      report += `状态: ${result.isValid ? '✅ 通过' : '❌ 失败'}\n\n`

      if (result.errors.length > 0) {
        report += `### 错误 (${result.errors.length})\n\n`
        result.errors.forEach((error, index) => {
          report += `${index + 1}. **${error.type}**: ${error.message}\n`
          if (error.location) {
            report += `   位置: ${error.location}\n`
          }
          if (error.apiName) {
            report += `   API: ${error.apiName}\n`
          }
          report += '\n'
        })
        totalErrors += result.errors.length
      }

      if (result.warnings.length > 0) {
        report += `### 警告 (${result.warnings.length})\n\n`
        result.warnings.forEach((warning, index) => {
          report += `${index + 1}. **${warning.type}**: ${warning.message}\n`
          if (warning.suggestion) {
            report += `   建议: ${warning.suggestion}\n`
          }
          report += '\n'
        })
        totalWarnings += result.warnings.length
      }

      report += '---\n\n'
    }

    report += `## 总结\n\n`
    report += `- 总文件数: ${Object.keys(results).length}\n`
    report += `- 通过文件数: ${Object.values(results).filter((r) => r.isValid).length}\n`
    report += `- 失败文件数: ${Object.values(results).filter((r) => !r.isValid).length}\n`
    report += `- 总错误数: ${totalErrors}\n`
    report += `- 总警告数: ${totalWarnings}\n`

    return report
  }
}

/**
 * 代码校验器单例
 * @description 导出单例，全局使用
 */
export const codeValidator = new CodeValidator()

/**
 * 导出类型
 */
export type { ICodeValidator, ValidationResult } from './types'
