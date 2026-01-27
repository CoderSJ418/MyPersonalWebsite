# Context7 文档存储目录

## 📚 说明

此目录用于存储 Context7 文档服务的静态文档文件。

## 📁 目录结构

```
public/docs/
├── README.md              # 本文件
├── index.json             # 文档索引（自动生成）
├── vue-3.4.15.json        # Vue 3.4.15 文档
├── pinia-2.1.7.json       # Pinia 2.1.7 文档
├── vue-router-4.2.5.json  # Vue Router 4.2.5 文档
└── vite-5.0.12.json       # Vite 5.0.12 文档
```

## 🔧 使用方式

### 开发环境

1. 使用 `DevDocumentService` 通过 MCP 获取官方文档
2. 自动生成静态文件到此目录
3. 文档文件格式：`{library}-{version}.json`

### 生产环境

1. 使用 `ProdDocumentService` 从静态文件加载文档
2. 文档加载到内存缓存，提供高性能访问
3. 无需网络请求，确保稳定性

## 📄 文档格式

每个文档文件包含以下内容：

```json
{
  "library": "vue",
  "version": "3.4.15",
  "content": "官方文档内容（Markdown 格式）",
  "examples": {
    "reactive": "const state = reactive({ count: 0 })",
    "computed": "const doubled = computed(() => state.count * 2)"
  },
  "apis": [
    {
      "name": "reactive",
      "signature": "reactive<T extends object>(target: T): UnwrapRef<T>",
      "description": "返回对象的响应式代理",
      "deprecated": false
    }
  ],
  "lastUpdated": "2026-01-21T10:00:00Z",
  "checksum": "abc123..."
}
```

## 🔄 更新文档

### 自动更新（推荐）

在开发环境中，`DevDocumentService` 会自动获取最新文档并生成静态文件。

### 手动更新

```bash
# 使用脚本更新所有文档
npm run update-docs
```

## ⚠️ 注意事项

1. **不要手动编辑**此目录下的 JSON 文件，它们由 `DevDocumentService` 自动生成
2. **生产环境**使用静态文件，确保在部署前已生成所有需要的文档
3. **版本一致性**：文档版本应与项目依赖版本保持一致
4. **校验和验证**：每次加载文档时会验证校验和，确保文件完整性

## 📊 缓存统计

查看当前文档缓存统计：

```typescript
import { documentService } from '@/services/context7'

const stats = documentService.getCacheStats()
console.log(stats)
// {
//   totalDocuments: 4,
//   libraries: ['vue', 'pinia', 'vue-router', 'vite'],
//   totalSize: 123456
// }
```

## 🔍 故障排查

### 文档未找到

如果遇到"文档未找到"错误：

1. 检查 `public/docs/` 目录是否存在
2. 检查文档文件名格式是否正确（`{library}-{version}.json`）
3. 在开发环境中运行 `npm run update-docs` 重新生成文档

### 校验和不匹配

如果遇到"文档校验和不匹配"警告：

1. 文件可能已损坏，需要重新生成
2. 在开发环境中运行 `npm run update-docs` 重新生成文档

## 📝 维护

- **定期更新**：建议在依赖版本升级后更新文档
- **清理旧文档**：删除不再使用的旧版本文档文件
- **验证完整性**：定期运行文档验证脚本

## 📖 相关文档

- [Context7 集成架构设计](../../docs/technical-architecture.md)
- [DocumentService API 文档](../../src/services/context7/DocumentService.ts)
- [代码校验器使用指南](../../src/services/context7/CodeValidator.ts)

---

**最后更新**: 2026年1月21日  
**维护者**: 开发团队