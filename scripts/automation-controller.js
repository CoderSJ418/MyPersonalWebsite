/**
 * 自动化控制器 - MyPersonalWebsite
 * 
 * 功能：
 * 1. 解析自然语言目标
 * 2. 分配给合适的 Agent
 * 3. 协调多 Agent 协作
 * 4. 自动化执行开发任务
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutomationController {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.config = this.loadConfig();
    this.agentRegistry = this.loadAgentRegistry();
    this.workflowRegistry = this.loadWorkflowRegistry();
  }

  loadConfig() {
    const configPath = path.join(this.projectRoot, '.bmad-config.yaml');
    if (fs.existsSync(configPath)) {
      return require('js-yaml').load(fs.readFileSync(configPath, 'utf8'));
    }
    return this.getDefaultConfig();
  }

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

  loadAgentRegistry() {
    const agentManifestPath = path.join(this.projectRoot, '../bmad/_cfg/agent-manifest.csv');
    if (fs.existsSync(agentManifestPath)) {
      const content = fs.readFileSync(agentManifestPath, 'utf8');
      return this.parseCSV(content);
    }
    return {};
  }

  loadWorkflowRegistry() {
    const workflowManifestPath = path.join(this.projectRoot, '../bmad/_cfg/workflow-manifest.csv');
    if (fs.existsSync(workflowManifestPath)) {
      const content = fs.readFileSync(workflowManifestPath, 'utf8');
      return this.parseCSV(content);
    }
    return {};
  }

  parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return obj;
    });
  }

  /**
   * 解析自然语言目标
   */
  parseNaturalLanguageGoal(goal) {
    console.log(`🎯 解析自然语言目标: "${goal}"`);
    
    // 目标类型识别
    const goalTypes = {
      '新功能': /添加|新增|实现|开发|创建|制作/,
      '优化': /优化|改进|提升|加速|增强/,
      '修复': /修复|解决|处理|修正/,
      '重构': /重构|重构|改写|优化代码/,
      '设计': /设计|美化|改版|UI|界面/,
      '测试': /测试|验证|检查|审查/
    };

    for (const [type, pattern] of Object.entries(goalTypes)) {
      if (pattern.test(goal)) {
        return {
          type,
          goal,
          confidence: 0.9,
          requires: this.getRequiredAgents(type)
        };
      }
    }

    // 默认返回新功能类型
    return {
      type: '新功能',
      goal,
      confidence: 0.7,
      requires: ['bmad:analyst', 'bmad:architect', 'bmad:dev', 'bmad:tea']
    };
  }

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
   * 执行自动化流程
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
    });
    console.log();

    // 3. 执行任务序列
    const results = [];
    for (const task of taskSequence) {
      console.log(`\n▶️ 执行任务: ${task.name}`);
      const result = await this.executeTask(task);
      results.push(result);
      
      if (!result.success) {
        console.error(`❌ 任务失败: ${result.error}`);
        break;
      }
      
      console.log(`✅ 任务完成`);
    }

    // 4. 生成报告
    this.generateReport(parsedGoal, results);

    return results;
  }

  generateTaskSequence(parsedGoal) {
    const sequences = {
      '新功能': [
        { name: '需求分析', agent: 'bmad:analyst', workflow: 'brainstorm-project' },
        { name: '架构设计', agent: 'bmad:architect', workflow: 'solution-architecture' },
        { name: '技术规格', agent: 'bmad:architect', workflow: 'tech-spec' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework' }
      ],
      '优化': [
        { name: '需求分析', agent: 'bmad:analyst', workflow: 'brainstorm-project' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework' }
      ],
      '修复': [
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework' }
      ],
      '重构': [
        { name: '架构设计', agent: 'bmad:architect', workflow: 'solution-architecture' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story' },
        { name: '测试验证', agent: 'bmad:tea', workflow: 'testarch-framework' }
      ],
      '设计': [
        { name: 'UX 设计', agent: 'bmad:ux-expert', workflow: 'ux-spec' },
        { name: '视觉设计', agent: 'frontend-design-claude2', workflow: 'visual-design' },
        { name: '代码实现', agent: 'bmad:dev', workflow: 'dev-story' }
      ],
      '测试': [
        { name: '测试框架', agent: 'bmad:tea', workflow: 'testarch-framework' },
        { name: '前端测试', agent: 'frontend-tester', workflow: 'frontend-test' }
      ]
    };

    return sequences[parsedGoal.type] || sequences['新功能'];
  }

  async executeTask(task) {
    try {
      // 这里应该调用对应的 Agent 和 Workflow
      // 目前返回模拟结果
      console.log(`   🤖 调用 Agent: ${task.agent}`);
      console.log(`   📋 执行 Workflow: ${task.workflow}`);
      
      // 模拟执行时间
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        task: task.name,
        agent: task.agent,
        workflow: task.workflow,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        task: task.name,
        error: error.message
      };
    }
  }

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

---
生成时间: ${new Date().toLocaleString('zh-CN')}
`;

    fs.writeFileSync(reportPath, report, 'utf8');
    console.log(`\n📄 报告已生成: ${reportPath}`);
  }
}

// CLI 接口
if (require.main === module) {
  const goal = process.argv[2];
  if (!goal) {
    console.log('用法: node automation-controller.js "你的自然语言目标"');
    console.log('示例: node automation-controller.js "添加一个暗黑模式切换功能"');
    process.exit(1);
  }

  const controller = new AutomationController(__dirname);
  controller.execute(goal);
}

module.exports = AutomationController;