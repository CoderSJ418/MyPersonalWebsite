/**
 * 自动化控制器 - MyPersonalWebsite
 * 
 * 功能：
 * 1. 解析自然语言目标
 * 2. 分配给合适的 Agent
 * 3. 协调多 Agent 协作
 * 4. 自动化执行开发任务
 * 
 * @example
 * node scripts/automation-controller.js "添加一个暗黑模式切换功能"
 * node scripts/automation-controller.js --help
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

// ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 自动化控制器类
 * 
 * 负责协调整个自动化开发流程，包括自然语言解析、任务编排、Agent 协作和执行
 */
class AutomationController {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.config = this.loadConfig();
    this.agentRegistry = this.loadAgentRegistry();
    this.workflowRegistry = this.loadWorkflowRegistry();
    this.executionLog = [];
  }

  /**
   * 加载项目配置
   * 
   * @returns {Object} 项目配置对象
   */
  loadConfig() {
    const configPath = path.join(this.projectRoot, '.bmad-config.yaml');
    if (fs.existsSync(configPath)) {
      try {
        let config = yaml.load(fs.readFileSync(configPath, 'utf8'));
        // 替换占位符
        config = this.replacePlaceholders(config);
        return config;
      } catch (error) {
        console.warn(`⚠️  无法加载配置文件: ${error.message}`);
        return this.getDefaultConfig();
      }
    }
    return this.getDefaultConfig();
  }

  /**
   * 替换配置中的占位符
   * 
   * @param {Object} config - 配置对象
   * @returns {Object} 替换后的配置对象
   */
  replacePlaceholders(config) {
    const replaceInObject = (obj) => {
      if (typeof obj === 'string') {
        return obj.replace('{project-root}', this.projectRoot);
      } else if (Array.isArray(obj)) {
        return obj.map(replaceInObject);
      } else if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = replaceInObject(value);
        }
        return result;
      }
      return obj;
    };
    
    return replaceInObject(config);
  }

  /**
   * 获取默认配置
   * 
   * @returns {Object} 默认配置对象
   */
  getDefaultConfig() {
    return {
      project: {
        name: 'MyPersonalWebsite',
        type: 'personal-portfolio'
      },
      paths: {
        docs: path.join(this.projectRoot, 'docs'),
        stories: path.join(this.projectRoot, 'docs/stories'),
        output: path.join(this.projectRoot, 'docs')
      },
      agents: {
        primary: ['bmad:analyst', 'bmad:architect', 'bmad:dev', 'bmad:tea'],
        specialized: ['frontend-design-claude2', 'javascript-pro', 'frontend-tester']
      }
    };
  }

  /**
   * 加载 Agent 注册表
   * 
   * @returns {Array} Agent 列表
   */
  loadAgentRegistry() {
    const agentManifestPath = path.join(this.projectRoot, '../bmad/_cfg/agent-manifest.csv');
    if (fs.existsSync(agentManifestPath)) {
      try {
        const content = fs.readFileSync(agentManifestPath, 'utf8');
        return this.parseCSV(content);
      } catch (error) {
        console.warn(`⚠️  无法加载 Agent 注册表: ${error.message}`);
        return [];
      }
    }
    return [];
  }

  /**
   * 加载工作流注册表
   * 
   * @returns {Array} 工作流列表
   */
  loadWorkflowRegistry() {
    const workflowManifestPath = path.join(this.projectRoot, '../bmad/_cfg/workflow-manifest.csv');
    if (fs.existsSync(workflowManifestPath)) {
      try {
        const content = fs.readFileSync(workflowManifestPath, 'utf8');
        return this.parseCSV(content);
      } catch (error) {
        console.warn(`⚠️  无法加载工作流注册表: ${error.message}`);
        return [];
      }
    }
    return [];
  }

  /**
   * 解析 CSV 文件
   * 
   * @param {string} content - CSV 内容
   * @returns {Array} 解析后的数据数组
   */
  parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return obj;
    });
  }

  /**
   * 记录执行日志
   * 
   * @param {string} level - 日志级别（INFO, SUCCESS, WARNING, ERROR）
   * @param {string} message - 日志消息
   */
  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.executionLog.push(logEntry);
    
    const icons = {
      INFO: 'ℹ️',
      SUCCESS: '✅',
      WARNING: '⚠️',
      ERROR: '❌'
    };
    
    console.log(`${icons[level] || 'ℹ️'} ${message}`);
  }

  /**
   * 解析自然语言目标
   * 
   * @param {string} goal - 自然语言目标
   * @returns {Object} 解析结果
   */
  parseNaturalLanguageGoal(goal) {
    this.log('INFO', `解析自然语言目标: "${goal}"`);
    
    // 目标类型识别
    const goalTypes = {
      '新功能': /添加|新增|实现|开发|创建|制作/,
      '优化': /优化|改进|提升|加速|增强/,
      '修复': /修复|解决|处理|修正/,
      '重构': /重构|改写|优化代码/,
      '设计': /设计|美化|改版|UI|界面/,
      '测试': /测试|验证|检查|审查/
    };

    for (const [type, pattern] of Object.entries(goalTypes)) {
      if (pattern.test(goal)) {
        this.log('SUCCESS', `目标类型识别: ${type}`);
        return {
          type,
          goal,
          confidence: 0.9,
          requires: this.getRequiredAgents(type)
        };
      }
    }

    // 默认返回新功能类型
    this.log('WARNING', '无法识别目标类型，默认为新功能');
    return {
      type: '新功能',
      goal,
      confidence: 0.7,
      requires: ['bmad:analyst', 'bmad:architect', 'bmad:dev', 'bmad:tea']
    };
  }

  /**
   * 获取所需的 Agent 列表
   * 
   * @param {string} goalType - 目标类型
   * @returns {Array} Agent 列表
   */
  getRequiredAgents(goalType) {
    const agentMap = {
      '新功能': ['bmad:analyst', 'bmad:architect', 'bmad:dev', 'bmad:tea'],
      '优化': ['bmad:analyst', 'bmad:dev', 'bmad:tea'],
      '修复': ['bmad:dev', 'bmad:tea'],
      '重构': ['bmad:architect', 'bmad:dev', 'bmad:tea'],
      '设计': ['bmad:ux-expert', 'frontend-design-claude2', 'bmad:dev'],
      '测试': ['bmad:tea', 'frontend-tester']
    };
    return agentMap[goalType] || ['bmad:analyst', 'bmad:dev'];
  }

  /**
   * 生成任务序列
   * 
   * @param {Object} parsedGoal - 解析后的目标
   * @returns {Array} 任务序列
   */
  generateTaskSequence(parsedGoal) {
    const sequences = {
      '新功能': [
        { name: '需求分析', agent: 'bmad:analyst', workflow: 'brainstorm-project', description: '分析用户需求，识别技术选型' },
        { name: '架构设计', agent: 'bmad:architect', workflow: 'solution-architecture', description: '设计技术架构和系统设计' },
        { name: '技术规格', agent: 'bmad:architect', workflow: 'tech-spec', description: '生成详细的技术规格说明' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story', description: '实现代码功能' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework', description: '测试和验证功能' }
      ],
      '优化': [
        { name: '需求分析', agent: 'bmad:analyst', workflow: 'brainstorm-project', description: '分析优化需求' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story', description: '实现优化代码' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework', description: '验证优化效果' }
      ],
      '修复': [
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story', description: '修复问题' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework', description: '验证修复' }
      ],
      '重构': [
        { name: '架构设计', agent: 'bmad:architect', workflow: 'solution-architecture', description: '设计重构方案' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story', description: '执行重构' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework', description: '验证重构' }
      ],
      '设计': [
        { name: 'UX 设计', agent: 'bmad:ux-expert', workflow: 'ux-spec', description: '设计用户体验' },
        { name: '视觉设计', agent: 'frontend-design-claude2', workflow: 'visual-design', description: '实现视觉设计' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story', description: '实现设计' }
      ],
      '测试': [
        { name: '测试框架', agent: 'bmad:tea', workflow: 'testarch-framework', description: '设置测试框架' },
        { name: '前端测试', agent: 'frontend-tester', workflow: 'frontend-test', description: '执行前端测试' }
      ]
    };

    return sequences[parsedGoal.type] || sequences['新功能'];
  }

  /**
   * 执行任务
   * 
   * @param {Object} task - 任务对象
   * @returns {Promise<Object>} 执行结果
   */
  async executeTask(task) {
    try {
      this.log('INFO', `执行任务: ${task.name}`);
      this.log('INFO', `  Agent: ${task.agent}`);
      this.log('INFO', `  Workflow: ${task.workflow}`);
      this.log('INFO', `  描述: ${task.description}`);
      
      // 这里应该调用对应的 Agent 和 Workflow
      // 目前返回模拟结果
      // TODO: 集成真实的 BMAD Agent 调用
      
      // 模拟执行时间
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.log('SUCCESS', `任务完成: ${task.name}`);
      
      return {
        success: true,
        task: task.name,
        agent: task.agent,
        workflow: task.workflow,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('ERROR', `任务失败: ${task.name} - ${error.message}`);
      return {
        success: false,
        task: task.name,
        error: error.message
      };
    }
  }

  /**
   * 生成报告
   * 
   * @param {Object} goal - 目标对象
   * @param {Array} results - 执行结果数组
   */
  generateReport(goal, results) {
    const reportPath = path.join(this.config.paths.output, `automation-report-${Date.now()}.md`);
    
    const report = `# 自动化开发报告

## 目标
- **类型**: ${goal.type}
- **描述**: ${goal.goal}
- **置信度**: ${goal.confidence}

## 执行结果

| 任务 | Agent | Workflow | 状态 | 时间 |
|------|-------|----------|------|------|
${results.map(r => `| ${r.task} | ${r.agent || '-'} | ${r.workflow || '-'} | ${r.success ? '✅' : '❌'} | ${r.timestamp || '-'} |`).join('\n')}

## 总结
- 总任务数: ${results.length}
- 成功: ${results.filter(r => r.success).length}
- 失败: ${results.filter(r => !r.success).length}

## 执行日志

${this.executionLog.map(log => `- [${log.timestamp}] ${log.level}: ${log.message}`).join('\n')}

---
生成时间: ${new Date().toLocaleString('zh-CN')}
`;

    fs.writeFileSync(reportPath, report, 'utf8');
    this.log('SUCCESS', `报告已生成: ${reportPath}`);
  }

  /**
   * 执行自动化流程
   * 
   * @param {string} goal - 自然语言目标
   * @returns {Promise<Array>} 执行结果数组
   */
  async execute(goal) {
    console.log('🚀 启动自动化开发流程...\n');

    // 1. 解析目标
    const parsedGoal = this.parseNaturalLanguageGoal(goal);
    console.log(`📋 目标类型: ${parsedGoal.type}`);
    console.log(`🤖 需要的 Agents: ${parsedGoal.requires.join(', ')}\n`);

    // 2. 生成任务序列
    const taskSequence = this.generateTaskSequence(parsedGoal);
    console.log(`📝 任务序列 (${taskSequence.length} 个任务):`);
    taskSequence.forEach((task, i) => {
      console.log(`   ${i + 1}. ${task.name} (${task.agent})`);
      console.log(`      ${task.description}`);
    });
    console.log();

    // 3. 执行任务序列
    const results = [];
    for (const task of taskSequence) {
      console.log();
      const result = await this.executeTask(task);
      results.push(result);
      
      if (!result.success) {
        this.log('ERROR', '任务失败，停止执行');
        break;
      }
    }

    // 4. 生成报告
    this.generateReport(parsedGoal, results);

    return results;
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
自动化控制器 - MyPersonalWebsite

用法:
  node scripts/automation-controller.js "<自然语言目标>"
  node scripts/automation-controller.js --help

示例:
  node scripts/automation-controller.js "添加一个暗黑模式切换功能"
  node scripts/automation-controller.js "优化首页加载性能"
  node scripts/automation-controller.js "修复登录页面的 Bug"

功能:
  1. 解析自然语言目标
  2. 分配给合适的 Agent
  3. 协调多 Agent 协作
  4. 自动化执行开发任务

支持的 Agent:
  - bmad:analyst (需求分析)
  - bmad:architect (架构设计)
  - bmad:dev (代码实现)
  - bmad:tea (测试验证)
  - bmad:ux-expert (用户体验)
  - frontend-design-claude2 (前端设计)
  - javascript-pro (JavaScript 专家)
  - frontend-tester (前端测试)

支持的目标类型:
  - 新功能: 添加、新增、实现、开发、创建、制作
  - 优化: 优化、改进、提升、加速、增强
  - 修复: 修复、解决、处理、修正
  - 重构: 重构、改写、优化代码
  - 设计: 设计、美化、改版、UI、界面
  - 测试: 测试、验证、检查、审查

输出:
  - 自动化报告 (docs/automation-report-{timestamp}.md)
  - 执行日志 (包含在报告中)
  - 任务完成状态

配置文件:
  - .bmad-config.yaml (项目配置)
  - ../bmad/_cfg/agent-manifest.csv (Agent 清单)
  - ../bmad/_cfg/workflow-manifest.csv (工作流清单)

文档:
  - docs/MCP-SETUP-GUIDE.md (MCP 配置指南)
  - docs/automation-guide.md (自动化指南)

更多信息，请访问项目文档。
`);
  }
}

// CLI 接口
const args = process.argv.slice(2);

// 计算项目根目录（scripts 目录的上一级）
const projectRoot = path.dirname(__dirname);

// 显示帮助
if (args.includes('--help') || args.includes('-h')) {
  const controller = new AutomationController(projectRoot);
  controller.showHelp();
  process.exit(0);
}

// 执行自动化
const goal = args[0];
if (!goal) {
  console.log('❌ 错误: 请提供自然语言目标\n');
  console.log('用法: node scripts/automation-controller.js "<自然语言目标>"');
  console.log('示例: node scripts/automation-controller.js "添加一个暗黑模式切换功能"');
  console.log('\n使用 --help 查看更多信息');
  process.exit(1);
}

const controller = new AutomationController(projectRoot);
controller.execute(goal);
