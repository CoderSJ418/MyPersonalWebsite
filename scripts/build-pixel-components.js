#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const COMPONENTS_DIR = path.join(__dirname, '../src/components/pixel')
const DIST_DIR = path.join(__dirname, '../dist/pixel-components')
const DOCS_DIR = path.join(__dirname, '../docs')

// 创建构建目录
function createDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
  }
}

// 复制组件文件
function copyComponents() {
  console.log('📋 复制组件文件...')
  
  const components = [
    'index.ts',
    'PixelButton.vue',
    'PixelCard.vue',
    'PixelCodeBlock.vue',
    'PixelNavbar.vue',
    'PixelInput.vue',
    'PixelTag.vue',
    'PixelTabs.vue',
    'PixelLayout.vue',
    'PixelGrid.vue',
    'PixelSpacing.vue',
    'PixelHeading.vue',
    'PixelList.vue',
    'PixelDivider.vue',
    'PixelIcon.vue',
    'PixelBadge.vue'
  ]
  
  components.forEach(file => {
    const srcPath = path.join(COMPONENTS_DIR, file)
    const destPath = path.join(DIST_DIR, file)
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`  ✅ ${file}`)
    } else {
      console.warn(`  ⚠️  ${file} 不存在`)
    }
  })
}

// 复制示例文件
function copyExamples() {
  console.log('📋 复制示例文件...')
  
  const examplesDir = path.join(COMPONENTS_DIR, 'examples')
  const distExamplesDir = path.join(DIST_DIR, 'examples')
  
  if (fs.existsSync(examplesDir)) {
    if (!fs.existsSync(distExamplesDir)) {
      fs.mkdirSync(distExamplesDir, { recursive: true })
    }
    
    const files = fs.readdirSync(examplesDir)
    files.forEach(file => {
      const srcPath = path.join(examplesDir, file)
      const destPath = path.join(distExamplesDir, file)
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath)
        console.log(`  ✅ examples/${file}`)
      }
    })
  }
}

// 复制文档文件
function copyDocs() {
  console.log('📋 复制文档文件...')
  
  const docFiles = [
    'pixel-components.md',
    'pixel-components-usage.md',
    'pixel-components-api.md'
  ]
  
  docFiles.forEach(file => {
    const srcPath = path.join(DOCS_DIR, file)
    const destPath = path.join(DIST_DIR, file)
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`  ✅ ${file}`)
    } else {
      console.warn(`  ⚠️  ${file} 不存在`)
    }
  })
}

// 生成构建报告
function generateReport() {
  console.log('📋 生成构建报告...')
  
  const report = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    components: [
      'PixelButton',
      'PixelCard',
      'PixelCodeBlock',
      'PixelNavbar',
      'PixelInput',
      'PixelTag',
      'PixelTabs',
      'PixelLayout',
      'PixelGrid',
      'PixelSpacing',
      'PixelHeading',
      'PixelList',
      'PixelDivider',
      'PixelIcon',
      'PixelBadge'
    ],
    features: [
      '完整的像素风格组件库',
      '响应式设计',
      '可访问性支持',
      '性能优化',
      '完整的文档'
    ],
    statistics: {
      components: 15,
      linesOfCode: estimateLinesOfCode(),
      files: 20
    }
  }
  
  const reportPath = path.join(DIST_DIR, 'BUILD_REPORT.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`  ✅ BUILD_REPORT.json`)
  
  return report
}

// 估计代码行数
function estimateLinesOfCode() {
  let totalLines = 0
  
  const components = [
    'index.ts',
    'PixelButton.vue',
    'PixelCard.vue',
    'PixelCodeBlock.vue',
    'PixelNavbar.vue',
    'PixelInput.vue',
    'PixelTag.vue',
    'PixelTabs.vue',
    'PixelLayout.vue',
    'PixelGrid.vue',
    'PixelSpacing.vue',
    'PixelHeading.vue',
    'PixelList.vue',
    'PixelDivider.vue',
    'PixelIcon.vue',
    'PixelBadge.vue'
  ]
  
  components.forEach(file => {
    const filePath = path.join(COMPONENTS_DIR, file)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      totalLines += content.split('\n').length
    }
  })
  
  return totalLines
}

// 生成构建脚本
function generateBuildScript() {
  console.log('📋 生成构建脚本...')
  
  const buildScript = `#!/bin/bash
# 像素风格组件库构建脚本

echo "📦 开始构建像素风格组件库..."

# 检查依赖
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm，请先安装 Node.js"
    exit 1
fi

# 安装依赖
echo "🔧 安装依赖..."
npm install

# 运行测试
echo "🧪 运行测试..."
npm run test:run

# 构建组件库
echo "🏗️  构建组件库..."
node scripts/build-pixel-components.js

# 生成文档
echo "📝 生成文档..."
npm run docs:generate

# 压缩构建产物
echo "📦 压缩构建产物..."
tar -czf pixel-components-v\$(node -p "require('./package.json').version").tar.gz dist/pixel-components

echo "✅ 构建完成！"
echo "📦 构建产物: dist/pixel-components/"
echo "📄 文档: docs/pixel-components-*.md"
`
  
  const scriptPath = path.join(DIST_DIR, 'build.sh')
  fs.writeFileSync(scriptPath, buildScript)
  fs.chmodSync(scriptPath, '755')
  console.log(`  ✅ build.sh`)
}

// 生成安装脚本
function generateInstallScript() {
  console.log('📋 生成安装脚本...')
  
  const installScript = `#!/bin/bash
# 像素风格组件库安装脚本

echo "📦 开始安装像素风格组件库..."

# 检查是否在项目目录中
if [ ! -f "package.json" ]; then
    echo "❌ 未找到 package.json，请在项目根目录中运行此脚本"
    exit 1
fi

# 检查是否已安装组件库
if [ -d "src/components/pixel" ]; then
    echo "⚠️  组件库已存在，是否覆盖？(y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "❌ 安装已取消"
        exit 0
    fi
fi

# 复制组件库
echo "📋 复制组件库文件..."
cp -r dist/pixel-components/* src/components/

# 复制文档
echo "📋 复制文档..."
cp dist/pixel-components/*.md docs/

# 注册组件
echo "🔧 注册组件..."
if [ -f "main.ts" ]; then
    if ! grep -q "pixelComponents" main.ts; then
        sed -i "1i import * as pixelComponents from '@/components/pixel'" main.ts
        sed -i "2i const app = createApp(App)" main.ts
        sed -i "3i Object.entries(pixelComponents).forEach(([name, component]) => {" main.ts
        sed -i "4i   app.component(name, component)" main.ts
        sed -i "5i })" main.ts
    fi
fi

echo "✅ 安装完成！"
echo "📖 使用文档: docs/pixel-components-usage.md"
`
  
  const scriptPath = path.join(DIST_DIR, 'install.sh')
  fs.writeFileSync(scriptPath, installScript)
  fs.chmodSync(scriptPath, '755')
  console.log(`  ✅ install.sh`)
}

// 主函数
function main() {
  console.log('🚀 开始构建像素风格组件库...')
  
  try {
    createDistDir()
    copyComponents()
    copyExamples()
    copyDocs()
    const report = generateReport()
    generateBuildScript()
    generateInstallScript()
    
    console.log('\n✅ 构建完成！')
    console.log('\n📦 构建产物:')
    console.log(`  ${DIST_DIR}`)
    console.log('\n📄 文档:')
    console.log(`  ${path.join(DIST_DIR, 'pixel-components-usage.md')}`)
    console.log(`  ${path.join(DIST_DIR, 'pixel-components-api.md')}`)
    console.log('\n🔧 工具脚本:')
    console.log(`  ${path.join(DIST_DIR, 'build.sh')}`)
    console.log(`  ${path.join(DIST_DIR, 'install.sh')}`)
    
    console.log('\n📊 统计信息:')
    console.log(`  组件数量: ${report.statistics.components}`)
    console.log(`  代码行数: ${report.statistics.linesOfCode}`)
    console.log(`  文件数量: ${report.statistics.files}`)
    
  } catch (error) {
    console.error('\n❌ 构建失败:', error.message)
    process.exit(1)
  }
}

// 运行构建
main()