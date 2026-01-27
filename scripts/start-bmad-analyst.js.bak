#!/usr/bin/env node

/**
 * BMAD Analyst 启动脚本
 * 使用 iFlow CLI 启动分析师代理
 */

import { spawn } from 'child_process';
import path from 'path';

// 设置项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 构建 iFlow 命令
const iflowArgs = [
  'mcp',
  'start',
  'bmad-analyst'
];

// 启动 iFlow 进程
const iflowProcess = spawn('iflow', iflowArgs, {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

// 处理进程输出
iflowProcess.stdout.on('data', (data) => {
  console.log(`[BMAD Analyst] ${data}`);
});

iflowProcess.stderr.on('data', (data) => {
  console.error(`[BMAD Analyst Error] ${data}`);
});

// 处理进程退出
iflowProcess.on('close', (code) => {
  console.log(`[BMAD Analyst] 进程退出，退出码: ${code}`);
  process.exit(code);
});

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log('\n[BMAD Analyst] 正在关闭...');
  iflowProcess.kill('SIGINT');
});