/**
 * 自然语言解析器 - MyPersonalWebsite
 * 
 * 功能：
 * 1. 解析自然语言需求
 * 2. 提取关键信息
 * 3. 识别技术术语
 * 4. 生成结构化任务
 * 5. 支持上下文记忆
 * 
 * @example
 * const parser = new NLPParser();
 * const result = await parser.parse("添加一个暗黑模式切换功能，支持记住用户偏好");
 */

/**
 * 自然语言解析器类
 */
class NLPParser {
  constructor() {
    this.context = new Map(); // 上下文记忆
    this.technicalTerms = this.loadTechnicalTerms();
    this.intentPatterns = this.loadIntentPatterns();
  }

  /**
   * 加载技术术语词典
   * 
   * @returns {Object} 技术术语词典
   */
  loadTechnicalTerms() {
    return {
      // 前端技术
      'vue': { category: 'framework', description: 'Vue.js 前端框架' },
      'react': { category: 'framework', description: 'React 前端框架' },
      'typescript': { category: 'language', description: 'TypeScript 编程语言' },
      'javascript': { category: 'language', description: 'JavaScript 编程语言' },
      'vite': { category: 'build-tool', description: 'Vite 构建工具' },
      'tailwind': { category: 'styling', description: 'Tailwind CSS 框架' },
      'css': { category: 'styling', description: 'CSS 样式表' },
      'html': { category: 'markup', description: 'HTML 标记语言' },
      
      // 功能特性
      '暗黑模式': { category: 'feature', description: 'Dark Mode 主题切换' },
      '搜索': { category: 'feature', description: 'Search 搜索功能' },
      '登录': { category: 'feature', description: 'Login 登录功能' },
      '注册': { category: 'feature', description: 'Register 注册功能' },
      '导航': { category: 'component', description: 'Navigation 导航组件' },
      '页脚': { category: 'component', description: 'Footer 页脚组件' },
      '头部': { category: 'component', description: 'Header 头部组件' },
      '卡片': { category: 'component', description: 'Card 卡片组件' },
      '按钮': { category: 'component', description: 'Button 按钮组件' },
      '表单': { category: 'component', description: 'Form 表单组件' },
      
      // 性能优化
      '优化': { category: 'action', description: 'Optimization 优化' },
      '加速': { category: 'action', description: 'Speed up 加速' },
      '压缩': { category: 'action', description: 'Compression 压缩' },
      '缓存': { category: 'action', description: 'Caching 缓存' },
      '懒加载': { category: 'action', description: 'Lazy loading 懒加载' },
      
      // 修复
      '修复': { category: 'action', description: 'Fix 修复' },
      '解决': { category: 'action', description: 'Solve 解决' },
      '处理': { category: 'action', description: 'Handle 处理' },
      '修正': { category: 'action', description: 'Correct 修正' },
      
      // 设计
      '设计': { category: 'action', description: 'Design 设计' },
      '美化': { category: 'action', description: 'Beautify 美化' },
      '改版': { category: 'action', description: 'Redesign 改版' },
      '界面': { category: 'aspect', description: 'Interface 界面' },
      '交互': { category: 'aspect', description: 'Interaction 交互' },
      '动画': { category: 'aspect', description: 'Animation 动画' },
      '响应式': { category: 'aspect', description: 'Responsive 响应式' },
      
      // 测试
      '测试': { category: 'action', description: 'Test 测试' },
      '验证': { category: 'action', description: 'Verify 验证' },
      '检查': { category: 'action', description: 'Check 检查' },
      '审查': { category: 'action', description: 'Review 审查' },
      '单元测试': { category: 'testing', description: 'Unit test 单元测试' },
      '集成测试': { category: 'testing', description: 'Integration test 集成测试' },
      '端到端测试': { category: 'testing', description: 'E2E test 端到端测试' }
    };
  }

  /**
   * 加载意图模式
   * 
   * @returns {Object} 意图模式
   */
  loadIntentPatterns() {
    return {
      'new_feature': {
        patterns: [
          /添加|新增|增加|创建|制作|开发|实现|建设/,
          /添加一个|新增一个|创建一个|开发一个/
        ],
        priority: 1
      },
      'optimize': {
        patterns: [
          /优化|改进|提升|加速|增强|改善/,
          /优化性能|提高速度|加快加载/
        ],
        priority: 2
      },
      'fix': {
        patterns: [
          /修复|解决|处理|修正|修补/,
          /修复.*bug|解决.*问题|处理.*错误/
        ],
        priority: 3
      },
      'refactor': {
        patterns: [
          /重构|改写|重写|重构代码/,
          /代码优化|代码改进/
        ],
        priority: 4
      },
      'design': {
        patterns: [
          /设计|美化|改版|界面|UI|交互|动画/,
          /视觉设计|用户体验|UX|界面设计/
        ],
        priority: 5
      },
      'test': {
        patterns: [
          /测试|验证|检查|审查/,
          /单元测试|集成测试|端到端测试|E2E/
        ],
        priority: 6
      }
    };
  }

  /**
   * 解析自然语言输入
   * 
   * @param {string} input - 自然语言输入
   * @returns {Promise<Object>} 解析结果
   */
  async parse(input) {
    console.log(`🔍 解析自然语言输入: "${input}"`);
    
    // 1. 预处理
    const preprocessed = this.preprocess(input);
    
    // 2. 识别意图
    const intent = this.recognizeIntent(preprocessed);
    
    // 3. 提取实体
    const entities = this.extractEntities(preprocessed);
    
    // 4. 识别技术术语
    const technicalTerms = this.recognizeTechnicalTerms(preprocessed);
    
    // 5. 生成任务清单
    const tasks = this.generateTasks(intent, entities, technicalTerms);
    
    // 6. 更新上下文
    this.updateContext(input, intent, entities, technicalTerms);
    
    const result = {
      original: input,
      preprocessed,
      intent,
      entities,
      technicalTerms,
      tasks,
      confidence: this.calculateConfidence(intent, entities, technicalTerms),
      context: Array.from(this.context.entries()).slice(-5) // 最近 5 条上下文
    };
    
    console.log(`✅ 解析完成，置信度: ${result.confidence}`);
    return result;
  }

  /**
   * 预处理输入
   * 
   * @param {string} input - 原始输入
   * @returns {string} 预处理后的输入
   */
  preprocess(input) {
    // 转换为小写
    let processed = input.toLowerCase();
    
    // 移除多余空格
    processed = processed.replace(/\s+/g, ' ').trim();
    
    // 移除标点符号（保留中文标点）
    processed = processed.replace(/[^\w\s\u4e00-\u9fa5，。！？、；：""''（）【】]/g, '');
    
    return processed;
  }

  /**
   * 识别意图
   * 
   * @param {string} input - 预处理后的输入
   * @returns {Object} 意图对象
   */
  recognizeIntent(input) {
    let matchedIntent = null;
    let maxMatches = 0;
    
    for (const [intentName, intentData] of Object.entries(this.intentPatterns)) {
      let matches = 0;
      for (const pattern of intentData.patterns) {
        if (pattern.test(input)) {
          matches++;
        }
      }
      
      if (matches > maxMatches) {
        maxMatches = matches;
        matchedIntent = {
          name: intentName,
          priority: intentData.priority,
          matches
        };
      }
    }
    
    if (!matchedIntent) {
      matchedIntent = {
        name: 'unknown',
        priority: 10,
        matches: 0
      };
    }
    
    return matchedIntent;
  }

  /**
   * 提取实体
   * 
   * @param {string} input - 预处理后的输入
   * @returns {Array} 实体数组
   */
  extractEntities(input) {
    const entities = [];
    
    // 提取组件名称
    const componentPattern = /添加一个(.+?)组件|创建一个(.+?)组件|实现(.+?)组件/;
    const componentMatch = input.match(componentPattern);
    if (componentMatch) {
      entities.push({
        type: 'component',
        value: componentMatch[1] || componentMatch[2] || componentMatch[3],
        confidence: 0.9
      });
    }
    
    // 提取功能名称
    const featurePattern = /添加(.+?)功能|实现(.+?)功能|支持(.+?)/;
    const featureMatch = input.match(featurePattern);
    if (featureMatch) {
      entities.push({
        type: 'feature',
        value: featureMatch[1] || featureMatch[2] || featureMatch[3],
        confidence: 0.85
      });
    }
    
    // 提取页面名称
    const pagePattern = /添加(.+?)页面|创建(.+?)页面/;
    const pageMatch = input.match(pagePattern);
    if (pageMatch) {
      entities.push({
        type: 'page',
        value: pageMatch[1] || pageMatch[2],
        confidence: 0.9
      });
    }
    
    // 提取修饰词
    const modifiers = ['记住', '持久化', '本地', '远程', '自动', '手动', '实时', '异步', '同步'];
    modifiers.forEach(modifier => {
      if (input.includes(modifier)) {
        entities.push({
          type: 'modifier',
          value: modifier,
          confidence: 0.8
        });
      }
    });
    
    return entities;
  }

  /**
   * 识别技术术语
   * 
   * @param {string} input - 预处理后的输入
   * @returns {Array} 技术术语数组
   */
  recognizeTechnicalTerms(input) {
    const terms = [];
    
    for (const [term, info] of Object.entries(this.technicalTerms)) {
      if (input.includes(term)) {
        terms.push({
          term,
          category: info.category,
          description: info.description,
          confidence: 0.95
        });
      }
    }
    
    return terms;
  }

  /**
   * 生成任务清单
   * 
   * @param {Object} intent - 意图对象
   * @param {Array} entities - 实体数组
   * @param {Array} technicalTerms - 技术术语数组
   * @returns {Array} 任务数组
   */
  generateTasks(intent, entities, technicalTerms) {
    const tasks = [];
    
    // 根据意图生成任务
    switch (intent.name) {
      case 'new_feature':
        tasks.push({
          type: 'analysis',
          description: '分析新功能需求',
          priority: 1
        });
        tasks.push({
          type: 'design',
          description: '设计功能架构',
          priority: 2
        });
        tasks.push({
          type: 'implementation',
          description: '实现功能代码',
          priority: 3
        });
        tasks.push({
          type: 'testing',
          description: '测试功能',
          priority: 4
        });
        break;
        
      case 'optimize':
        tasks.push({
          type: 'analysis',
          description: '分析性能瓶颈',
          priority: 1
        });
        tasks.push({
          type: 'optimization',
          description: '实施优化方案',
          priority: 2
        });
        tasks.push({
          type: 'testing',
          description: '验证优化效果',
          priority: 3
        });
        break;
        
      case 'fix':
        tasks.push({
          type: 'analysis',
          description: '分析问题原因',
          priority: 1
        });
        tasks.push({
          type: 'fix',
          description: '修复问题',
          priority: 2
        });
        tasks.push({
          type: 'testing',
          description: '验证修复',
          priority: 3
        });
        break;
        
      case 'refactor':
        tasks.push({
          type: 'analysis',
          description: '分析代码结构',
          priority: 1
        });
        tasks.push({
          type: 'refactor',
          description: '重构代码',
          priority: 2
        });
        tasks.push({
          type: 'testing',
          description: '验证重构',
          priority: 3
        });
        break;
        
      case 'design':
        tasks.push({
          type: 'analysis',
          description: '分析设计需求',
          priority: 1
        });
        tasks.push({
          type: 'design',
          description: '设计方案',
          priority: 2
        });
        tasks.push({
          type: 'implementation',
          description: '实现设计',
          priority: 3
        });
        break;
        
      case 'test':
        tasks.push({
          type: 'test_design',
          description: '设计测试用例',
          priority: 1
        });
        tasks.push({
          type: 'test_implementation',
          description: '实现测试',
          priority: 2
        });
        tasks.push({
          type: 'test_execution',
          description: '执行测试',
          priority: 3
        });
        break;
        
      default:
        tasks.push({
          type: 'analysis',
          description: '分析需求',
          priority: 1
        });
    }
    
    // 根据实体添加具体任务
    entities.forEach(entity => {
      if (entity.type === 'component') {
        tasks.push({
          type: 'component_creation',
          description: `创建 ${entity.value} 组件`,
          priority: 2,
          entity: entity.value
        });
      }
    });
    
    // 根据技术术语添加相关任务
    technicalTerms.forEach(term => {
      if (term.category === 'feature') {
        tasks.push({
          type: 'feature_implementation',
          description: `实现 ${term.description}`,
          priority: 2,
          term: term.term
        });
      }
    });
    
    return tasks;
  }

  /**
   * 计算置信度
   * 
   * @param {Object} intent - 意图对象
   * @param {Array} entities - 实体数组
   * @param {Array} technicalTerms - 技术术语数组
   * @returns {number} 置信度 (0-1)
   */
  calculateConfidence(intent, entities, technicalTerms) {
    let confidence = 0;
    
    // 意图匹配度
    if (intent.matches > 0) {
      confidence += 0.3 * (intent.matches / 2);
    }
    
    // 实体提取度
    if (entities.length > 0) {
      confidence += 0.3 * Math.min(entities.length / 3, 1);
    }
    
    // 技术术语识别度
    if (technicalTerms.length > 0) {
      confidence += 0.2 * Math.min(technicalTerms.length / 3, 1);
    }
    
    // 基础置信度
    confidence += 0.2;
    
    return Math.min(confidence, 1);
  }

  /**
   * 更新上下文
   * 
   * @param {string} input - 原始输入
   * @param {Object} intent - 意图对象
   * @param {Array} entities - 实体数组
   * @param {Array} technicalTerms - 技术术语数组
   */
  updateContext(input, intent, entities, technicalTerms) {
    const contextKey = Date.now();
    this.context.set(contextKey, {
      input,
      intent: intent.name,
      entities: entities.map(e => ({ type: e.type, value: e.value })),
      technicalTerms: technicalTerms.map(t => t.term),
      timestamp: new Date().toISOString()
    });
    
    // 限制上下文大小
    if (this.context.size > 10) {
      const oldestKey = this.context.keys().next().value;
      this.context.delete(oldestKey);
    }
  }

  /**
   * 获取上下文
   * 
   * @returns {Array} 上下文数组
   */
  getContext() {
    return Array.from(this.context.values());
  }

  /**
   * 清空上下文
   */
  clearContext() {
    this.context.clear();
  }
}

// 导出模块
export default NLPParser;