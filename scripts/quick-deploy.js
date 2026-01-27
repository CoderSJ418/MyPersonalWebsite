#!/usr/bin/env node

/**
 * 快速部署脚本
 * 本地快速部署到 Vercel 或 Cloudflare
 */

import { execSync } from 'child_process';

const TARGET = process.env.DEPLOY_TARGET || 'vercel'; // vercel | cloudflare
const ENV = process.env.DEPLOY_ENV || 'production'; // production | staging | preview

function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    const output = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
    console.log(`✅ ${description} 完成\n`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error.message);
    throw error;
  }
}

function checkPrerequisites() {
  console.log('🔍 检查部署前置条件...\n');

  // 检查 Git 状态
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
      console.warn('⚠️  工作区有未提交的更改');
      console.warn('   建议先提交更改: git add . && git commit -m "..."');
    } else {
      console.log('✅ Git 工作区干净');
    }
  } catch (error) {
    console.warn('⚠️  无法检查 Git 状态');
  }

  // 检查依赖
  console.log('✅ 检查依赖...');
  runCommand('npm ci', '安装依赖');

  // 运行测试
  console.log('✅ 运行测试...');
  runCommand('npm run test', '单元测试');

  // 运行构建
  console.log('✅ 运行构建...');
  runCommand('npm run build', '构建生产版本');

  console.log('✅ 所有前置条件检查通过\n');
}

function deployToVercel() {
  console.log('🚀 开始部署到 Vercel...\n');

  try {
    // 检查 Vercel CLI
    runCommand('vercel --version', '检查 Vercel CLI');

    // 部署
    let command = 'vercel --prod';
    if (ENV === 'staging') {
      command = 'vercel';
    } else if (ENV === 'preview') {
      command = 'vercel';
    }

    const url = runCommand(command, `部署到 Vercel (${ENV})`);
    
    console.log('🎉 Vercel 部署成功！');
    console.log(`📡 部署地址: ${url.trim()}`);

    // 运行健康检查
    if (process.env.RUN_HEALTH_CHECK !== 'false') {
      console.log('\n🏥 运行健康检查...');
      runCommand(`node scripts/deploy-health-check.js TARGET_URL=${url.trim()}`, '健康检查');
    }

  } catch (error) {
    console.error('❌ Vercel 部署失败:', error.message);
    throw error;
  }
}

function deployToCloudflare() {
  console.log('🚀 开始部署到 Cloudflare Workers...\n');

  try {
    // 检查 Wrangler CLI
    runCommand('wrangler --version', '检查 Wrangler CLI');

    // 部署
    const command = ENV === 'production' 
      ? 'wrangler publish --env production'
      : 'wrangler publish --env staging';

    runCommand(command, `部署到 Cloudflare Workers (${ENV})`);

    console.log('🎉 Cloudflare Workers 部署成功！');

  } catch (error) {
    console.error('❌ Cloudflare Workers 部署失败:', error.message);
    throw error;
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           MyPersonalWebsite 快速部署工具                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log(`📋 部署配置:`);
  console.log(`   目标平台: ${TARGET}`);
  console.log(`   部署环境: ${ENV}`);
  console.log(`   健康检查: ${process.env.RUN_HEALTH_CHECK !== 'false' ? '启用' : '禁用'}\n`);

  try {
    // 检查前置条件
    checkPrerequisites();

    // 部署
    if (TARGET === 'vercel') {
      deployToVercel();
    } else if (TARGET === 'cloudflare') {
      deployToCloudflare();
    } else {
      throw new Error(`不支持的部署目标: ${TARGET}`);
    }

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║              🎉 部署流程完成！                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n╔══════════════════════════════════════════════════════════╗');
    console.error('║              ❌ 部署失败！                              ║');
    console.error('╚══════════════════════════════════════════════════════════╝\n');
    
    console.error('💡 故障排查建议:');
    console.error('   1. 检查网络连接');
    console.error('   2. 验证部署平台凭据');
    console.error('   3. 查看构建日志');
    console.error('   4. 运行 npm run build 本地测试');
    
    process.exit(1);
  }
}

main();