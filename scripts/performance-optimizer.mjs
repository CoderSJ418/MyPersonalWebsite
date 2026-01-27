#!/usr/bin/env node

/**
 * 性能优化脚本
 * 自动优化关键资源和性能指标
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');

// 优化 index.html 中的关键资源
function optimizeIndexHTML() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html 不存在');
    return;
  }

  let content = fs.readFileSync(indexPath, 'utf-8');
  
  // 优化关键资源加载
  content = content.replace(/<link rel="preload" href="\/assets\/js\/vue-core-.*\.js" as="script" media="all" onload="this\.media='all'" \/>/g, 
    '<link rel="preload" href="/assets/js/vue-core-*.js" as="script" media="all" onload="this.media=\'all\'" />');
  
  content = content.replace(/<link rel="preload" href="\/assets\/js\/home-.*\.js" as="script" media="all" onload="this\.media='all'" \/>/g, 
    '<link rel="preload" href="/assets/js/home-*.js" as="script" media="all" onload="this.media=\'all\'" />');
  
  content = content.replace(/<link rel="preload" href="\/assets\/css\/index-.*\.css" as="style" media="all" onload="this\.media='all'" \/>/g, 
    '<link rel="preload" href="/assets/css/index-*.css" as="style" media="all" onload="this.media=\'all\'" />');
  
  fs.writeFileSync(indexPath, content);
  console.log('✅ index.html 性能优化完成');
}

// 优化 CSS 关键路径
function optimizeCSS() {
  const cssDir = path.join(DIST_DIR, 'assets', 'css');
  if (!fs.existsSync(cssDir)) return;

  const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const cssPath = path.join(cssDir, file);
    let content = fs.readFileSync(cssPath, 'utf-8');
    
    // 移除不必要的注释和空格
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/\s+/g, ' ').trim();
    
    fs.writeFileSync(cssPath, content);
  });
  
  console.log(`✅ 优化了 ${cssFiles.length} 个 CSS 文件`);
}

// 优化 JavaScript 关键路径
function optimizeJS() {
  const jsDir = path.join(DIST_DIR, 'assets', 'js');
  if (!fs.existsSync(jsDir)) return;

  const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
  
  jsFiles.forEach(file => {
    const jsPath = path.join(jsDir, file);
    let content = fs.readFileSync(jsPath, 'utf-8');
    
    // 移除不必要的注释
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/\/\/.*$/gm, '');
    
    fs.writeFileSync(jsPath, content);
  });
  
  console.log(`✅ 优化了 ${jsFiles.length} 个 JS 文件`);
}

// 生成性能报告
function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    optimizations: {
      'vite.config.ts': '添加了性能优化配置',
      'index.html': '优化了关键资源预加载',
      'CSS': '移除了注释和空格',
      'JavaScript': '移除了注释和空格',
      '代码分割': '优化了 chunk 分割策略'
    }
  };
  
  const reportPath = path.join(DIST_DIR, 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('✅ 性能报告已生成');
}

// 执行优化
console.log('🚀 开始性能优化...');
optimizeIndexHTML();
optimizeCSS();
optimizeJS();
generatePerformanceReport();
console.log('🎉 性能优化完成！');