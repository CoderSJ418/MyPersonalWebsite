/**
 * MCP 服务器配置验证脚本
 * 
 * 功能：验证 MCP 服务器环境变量是否正确配置
 * 
 * @example
 * node scripts/verify-mcp.js
 */

console.log('🔍 验证 MCP 服务器配置...\n');

// 检查 GITHUB_TOKEN
const githubToken = process.env.GITHUB_TOKEN;
if (githubToken) {
  console.log('✅ GITHUB_TOKEN: 已配置');
  console.log(`   长度: ${githubToken.length} 字符`);
  console.log(`   前缀: ${githubToken.substring(0, 7)}...`);
} else {
  console.log('❌ GITHUB_TOKEN: 未配置');
  console.log('   请按照 docs/MCP-SETUP-GUIDE.md 中的说明配置');
}

console.log();

// 检查 FIGMA_ACCESS_TOKEN
const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
if (figmaToken) {
  console.log('✅ FIGMA_ACCESS_TOKEN: 已配置');
  console.log(`   长度: ${figmaToken.length} 字符`);
  console.log(`   前缀: ${figmaToken.substring(0, 7)}...`);
} else {
  console.log('❌ FIGMA_ACCESS_TOKEN: 未配置');
  console.log('   请按照 docs/MCP-SETUP-GUIDE.md 中的说明配置');
}

console.log();

// 总结
if (githubToken && figmaToken) {
  console.log('🎉 所有 MCP 服务器配置完成！');
  console.log('\n下一步：');
  console.log('  npm install js-yaml');
  console.log('  node scripts/automation-controller.js "添加一个测试组件"');
} else {
  console.log('⚠️  部分配置缺失，请补充配置后重试');
  process.exit(1);
}