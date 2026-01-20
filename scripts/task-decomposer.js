/**
 * 任务分解器 - MyPersonalWebsite
 * 
 * 功能：
 * 1. 智能任务分解
 * 2. 任务依赖管理
 * 3. 优先级排序
 * 4. 子任务生成
 * 5. 任务复杂度评估
 * 
 * @example
 * const decomposer = new TaskDecomposer();
 * const tasks = await decomposer.decompose("添加一个暗黑模式切换功能");
 */

/**
 * 任务分解器类
 */
class TaskDecomposer {
  constructor() {
    this.taskTemplates = this.loadTaskTemplates();
    this.complexityRules = this.loadComplexityRules();
  }

  /**
   * 加载任务模板
   * 
   * @returns {Object} 任务模板
   */
  loadTaskTemplates() {
    return {
      // 新功能模板
      'new_feature': {
        name: '新功能开发',
        subtasks: [
          {
            id: 'requirement_analysis',
            name: '需求分析',
            description: '分析用户需求，明确功能范围',
            agent: 'bmad:analyst',
            workflow: 'brainstorm-project',
            priority: 1,
            estimatedTime: '30min',
            dependencies: []
          },
          {
            id: 'technical_design',
            name: '技术设计',
            description: '设计技术方案和架构',
            agent: 'bmad:architect',
            workflow: 'solution-architecture',
            priority: 2,
            estimatedTime: '45min',
            dependencies: ['requirement_analysis']
          },
          {
            id: 'component_creation',
            name: '组件创建',
            description: '创建必要的组件',
            agent: 'bmad:dev',
            workflow: 'dev-story',
            priority: 3,
            estimatedTime: '60min',
            dependencies: ['technical_design']
          },
          {
            id: 'state_management',
            name: '状态管理',
            description: '实现状态管理逻辑',
            agent: 'bmad:dev',
            workflow: 'dev-story',
            priority: 4,
            estimatedTime: '30min',
            dependencies: ['component_creation']
          },
          {
            id: 'styling',
            name: '样式实现',
            description: '实现组件样式',
            agent: 'frontend-design-claude2',
            workflow: 'visual-design',
            priority: 5,
            estimatedTime: '45min',
            dependencies: ['component_creation']
          },
          {
            id: 'testing',
            name: '测试验证',
            description: '编写测试用例并验证功能',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 6,
            estimatedTime: '30min',
            dependencies: ['state_management', 'styling']
          },
          {
            id: 'documentation',
            name: '文档编写',
            description: '编写技术文档和使用说明',
            agent: 'bmad:analyst',
            workflow: 'brainstorm-project',
            priority: 7,
            estimatedTime: '20min',
            dependencies: ['testing']
          }
        ]
      },
      
      // 优化模板
      'optimize': {
        name: '性能优化',
        subtasks: [
          {
            id: 'performance_analysis',
            name: '性能分析',
            description: '分析性能瓶颈',
            agent: 'bmad:analyst',
            workflow: 'brainstorm-project',
            priority: 1,
            estimatedTime: '30min',
            dependencies: []
          },
          {
            id: 'optimization_plan',
            name: '优化方案',
            description: '制定优化方案',
            agent: 'bmad:architect',
            workflow: 'solution-architecture',
            priority: 2,
            estimatedTime: '30min',
            dependencies: ['performance_analysis']
          },
          {
            id: 'implementation',
            name: '优化实现',
            description: '实施优化方案',
            agent: 'bmad:dev',
            workflow: 'dev-story',
            priority: 3,
            estimatedTime: '60min',
            dependencies: ['optimization_plan']
          },
          {
            id: 'verification',
            name: '效果验证',
            description: '验证优化效果',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 4,
            estimatedTime: '20min',
            dependencies: ['implementation']
          }
        ]
      },
      
      // 修复模板
      'fix': {
        name: '问题修复',
        subtasks: [
          {
            id: 'issue_analysis',
            name: '问题分析',
            description: '分析问题原因',
            agent: 'bmad:analyst',
            workflow: 'brainstorm-project',
            priority: 1,
            estimatedTime: '20min',
            dependencies: []
          },
          {
            id: 'fix_implementation',
            name: '修复实现',
            description: '修复问题',
            agent: 'bmad:dev',
            workflow: 'dev-story',
            priority: 2,
            estimatedTime: '30min',
            dependencies: ['issue_analysis']
          },
          {
            id: 'regression_test',
            name: '回归测试',
            description: '执行回归测试',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 3,
            estimatedTime: '20min',
            dependencies: ['fix_implementation']
          }
        ]
      },
      
      // 重构模板
      'refactor': {
        name: '代码重构',
        subtasks: [
          {
            id: 'code_analysis',
            name: '代码分析',
            description: '分析代码结构',
            agent: 'bmad:architect',
            workflow: 'solution-architecture',
            priority: 1,
            estimatedTime: '30min',
            dependencies: []
          },
          {
            id: 'refactor_plan',
            name: '重构方案',
            description: '制定重构方案',
            agent: 'bmad:architect',
            workflow: 'solution-architecture',
            priority: 2,
            estimatedTime: '30min',
            dependencies: ['code_analysis']
          },
          {
            id: 'refactor_implementation',
            name: '重构实现',
            description: '执行重构',
            agent: 'bmad:dev',
            workflow: 'dev-story',
            priority: 3,
            estimatedTime: '60min',
            dependencies: ['refactor_plan']
          },
          {
            id: 'testing',
            name: '测试验证',
            description: '验证重构结果',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 4,
            estimatedTime: '30min',
            dependencies: ['refactor_implementation']
          }
        ]
      },
      
      // 设计模板
      'design': {
        name: '设计实现',
        subtasks: [
          {
            id: 'ux_design',
            name: 'UX 设计',
            description: '设计用户体验',
            agent: 'bmad:ux-expert',
            workflow: 'ux-spec',
            priority: 1,
            estimatedTime: '45min',
            dependencies: []
          },
          {
            id: 'visual_design',
            name: '视觉设计',
            description: '实现视觉设计',
            agent: 'frontend-design-claude2',
            workflow: 'visual-design',
            priority: 2,
            estimatedTime: '60min',
            dependencies: ['ux_design']
          },
          {
            id: 'implementation',
            name: '设计实现',
            description: '实现设计',
            agent: 'bmad:dev',
            workflow: 'dev-story',
            priority: 3,
            estimatedTime: '60min',
            dependencies: ['visual_design']
          },
          {
            id: 'testing',
            name: '测试验证',
            description: '验证设计效果',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 4,
            estimatedTime: '30min',
            dependencies: ['implementation']
          }
        ]
      },
      
      // 测试模板
      'test': {
        name: '测试实施',
        subtasks: [
          {
            id: 'test_design',
            name: '测试设计',
            description: '设计测试用例',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 1,
            estimatedTime: '30min',
            dependencies: []
          },
          {
            id: 'test_implementation',
            name: '测试实现',
            description: '实现测试代码',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 2,
            estimatedTime: '45min',
            dependencies: ['test_design']
          },
          {
            id: 'test_execution',
            name: '测试执行',
            description: '执行测试',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 3,
            estimatedTime: '20min',
            dependencies: ['test_implementation']
          },
          {
            id: 'report_generation',
            name: '报告生成',
            description: '生成测试报告',
            agent: 'bmad:tea',
            workflow: 'testarch-framework',
            priority: 4,
            estimatedTime: '15min',
            dependencies: ['test_execution']
          }
        ]
      }
    };
  }

  /**
   * 加载复杂度规则
   * 
   * @returns {Object} 复杂度规则
   */
  loadComplexityRules() {
    return {
      // 简单任务
      simple: {
        criteria: {
          maxSubtasks: 3,
          maxDependencies: 1,
          maxEstimatedTime: '60min'
        },
        level: 1
      },
      
      // 中等任务
      medium: {
        criteria: {
          maxSubtasks: 7,
          maxDependencies: 3,
          maxEstimatedTime: '180min'
        },
        level: 2
      },
      
      // 复杂任务
      complex: {
        criteria: {
          maxSubtasks: 15,
          maxDependencies: 5,
          maxEstimatedTime: '360min'
        },
        level: 3
      }
    };
  }

  /**
   * 分解任务
   * 
   * @param {string} goal - 目标描述
   * @param {Object} parseResult - 解析结果（来自 NLP Parser）
   * @returns {Promise<Object>} 分解结果
   */
  async decompose(goal, parseResult) {
    console.log(`🔨 分解任务: "${goal}"`);
    
    // 1. 选择任务模板
    const template = this.selectTemplate(parseResult);
    
    // 2. 生成子任务
    const subtasks = this.generateSubtasks(template, parseResult);
    
    // 3. 构建依赖关系
    const dependencyGraph = this.buildDependencyGraph(subtasks);
    
    // 4. 评估复杂度
    const complexity = this.assessComplexity(subtasks, dependencyGraph);
    
    // 5. 计算总时间
    const totalEstimatedTime = this.calculateTotalTime(subtasks);
    
    // 6. 生成执行计划
    const executionPlan = this.generateExecutionPlan(subtasks, dependencyGraph);
    
    const result = {
      goal,
      template: template.name,
      subtasks,
      dependencyGraph,
      complexity,
      totalEstimatedTime,
      executionPlan,
      recommendations: this.generateRecommendations(complexity, subtasks)
    };
    
    console.log(`✅ 任务分解完成，复杂度: ${complexity.level}, 子任务数: ${subtasks.length}`);
    return result;
  }

  /**
   * 选择任务模板
   * 
   * @param {Object} parseResult - 解析结果
   * @returns {Object} 任务模板
   */
  selectTemplate(parseResult) {
    const intentName = parseResult.intent.name;
    
    if (this.taskTemplates[intentName]) {
      return this.taskTemplates[intentName];
    }
    
    // 默认使用新功能模板
    return this.taskTemplates['new_feature'];
  }

  /**
   * 生成子任务
   * 
   * @param {Object} template - 任务模板
   * @param {Object} parseResult - 解析结果
   * @returns {Array} 子任务数组
   */
  generateSubtasks(template, parseResult) {
    const subtasks = [];
    
    // 复制模板中的子任务
    template.subtasks.forEach(subtask => {
      const newSubtask = { ...subtask };
      
      // 根据解析结果调整描述
      if (parseResult.entities.length > 0) {
        const componentEntity = parseResult.entities.find(e => e.type === 'component');
        const featureEntity = parseResult.entities.find(e => e.type === 'feature');
        
        if (componentEntity) {
          newSubtask.description = newSubtask.description.replace('组件', `${componentEntity.value}组件`);
        }
        if (featureEntity) {
          newSubtask.description = newSubtask.description.replace('功能', `${featureEntity.value}功能`);
        }
      }
      
      subtasks.push(newSubtask);
    });
    
    return subtasks;
  }

  /**
   * 构建依赖关系图
   * 
   * @param {Array} subtasks - 子任务数组
   * @returns {Object} 依赖关系图
   */
  buildDependencyGraph(subtasks) {
    const graph = {
      nodes: subtasks.map(task => task.id),
      edges: []
    };
    
    subtasks.forEach(task => {
      task.dependencies.forEach(depId => {
        graph.edges.push({
          from: depId,
          to: task.id
        });
      });
    });
    
    return graph;
  }

  /**
   * 评估复杂度
   * 
   * @param {Array} subtasks - 子任务数组
   * @param {Object} dependencyGraph - 依赖关系图
   * @returns {Object} 复杂度对象
   */
  assessComplexity(subtasks, dependencyGraph) {
    const numSubtasks = subtasks.length;
    const numDependencies = dependencyGraph.edges.length;
    const maxDependencyDepth = this.calculateMaxDependencyDepth(subtasks);
    
    let level = 'simple';
    let score = 0;
    
    // 评估子任务数量
    if (numSubtasks <= 3) {
      score += 1;
    } else if (numSubtasks <= 7) {
      score += 2;
    } else {
      score += 3;
    }
    
    // 评估依赖关系
    if (numDependencies <= 1) {
      score += 1;
    } else if (numDependencies <= 3) {
      score += 2;
    } else {
      score += 3;
    }
    
    // 评估依赖深度
    if (maxDependencyDepth <= 2) {
      score += 1;
    } else if (maxDependencyDepth <= 4) {
      score += 2;
    } else {
      score += 3;
    }
    
    // 计算平均分
    const averageScore = score / 3;
    
    if (averageScore <= 1.5) {
      level = 'simple';
    } else if (averageScore <= 2.5) {
      level = 'medium';
    } else {
      level = 'complex';
    }
    
    return {
      level,
      score: averageScore,
      details: {
        numSubtasks,
        numDependencies,
        maxDependencyDepth
      }
    };
  }

  /**
   * 计算最大依赖深度
   * 
   * @param {Array} subtasks - 子任务数组
   * @returns {number} 最大依赖深度
   */
  calculateMaxDependencyDepth(subtasks) {
    const taskMap = new Map(subtasks.map(task => [task.id, task]));
    const depths = new Map();
    
    subtasks.forEach(task => {
      const depth = this.calculateTaskDepth(task, taskMap, depths);
      depths.set(task.id, depth);
    });
    
    return Math.max(...depths.values());
  }

  /**
   * 计算单个任务的依赖深度
   * 
   * @param {Object} task - 任务对象
   * @param {Map} taskMap - 任务映射
   * @param {Map} depths - 深度映射
   * @returns {number} 依赖深度
   */
  calculateTaskDepth(task, taskMap, depths) {
    if (depths.has(task.id)) {
      return depths.get(task.id);
    }
    
    if (task.dependencies.length === 0) {
      depths.set(task.id, 0);
      return 0;
    }
    
    let maxDepth = 0;
    for (const depId of task.dependencies) {
      const depTask = taskMap.get(depId);
      if (depTask) {
        const depDepth = this.calculateTaskDepth(depTask, taskMap, depths);
        maxDepth = Math.max(maxDepth, depDepth);
      }
    }
    
    depths.set(task.id, maxDepth + 1);
    return maxDepth + 1;
  }

  /**
   * 计算总时间
   * 
   * @param {Array} subtasks - 子任务数组
   * @returns {string} 总时间
   */
  calculateTotalTime(subtasks) {
    let totalMinutes = 0;
    
    subtasks.forEach(task => {
      const timeStr = task.estimatedTime;
      const minutes = parseInt(timeStr);
      if (!isNaN(minutes)) {
        totalMinutes += minutes;
      }
    });
    
    // 转换为小时和分钟
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  }

  /**
   * 生成执行计划
   * 
   * @param {Array} subtasks - 子任务数组
   * @param {Object} dependencyGraph - 依赖关系图
   * @returns {Array} 执行计划数组
   */
  generateExecutionPlan(subtasks, dependencyGraph) {
    const plan = [];
    const completed = new Set();
    const taskMap = new Map(subtasks.map(task => [task.id, task]));
    
    // 拓扑排序
    while (completed.size < subtasks.length) {
      // 找出所有依赖都已完成的任务
      const readyTasks = subtasks.filter(task => 
        !completed.has(task.id) &&
        task.dependencies.every(depId => completed.has(depId))
      );
      
      if (readyTasks.length === 0) {
        // 循环依赖，按优先级选择
        const remainingTasks = subtasks.filter(task => !completed.has(task.id));
        remainingTasks.sort((a, b) => a.priority - b.priority);
        readyTasks.push(remainingTasks[0]);
      }
      
      // 按优先级排序
      readyTasks.sort((a, b) => a.priority - b.priority);
      
      // 添加到执行计划
      readyTasks.forEach(task => {
        plan.push({
          step: plan.length + 1,
          taskId: task.id,
          name: task.name,
          description: task.description,
          agent: task.agent,
          workflow: task.workflow,
          estimatedTime: task.estimatedTime,
          dependencies: task.dependencies
        });
        completed.add(task.id);
      });
    }
    
    return plan;
  }

  /**
   * 生成建议
   * 
   * @param {Object} complexity - 复杂度对象
   * @param {Array} subtasks - 子任务数组
   * @returns {Array} 建议数组
   */
  generateRecommendations(complexity, subtasks) {
    const recommendations = [];
    
    if (complexity.level === 'simple') {
      recommendations.push({
        type: 'info',
        message: '这是一个简单任务，可以快速完成'
      });
    } else if (complexity.level === 'medium') {
      recommendations.push({
        type: 'warning',
        message: '这是一个中等复杂度的任务，建议分阶段实施'
      });
    } else {
      recommendations.push({
        type: 'error',
        message: '这是一个复杂任务，建议制定详细的实施计划'
      });
    }
    
    // 检查是否有长时间任务
    const longTasks = subtasks.filter(task => {
      const minutes = parseInt(task.estimatedTime);
      return minutes > 60;
    });
    
    if (longTasks.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `有 ${longTasks.length} 个任务预计耗时超过 1 小时，建议进一步分解`
      });
    }
    
    // 检查依赖关系
    const maxDependencies = Math.max(...subtasks.map(task => task.dependencies.length));
    if (maxDependencies > 3) {
      recommendations.push({
        type: 'info',
        message: '存在复杂的依赖关系，建议仔细规划执行顺序'
      });
    }
    
    return recommendations;
  }
}

// 导出模块
export default TaskDecomposer;