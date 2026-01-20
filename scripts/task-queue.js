/**
 * 任务队列系统 - MyPersonalWebsite
 * 
 * 功能：
 * 1. 任务队列管理
 * 2. 优先级调度
 * 3. 依赖关系管理
 * 4. 并发控制
 * 5. 任务状态跟踪
 * 
 * @example
 * const queue = new TaskQueue();
 * await queue.add(task1);
 * await queue.add(task2);
 * await queue.process();
 */

/**
 * 任务类
 */
class Task {
  /**
   * @param {Object} options - 任务选项
   * @param {string} options.id - 任务 ID
   * @param {string} options.name - 任务名称
   * @param {Function} options.execute - 任务执行函数
   * @param {string} options.agent - 负责的 Agent
   * @param {string} options.workflow - 工作流名称
   * @param {string[]} options.dependencies - 依赖的任务 ID 数组
   * @param {number} options.priority - 优先级（0-10，数字越大优先级越高）
   * @param {string} options.description - 任务描述
   */
  constructor(options) {
    this.id = options.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.name = options.name;
    this.execute = options.execute;
    this.agent = options.agent;
    this.workflow = options.workflow;
    this.dependencies = options.dependencies || [];
    this.priority = options.priority || 5;
    this.description = options.description || '';
    this.status = 'pending'; // pending, running, completed, failed
    this.result = null;
    this.error = null;
    this.createdAt = new Date();
    this.startedAt = null;
    this.completedAt = null;
  }

  /**
   * 检查任务是否可以执行（所有依赖都已完成）
   * 
   * @param {Map} taskMap - 所有任务的映射
   * @returns {boolean} 是否可以执行
   */
  canExecute(taskMap) {
    return this.dependencies.every(depId => {
      const depTask = taskMap.get(depId);
      return depTask && depTask.status === 'completed';
    });
  }

  /**
   * 执行任务
   * 
   * @returns {Promise} 执行结果
   */
  async run() {
    this.status = 'running';
    this.startedAt = new Date();
    
    try {
      this.result = await this.execute();
      this.status = 'completed';
      this.completedAt = new Date();
      return this.result;
    } catch (error) {
      this.status = 'failed';
      this.error = error;
      this.completedAt = new Date();
      throw error;
    }
  }

  /**
   * 获取任务执行时间（毫秒）
   * 
   * @returns {number} 执行时间
   */
  getExecutionTime() {
    if (!this.startedAt || !this.completedAt) return 0;
    return this.completedAt - this.startedAt;
  }
}

/**
 * 任务队列类
 */
class TaskQueue {
  /**
   * @param {Object} options - 队列选项
   * @param {number} options.concurrency - 最大并发数
   * @param {number} options.maxRetries - 最大重试次数
   */
  constructor(options = {}) {
    this.concurrency = options.concurrency || 3;
    this.maxRetries = options.maxRetries || 3;
    this.tasks = new Map();
    this.queue = [];
    this.running = 0;
    this.completed = 0;
    this.failed = 0;
    this.logs = [];
  }

  /**
   * 添加任务到队列
   * 
   * @param {Object} taskOptions - 任务选项
   * @returns {string} 任务 ID
   */
  add(taskOptions) {
    const task = new Task(taskOptions);
    this.tasks.set(task.id, task);
    this.queue.push(task);
    this.log('INFO', `任务已添加: ${task.name} (ID: ${task.id}, 优先级: ${task.priority})`);
    return task.id;
  }

  /**
   * 批量添加任务
   * 
   * @param {Array} taskOptionsArray - 任务选项数组
   * @returns {Array} 任务 ID 数组
   */
  addBatch(taskOptionsArray) {
    return taskOptionsArray.map(options => this.add(options));
  }

  /**
   * 处理队列
   * 
   * @returns {Promise} 处理结果
   */
  async process() {
    this.log('INFO', `开始处理队列，共 ${this.queue.length} 个任务`);
    
    // 按优先级排序
    this.queue.sort((a, b) => b.priority - a.priority);
    
    // 创建执行 Promise 数组
    const promises = [];
    
    while (this.queue.length > 0 || this.running > 0) {
      // 检查是否有可执行的任务
      const executableTasks = this.queue.filter(task => 
        task.canExecute(this.tasks) && this.running < this.concurrency
      );
      
      // 执行可执行的任务
      for (const task of executableTasks) {
        // 从队列中移除
        const index = this.queue.indexOf(task);
        if (index > -1) {
          this.queue.splice(index, 1);
        }
        
        // 执行任务
        this.running++;
        promises.push(this.executeTask(task));
      }
      
      // 等待一段时间再检查
      if (executableTasks.length === 0 && this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // 等待所有任务完成
    await Promise.all(promises);
    
    this.log('INFO', `队列处理完成: ${this.completed} 成功, ${this.failed} 失败`);
    
    return {
      total: this.tasks.size,
      completed: this.completed,
      failed: this.failed,
      tasks: Array.from(this.tasks.values())
    };
  }

  /**
   * 执行单个任务
   * 
   * @param {Task} task - 任务对象
   * @returns {Promise} 执行结果
   */
  async executeTask(task) {
    let retries = 0;
    
    while (retries <= this.maxRetries) {
      try {
        this.log('INFO', `执行任务: ${task.name} (ID: ${task.id})`);
        await task.run();
        this.completed++;
        this.log('SUCCESS', `任务完成: ${task.name} (耗时: ${task.getExecutionTime()}ms)`);
        return task.result;
      } catch (error) {
        retries++;
        if (retries <= this.maxRetries) {
          this.log('WARNING', `任务失败，重试 ${retries}/${this.maxRetries}: ${task.name}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        } else {
          this.failed++;
          this.log('ERROR', `任务最终失败: ${task.name} - ${error.message}`);
          throw error;
        }
      }
    } finally {
      this.running--;
    }
  }

  /**
   * 获取任务状态
   * 
   * @param {string} taskId - 任务 ID
   * @returns {Object} 任务状态
   */
  getTaskStatus(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) {
      return null;
    }
    
    return {
      id: task.id,
      name: task.name,
      status: task.status,
      priority: task.priority,
      agent: task.agent,
      workflow: task.workflow,
      dependencies: task.dependencies,
      description: task.description,
      createdAt: task.createdAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      executionTime: task.getExecutionTime(),
      result: task.result,
      error: task.error ? task.error.message : null
    };
  }

  /**
   * 获取队列状态
   * 
   * @returns {Object} 队列状态
   */
  getQueueStatus() {
    return {
      total: this.tasks.size,
      pending: this.queue.length,
      running: this.running,
      completed: this.completed,
      failed: this.failed,
      concurrency: this.concurrency,
      tasks: Array.from(this.tasks.values()).map(task => ({
        id: task.id,
        name: task.name,
        status: task.status,
        priority: task.priority
      }))
    };
  }

  /**
   * 清空队列
   */
  clear() {
    this.tasks.clear();
    this.queue = [];
    this.running = 0;
    this.completed = 0;
    this.failed = 0;
    this.log('INFO', '队列已清空');
  }

  /**
   * 记录日志
   * 
   * @param {string} level - 日志级别
   * @param {string} message - 日志消息
   */
  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.logs.push(logEntry);
    
    const icons = {
      INFO: 'ℹ️',
      SUCCESS: '✅',
      WARNING: '⚠️',
      ERROR: '❌'
    };
    
    console.log(`${icons[level] || 'ℹ️'} [${timestamp}] ${message}`);
  }

  /**
   * 导出日志
   * 
   * @returns {string} 日志字符串
   */
  exportLogs() {
    return this.logs.map(log => 
      `[${log.timestamp}] ${log.level}: ${log.message}`
    ).join('\n');
  }

  /**
   * 生成报告
   * 
   * @returns {string} 报告字符串
   */
  generateReport() {
    const tasks = Array.from(this.tasks.values());
    
    return `
任务队列报告
============

总任务数: ${tasks.length}
已完成: ${this.completed}
失败: ${this.failed}
并发数: ${this.concurrency}

任务详情:
--------
${tasks.map(task => {
  const statusIcon = {
    pending: '⏳',
    running: '🔄',
    completed: '✅',
    failed: '❌'
  };
  
  return `
${statusIcon[task.status]} ${task.name}
  ID: ${task.id}
  状态: ${task.status}
  优先级: ${task.priority}
  Agent: ${task.agent}
  Workflow: ${task.workflow}
  执行时间: ${task.getExecutionTime()}ms
  ${task.error ? `错误: ${task.error.message}` : ''}
`;
}).join('\n')}

执行日志:
--------
${this.exportLogs()}
`;
  }
}

// 导出模块
module.exports = { Task, TaskQueue };