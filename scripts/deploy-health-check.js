#!/usr/bin/env node

/**
 * 部署健康检查脚本
 * 在部署后验证网站是否正常运行
 */

import https from 'https';
import http from 'http';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';
const TIMEOUT = 30000; // 30秒超时
const ENDPOINTS = [
  '/',
  '/projects',
  '/skills',
  '/blog',
  '/contact'
];

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    const req = protocol.get(url, { timeout: TIMEOUT }, (res) => {
      const duration = Date.now() - startTime;
      
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({
          url,
          status: res.statusCode,
          duration,
          success: true
        });
      } else {
        reject({
          url,
          status: res.statusCode,
          duration,
          success: false
        });
      }
    });

    req.on('error', (error) => {
      reject({
        url,
        error: error.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        url,
        error: 'Timeout',
        success: false
      });
    });
  });
}

async function runHealthChecks() {
  console.log('🏥 开始部署健康检查...');
  console.log(`📡 目标地址: ${TARGET_URL}\n`);

  const results = [];
  let failures = 0;

  for (const endpoint of ENDPOINTS) {
    const url = `${TARGET_URL}${endpoint}`;
    try {
      const result = await checkUrl(url);
      results.push(result);
      console.log(`✅ ${endpoint} - ${result.status} (${result.duration}ms)`);
    } catch (error) {
      failures++;
      results.push(error);
      console.log(`❌ ${endpoint} - ${error.status || error.error}`);
    }
  }

  console.log('\n📊 健康检查摘要:');
  console.log(`   总检查数: ${ENDPOINTS.length}`);
  console.log(`   成功: ${ENDPOINTS.length - failures}`);
  console.log(`   失败: ${failures}`);

  if (failures > 0) {
    console.log('\n⚠️  健康检查失败！部署可能存在问题。');
    process.exit(1);
  } else {
    console.log('\n✅ 所有健康检查通过！部署成功。');
    process.exit(0);
  }
}

runHealthChecks().catch(error => {
  console.error('❌ 健康检查执行失败:', error);
  process.exit(1);
});