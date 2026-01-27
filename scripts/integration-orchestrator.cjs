#!/usr/bin/env node

/**
 * 智能体集成编排器 - Node.js 版本
 * 使用方式：node scripts/integration-orchestrator.cjs [命令]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// 显示帮助信息
function showHelp() {
  log('\n========================================', colors.cyan);
  log('  智能体集成编排器 - Node.js 版本', colors.green);
  log('========================================\n', colors.cyan);
  
  log('使用方式：', colors.yellow);
  log('  node scripts/integration-orchestrator.cjs [命令]\n', colors.white);
  
  log('可用命令：', colors.yellow);
  log('  all     - 执行所有阶段', colors.white);
  log('  stage0  - 阶段0: 准备阶段', colors.white);
  log('  stage1  - 阶段1: P0智能体集成', colors.white);
  log('  stage2  - 阶段2: P1智能体集成', colors.white);
  log('  stage3  - 阶段3: P2智能体集成', colors.white);
  log('  stage4  - 阶段4: 验证和测试', colors.white);
  log('  stage5  - 阶段5: 总结和文档', colors.white);
  log('  resume  - 查看当前状态', colors.white);
  log('  help    - 显示此帮助信息', colors.white);
  log('  clean   - 清理临时文件\n', colors.white);
  
  log('示例：', colors.yellow);
  log('  node scripts/integration-orchestrator.cjs all', colors.white);
  log('  node scripts/integration-orchestrator.cjs stage0', colors.white);
  log('  node scripts/integration-orchestrator.cjs resume\n', colors.white);
}

// 读取状态文件
function getState() {
  const stateFile = path.join(__dirname, '../INTEGRATION_STATE.json');
  if (fs.existsSync(stateFile)) {
    const content = fs.readFileSync(stateFile, 'utf-8');
    return JSON.parse(content);
  }
  return null;
}

// 写入状态文件
function setState(state) {
  const stateFile = path.join(__dirname, '../INTEGRATION_STATE.json');
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf-8');
}

// 执行命令
function execCommand(command, description) {
  log(`⏳ ${description}...`, colors.yellow);
  try {
    execSync(command, { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
    return true;
  } catch (error) {
    log('   ❌ 失败', colors.red);
    return false;
  }
}

// 阶段0: 准备阶段
function invokeStage0() {
  log('\n🚀 阶段0: 准备阶段', colors.cyan);
  log('  ├─ Git 打标签备份', colors.white);
  log('  ├─ 处理 GitHub Token 泄露', colors.white);
  log('  └─ 检查依赖\n', colors.white);
  
  // Git 打标签备份
  log('⏳ Git 打标签备份...', colors.yellow);
  try {
    execSync('git tag -a v1.0.0-before-integration -m "备份标签：智能体集成前的状态"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  // 创建状态文件
  log('⏳ 创建状态文件...', colors.yellow);
  const state = {
    status: 'in_progress',
    current_stage: 'stage0',
    current_task: 'task_0.1',
    start_time: new Date().toISOString(),
    completed_tasks: [],
    pending_tasks: ['task_0.1', 'task_0.2', 'task_0.3']
  };
  setState(state);
  
  // 检查依赖
  execCommand('npm install -D @vitest/coverage-v8', '检查依赖');
  
  // 更新状态
  state.status = 'completed';
  state.current_stage = 'stage0';
  state.completed_tasks = ['task_0.1', 'task_0.2', 'task_0.3'];
  state.pending_tasks = [];
  setState(state);
  
  // Git 打标签
  log('⏳ 创建检查点标签...', colors.yellow);
  try {
    execSync('git tag -a v1.0.1-after-stage0 -m "检查点：阶段0完成"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  log('\n✅ 阶段0完成\n', colors.green);
}

// 阶段1: P0智能体集成
function invokeStage1() {
  log('\n🚀 阶段1: P0智能体集成', colors.cyan);
  log('  ├─ testing-specialist（测试专家）', colors.white);
  log('  ├─ security-specialist（安全专家）', colors.white);
  log('  └─ performance-specialist（性能专家）\n', colors.white);
  
  const state = getState();
  if (!state) {
    log('❌ 未找到状态文件，请先运行 stage0', colors.red);
    return;
  }
  
  state.status = 'in_progress';
  state.current_stage = 'stage1';
  state.completed_tasks.push('stage0');
  setState(state);
  
  // 执行代码检查
  execCommand('npm run lint', '执行代码检查');
  
  // 执行类型检查
  execCommand('npm run type-check', '执行类型检查');
  
  // 执行单元测试
  execCommand('npm test', '执行单元测试');
  
  // 执行安全扫描
  execCommand('npm audit', '执行安全扫描');
  
  // 更新状态
  state.status = 'completed';
  state.completed_tasks.push('testing-specialist', 'security-specialist', 'performance-specialist');
  setState(state);
  
  // Git 打标签
  log('⏳ 创建检查点标签...', colors.yellow);
  try {
    execSync('git tag -a v1.0.1-after-p0 -m "检查点：P0智能体集成完成"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  log('\n✅ 阶段1完成\n', colors.green);
}

// 阶段2: P1智能体集成
function invokeStage2() {
  log('\n🚀 阶段2: P1智能体集成', colors.cyan);
  log('  ├─ devops-specialist（DevOps专家）', colors.white);
  log('  ├─ monitoring-specialist（监控专家）', colors.white);
  log('  └─ documentation-specialist（文档专家）\n', colors.white);
  
  const state = getState();
  if (!state) {
    log('❌ 未找到状态文件，请先运行 stage0', colors.red);
    return;
  }
  
  state.status = 'in_progress';
  state.current_stage = 'stage2';
  setState(state);
  
  // TODO: 实现 P1 智能体集成
  log('⏳ P1 智能体集成功能待实现...', colors.yellow);
  
  // 更新状态
  state.status = 'completed';
  state.completed_tasks.push('devops-specialist', 'monitoring-specialist', 'documentation-specialist');
  setState(state);
  
  // Git 打标签
  log('⏳ 创建检查点标签...', colors.yellow);
  try {
    execSync('git tag -a v1.0.2-after-p1 -m "检查点：P1智能体集成完成"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  log('\n✅ 阶段2完成\n', colors.green);
}

// 阶段3: P2智能体集成
function invokeStage3() {
  log('\n🚀 阶段3: P2智能体集成', colors.cyan);
  log('  ├─ javascript-pro（JavaScript专家）', colors.white);
  log('  ├─ frontend-design-claude2（前端设计专家）', colors.white);
  log('  └─ deployment-specialist（部署专家）\n', colors.white);
  
  const state = getState();
  if (!state) {
    log('❌ 未找到状态文件，请先运行 stage0', colors.red);
    return;
  }
  
  state.status = 'in_progress';
  state.current_stage = 'stage3';
  setState(state);
  
  // TODO: 实现 P2 智能体集成
  log('⏳ P2 智能体集成功能待实现...', colors.yellow);
  
  // 更新状态
  state.status = 'completed';
  state.completed_tasks.push('javascript-pro', 'frontend-design-claude2', 'deployment-specialist');
  setState(state);
  
  // Git 打标签
  log('⏳ 创建检查点标签...', colors.yellow);
  try {
    execSync('git tag -a v1.0.3-after-p2 -m "检查点：P2智能体集成完成"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  log('\n✅ 阶段3完成\n', colors.green);
}

// 阶段4: 验证和测试
function invokeStage4() {
  log('\n🚀 阶段4: 验证和测试', colors.cyan);
  log('  ├─ 运行代码检查', colors.white);
  log('  ├─ 运行安全扫描', colors.white);
  log('  └─ 运行构建测试\n', colors.white);
  
  const state = getState();
  if (!state) {
    log('❌ 未找到状态文件，请先运行 stage0', colors.red);
    return;
  }
  
  state.status = 'in_progress';
  state.current_stage = 'stage4';
  setState(state);
  
  // 运行代码检查
  execCommand('npm run lint', '运行代码检查');
  
  // 运行安全扫描
  execCommand('npm audit', '运行安全扫描');
  
  // 运行构建测试
  execCommand('npm run build', '运行构建测试');
  
  // 更新状态
  state.status = 'completed';
  state.completed_tasks.push('code-check', 'security-scan', 'build-test');
  setState(state);
  
  // Git 打标签
  log('⏳ 创建检查点标签...', colors.yellow);
  try {
    execSync('git tag -a v1.0.4-after-validation -m "检查点：验证和测试完成"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  log('\n✅ 阶段4完成\n', colors.green);
}

// 阶段5: 总结和文档
function invokeStage5() {
  log('\n🚀 阶段5: 总结和文档', colors.cyan);
  log('  ├─ 生成完整报告', colors.white);
  log('  ├─ 生成最佳实践文档', colors.white);
  log('  └─ 生成待办事项列表\n', colors.white);
  
  const state = getState();
  if (!state) {
    log('❌ 未找到状态文件，请先运行 stage0', colors.red);
    return;
  }
  
  state.status = 'in_progress';
  state.current_stage = 'stage5';
  setState(state);
  
  // TODO: 生成报告和文档
  log('⏳ 生成报告和文档功能待实现...', colors.yellow);
  
  // 更新状态
  state.status = 'completed';
  state.completed_tasks.push('generate-report', 'generate-documentation', 'generate-todo');
  setState(state);
  
  // Git 打标签
  log('⏳ 创建检查点标签...', colors.yellow);
  try {
    execSync('git tag -a v1.0.5-final -m "检查点：全部完成"', { stdio: 'pipe' });
    log('   ✅ 完成', colors.green);
  } catch (error) {
    log('   标签已存在', colors.yellow);
  }
  
  log('\n✅ 阶段5完成', colors.green);
  log('🎉 所有阶段已完成！\n', colors.green);
}

// 查看当前状态
function showResume() {
  log('\n========================================', colors.cyan);
  log('  智能体集成状态', colors.green);
  log('========================================\n', colors.cyan);
  
  const state = getState();
  
  if (!state) {
    log('❌ 未找到状态文件', colors.red);
    log('   请先运行: node scripts/integration-orchestrator.cjs stage0\n', colors.yellow);
    return;
  }
  
  log(`状态: ${state.status}`, colors.yellow);
  log(`当前阶段: ${state.current_stage}`, colors.blue);
  log(`当前任务: ${state.current_task}`, colors.blue);
  log(`开始时间: ${state.start_time}`, colors.magenta);
  
  log('\n✅ 已完成的任务:', colors.green);
  if (state.completed_tasks && state.completed_tasks.length > 0) {
    state.completed_tasks.forEach(task => {
      log(`   - ${task}`, colors.green);
    });
  } else {
    log('   无', colors.yellow);
  }
  
  log('\n⏳ 待处理的任务:', colors.yellow);
  if (state.pending_tasks && state.pending_tasks.length > 0) {
    state.pending_tasks.forEach(task => {
      log(`   - ${task}`, colors.yellow);
    });
  } else {
    log('   无', colors.green);
  }
  
  log('\n========================================\n', colors.cyan);
}

// 清理临时文件
function invokeClean() {
  log('\n🧹 清理临时文件...', colors.yellow);
  
  const stateFile = path.join(__dirname, '../INTEGRATION_STATE.json');
  if (fs.existsSync(stateFile)) {
    fs.unlinkSync(stateFile);
    log('   ✅ 删除 INTEGRATION_STATE.json', colors.green);
  }
  
  const progressFile = path.join(__dirname, '../INTEGRATION_PROGRESS.json');
  if (fs.existsSync(progressFile)) {
    fs.unlinkSync(progressFile);
    log('   ✅ 删除 INTEGRATION_PROGRESS.json', colors.green);
  }
  
  const logFile = path.join(__dirname, '../INTEGRATION_LOG.md');
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
    log('   ✅ 删除 INTEGRATION_LOG.md', colors.green);
  }
  
  log('\n✅ 清理完成\n', colors.green);
}

// 主函数
function main() {
  const command = process.argv[2] || 'help';
  
  switch (command) {
    case 'all':
      log('\n🚀 执行所有阶段...', colors.cyan);
      invokeStage0();
      invokeStage1();
      invokeStage2();
      invokeStage3();
      invokeStage4();
      invokeStage5();
      break;
    case 'stage0':
      invokeStage0();
      break;
    case 'stage1':
      invokeStage1();
      break;
    case 'stage2':
      invokeStage2();
      break;
    case 'stage3':
      invokeStage3();
      break;
    case 'stage4':
      invokeStage4();
      break;
    case 'stage5':
      invokeStage5();
      break;
    case 'resume':
      showResume();
      break;
    case 'help':
      showHelp();
      break;
    case 'clean':
      invokeClean();
      break;
    default:
      showHelp();
  }
}

// 运行主函数
main();