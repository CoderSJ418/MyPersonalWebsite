#!/usr/bin/env node

/**
 * 版本管理脚本
 * 自动更新版本号、创建标签、生成变更日志
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

// 读取 package.json
function getPackageJson() {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  return JSON.parse(content);
}

// 获取当前分支
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

// 获取最新提交信息
function getLatestCommit() {
  try {
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    const message = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim();
    const author = execSync('git log -1 --pretty=%an', { encoding: 'utf-8' }).trim();
    const date = execSync('git log -1 --pretty=%ad --date=iso', { encoding: 'utf-8' }).trim();
    
    return { hash, message, author, date };
  } catch (error) {
    return { hash: 'unknown', message: 'unknown', author: 'unknown', date: new Date().toISOString() };
  }
}

// 更新版本号
function bumpVersion(type) {
  const pkg = getPackageJson();
  const versionParts = pkg.version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      versionParts[0]++;
      versionParts[1] = 0;
      versionParts[2] = 0;
      break;
    case 'minor':
      versionParts[1]++;
      versionParts[2] = 0;
      break;
    case 'patch':
      versionParts[2]++;
      break;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
  
  const newVersion = versionParts.join('.');
  pkg.version = newVersion;
  writePackageJson(pkg);
  
  return newVersion;
}

// 创建 Git 标签
function createTag(version) {
  try {
    const tagName = `v${version}`;
    const commit = getLatestCommit();
    const message = `Release ${tagName}\n\n${commit.message}\n\nAuthor: ${commit.author}\nDate: ${commit.date}`;
    
    execSync(`git tag -a ${tagName} -m "${message}"`, { encoding: 'utf-8' });
    console.log(`✅ 创建标签: ${tagName}`);
    return tagName;
  } catch (error) {
    console.error(`❌ 创建标签失败:`, error.message);
    throw error;
  }
}

// 推送标签
function pushTag(tagName) {
  try {
    execSync(`git push origin ${tagName}`, { encoding: 'utf-8' });
    console.log(`✅ 推送标签: ${tagName}`);
  } catch (error) {
    console.error(`❌ 推送标签失败:`, error.message);
    throw error;
  }
}

// 更新变更日志
function updateChangelog(version, type) {
  const commit = getLatestCommit();
  const entry = `## [${version}] - ${new Date().toISOString().split('T')[0]}

### ${type.charAt(0).toUpperCase() + type.slice(1)} Changes

- ${commit.message}
  - Commit: ${commit.hash}
  - Author: ${commit.author}

`;

  let changelog = '';
  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf-8');
  }

  fs.writeFileSync(changelogPath, entry + changelog);
  console.log(`✅ 更新变更日志: ${changelogPath}`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'patch';

  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('❌ 无效的版本类型。使用: major | minor | patch');
    process.exit(1);
  }

  console.log(`🔄 开始版本管理流程 (${type})...\n`);

  try {
    // 1. 更新版本号
    console.log('1️⃣  更新版本号...');
    const newVersion = bumpVersion(type);
    console.log(`   旧版本: ${getPackageJson().version}`);
    console.log(`   新版本: ${newVersion}`);

    // 2. 创建 Git 标签
    console.log('\n2️⃣  创建 Git 标签...');
    const tagName = createTag(newVersion);

    // 3. 更新变更日志
    console.log('\n3️⃣  更新变更日志...');
    updateChangelog(newVersion, type);

    // 4. 提交更改
    console.log('\n4️⃣  提交更改...');
    execSync('git add package.json CHANGELOG.md', { encoding: 'utf-8' });
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { encoding: 'utf-8' });
    console.log(`✅ 提交版本更新`);

    console.log('\n✅ 版本管理流程完成！');
    console.log(`\n📝 下一步操作:`);
    console.log(`   1. 查看: git log --oneline -5`);
    console.log(`   2. 推送: git push && git push --tags`);
    console.log(`   3. 部署: npm run deploy:production`);

  } catch (error) {
    console.error('\n❌ 版本管理流程失败:', error.message);
    process.exit(1);
  }
}

main();