#!/usr/bin/env node
/**
 * 智能体集成恢复脚本
 * 
 * 功能：从上一个检查点恢复执行状态
 * 使用方式：node scripts/resume-integration.cjs
 */

import fs from 'fs';
import path from 'path';

// 文件路径
const STATE_FILE = path.join(__dirname, '../INTEGRATION_STATE.json');
const PROGRESS_FILE = path.join(__dirname, '../INTEGRATION_PROGRESS.json');

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

// 读取状态文件
function readState() {
  if (fs.existsSync(STATE_FILE)) {
    const content = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(content);
  }
  return null;
}

// 读取进度文件
function loadProgress() {
  try {
    const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('⚠️  无法加载进度文件:', error.message);
    return null;
  }
}

// 显示当前状态
function showCurrentState() {
  const state = readState();
  const progress = readProgress();
  
  log('\n' + '='.repeat(60), colors.cyan);
  log('📊 智能体集成状态', colors.bright);
  log('='.repeat(60), colors.cyan);
  
  if (state) {
    log(`\n状态: ${state.status}`, colors.yellow);
    log(`当前阶段: ${state.current_stage || '未开始'}`, colors.blue);
    log(`当前任务: ${state.current_task || '无'}`, colors.blue);
    log(`开始时间: ${state.start_time || '未设置'}`, colors.magenta);
    log(`最后更新: ${state.last_update || '未设置'}`, colors.magenta);
    
    log('\n✅ 已完成的任务:', colors.green);
    if (state.completed_tasks && state.completed_tasks.length > 0) {
      state.completed_tasks.forEach(task => {
        log(`  - ${task}`, colors.green);
      });
    } else {
      log('  无', colors.yellow);
    }
    
    log('\n⏳ 待处理的任务:', colors.yellow);
    if (state.pending_tasks && state.pending_tasks.length > 0) {
      state.pending_tasks.forEach(task => {
        log(`  - ${task}`, colors.yellow);
      });
    } else {
      log('  无', colors.green);
    }
    
    log('\n🏷️ 检查点:', colors.cyan);
    if (state.checkpoints) {
      Object.entries(state.checkpoints).forEach(([stage, tag]) => {
        log(`  ${stage}: ${tag}`, colors.cyan);
      });
    }
  } else {
    log('\n❌ 未找到状态文件', colors.red);
    log('   请先运行: make stage0', colors.yellow);
  }
  
  log('\n' + '='.repeat(60), colors.cyan);
}

// 显示进度信息
function showProgressInfo() {
  const progress = readProgress();
  
  if (progress) {
    log('\n📋 进度信息:', colors.bright);
    log(`  总体完成度: ${calculateCompletion(progress)}%`, colors.yellow);
    
    Object.entries(progress.stages).forEach(([stageId, stage]) => {
      const statusColor = stage.status === 'completed' ? colors.green : (stage.status === 'in_progress' ? colors.yellow : colors.red);
      log(`  ${stage.name}: ${stage.status}`, statusColor);
      
      if (stage.tasks) {
        Object.entries(stage.tasks).forEach(([taskId, task]) => {
          const taskColor = task.status === 'completed' ? colors.green : (task.status === 'in_progress' ? colors.yellow : colors.red);
          log(`    - ${task.name}: ${task.status}`, taskColor);
        });
      }
    });
  }
}

// 计算完成度
function calculateCompletion(progress) {
  if (!progress || !progress.stages) return 0;
  
  const stages = Object.values(progress.stages);
  const totalStages = stages.length;
  const completedStages = stages.filter(s => s.status === 'completed').length;
  
  return Math.round((completedStages / totalStages) * 100);
}

// 显示下一步行动
function showNextSteps() {
  const state = readState();
  const progress = readProgress();
  
  log('\n🚀 下一步行动:', colors.bright);
  
  if (state && state.pending_tasks && state.pending_tasks.length > 0) {
    log(`  待处理任务: ${state.pending_tasks.length} 个`, colors.yellow);
    log(`  当前阶段: ${state.current_stage}`, colors.blue);
    log(`  当前任务: ${state.current_task}`, colors.blue);
    log('\n  建议命令:', colors.cyan);
    log(`    make ${state.current_stage}`, colors.cyan);
  } else if (state && state.completed_tasks && state.completed_tasks.length > 0) {
    log('  所有任务已完成！', colors.green);
    log('\n  建议命令:', colors.cyan);
    log('    make test', colors.cyan);
    log('    make build', colors.cyan);
    log('    make deploy', colors.cyan);
  } else {
    log('  尚未开始任何任务', colors.yellow);
    log('\n  建议命令:', colors.cyan);
    log('    make stage0', colors.cyan);
  }
}

// 显示检查点信息
function showCheckpoints() {
  const state = readState();
  
  if (state && state.checkpoints) {
    log('\n🏷️ 可用的检查点:', colors.bright);
    
    Object.entries(state.checkpoints).forEach(([stage, tag]) => {
      log(`  ${stage}: ${tag}`, colors.cyan);
    });
    
    log('\n  恢复到检查点:', colors.yellow);
    Object.entries(state.checkpoints).forEach(([stage, tag]) => {
      log(`    git checkout ${tag}`, colors.cyan);
    });
  }
}

// 显示使用说明
function showUsage() {
  log('\n📖 使用说明:', colors.bright);
  log('  1. 查看当前状态: node scripts/resume-integration.cjs', colors.cyan);
  log('  2. 继续执行: make [stage]', colors.cyan);
  log('  3. 查看帮助: make help', colors.cyan);
  log('  4. 清理临时文件: make clean', colors.cyan);
}

// 主函数
function main() {
  console.log('\n');
  log('🔄 智能体集成恢复脚本', colors.bright);
  
  showCurrentState();
  showProgressInfo();
  showCheckpoints();
  showNextSteps();
  showUsage();
  
  log('\n');
}

// 运行
main();
