/**
 * 意图识别器 - MyPersonalWebsite
 * 
 * 功能：
 * 1. 意图识别
 * 2. 多意图识别
 * 3. 意图分类
 * 4. 置信度计算
 * 5. 意图映射
 * 
 * @example
 * const recognizer = new IntentRecognizer();
 * const result = await recognizer.recognize("添加一个暗黑模式切换功能并测试");
 */

/**
 * 意图识别器类
 */
class IntentRecognizer {
  constructor() {
    this.intentPatterns = this.loadIntentPatterns();
    this.intentHierarchy = this.loadIntentHierarchy();
    this.intentMappings = this.loadIntentMappings();
  }

  /**
   * 加载意图模式
   * 
   * @returns {Object} 意图模式
   */
  loadIntentPatterns() {
    return {
      // 开发相关意图
      'develop': {
        name: '开发',
        category: 'development',
        patterns: [
          /开发|实现|创建|制作|建设/,
          /添加|新增|增加/,
          /写代码|编程|实现功能/
        ],
        priority: 1,
        confidence: 0.9
      },
      
      'design': {
        name: '设计',
        category: 'design',
        patterns: [
          /设计|美化|改版|界面|UI/,
          /视觉设计|交互设计|用户体验|UX/,
          /布局|样式|主题|颜色/
        ],
        priority: 2,
        confidence: 0.85
      },
      
      'test': {
        name: '测试',
        category: 'testing',
        patterns: [
          /测试|验证|检查|审查/,
          /单元测试|集成测试|端到端测试|E2E/,
          /测试用例|测试脚本|测试报告/
        ],
        priority: 3,
        confidence: 0.88
      },
      
      'optimize': {
        name: '优化',
        category: 'optimization',
        patterns: [
          /优化|改进|提升|加速|增强|改善/,
          /性能优化|代码优化|加载优化/,
          /加快|提速|压缩|缓存/
        ],
        priority: 4,
        confidence: 0.87
      },
      
      'fix': {
        name: '修复',
        category: 'maintenance',
        patterns: [
          /修复|解决|处理|修正|修补/,
          /修复.*bug|解决.*问题|处理.*错误/,
          /调试|debug|排错/
        ],
        priority: 5,
        confidence: 0.92
      },
      
      'refactor': {
        name: '重构',
        category: 'maintenance',
        patterns: [
          /重构|改写|重写|重构代码/,
          /代码优化|代码改进|代码清理/,
          /重构.*模块|重构.*组件/
        ],
        priority: 6,
        confidence: 0.86
      },
      
      'deploy': {
        name: '部署',
        category: 'deployment',
        patterns: [
          /部署|发布|上线|发布版本/,
          /部署到|发布到|上线到/,
          /生产环境|staging|预发布/
        ],
        priority: 7,
        confidence: 0.91
      },
      
      'document': {
        name: '文档',
        category: 'documentation',
        patterns: [
          /文档|说明|指南|教程/,
          /编写文档|更新文档|生成文档/,
          /API文档|用户文档|开发文档/
        ],
        priority: 8,
        confidence: 0.84
      },
      
      'analyze': {
        name: '分析',
        category: 'analysis',
        patterns: [
          /分析|研究|调研|探索/,
          /需求分析|技术分析|市场分析/,
          /可行性分析|风险评估/
        ],
        priority: 9,
        confidence: 0.83
      },
      
      'review': {
        name: '审查',
        category: 'quality',
        patterns: [
          /审查|审核|评审|code review/,
          /代码审查|设计审查|架构审查/,
          /PR|pull request|merge request/
        ],
        priority: 10,
        confidence: 0.89
      }
    };
  }

  /**
   * 加载意图层次结构
   * 
   * @returns {Object} 意图层次结构
   */
  loadIntentHierarchy() {
    return {
      'development': {
        name: '开发',
        children: ['develop', 'design', 'analyze']
      },
      'testing': {
        name: '测试',
        children: ['test', 'review']
      },
      'maintenance': {
        name: '维护',
        children: ['fix', 'refactor', 'optimize']
      },
      'deployment': {
        name: '部署',
        children: ['deploy']
      },
      'documentation': {
        name: '文档',
        children: ['document']
      }
    };
  }

  /**
   * 加载意图映射
   * 
   * @returns {Object} 意图映射
   */
  loadIntentMappings() {
    return {
      // 映射到 BMAD Agents
      'develop': {
        agents: ['bmad:dev', 'javascript-pro'],
        workflows: ['dev-story', 'tech-spec']
      },
      'design': {
        agents: ['bmad:ux-expert', 'frontend-design-claude2'],
        workflows: ['ux-spec', 'visual-design']
      },
      'test': {
        agents: ['bmad:tea', 'frontend-tester'],
        workflows: ['testarch-framework', 'testarch-plan']
      },
      'optimize': {
        agents: ['bmad:architect', 'bmad:dev', 'javascript-pro'],
        workflows: ['solution-architecture', 'dev-story']
      },
      'fix': {
        agents: ['bmad:dev', 'bmad:tea'],
        workflows: ['dev-story', 'testarch-framework']
      },
      'refactor': {
        agents: ['bmad:architect', 'bmad:dev'],
        workflows: ['solution-architecture', 'dev-story']
      },
      'deploy': {
        agents: ['bmad:dev'],
        workflows: ['dev-story']
      },
      'document': {
        agents: ['bmad:analyst', 'bmad:po'],
        workflows: ['brainstorm-project', 'prd']
      },
      'analyze': {
        agents: ['bmad:analyst', 'bmad:architect'],
        workflows: ['brainstorm-project', 'research']
      },
      'review': {
        agents: ['bmad:tea', 'bmad:architect'],
        workflows: ['review-story', 'testarch-gate']
      }
    };
  }

  /**
   * 识别意图
   * 
   * @param {string} input - 用户输入
   * @returns {Promise<Object>} 识别结果
   */
  async recognize(input) {
    console.log(`🎯 识别意图: "${input}"`);
    
    // 1. 识别单个意图
    const primaryIntent = this.recognizePrimaryIntent(input);
    
    // 2. 识别多个意图
    const multipleIntents = this.recognizeMultipleIntents(input);
    
    // 3. 分类意图
    const category = this.classifyIntent(primaryIntent);
    
    // 4. 计算置信度
    const confidence = this.calculateConfidence(primaryIntent, multipleIntents);
    
    // 5. 映射到 Agents 和 Workflows
    const mappings = this.mapToAgentsAndWorkflows(primaryIntent, multipleIntents);
    
    const result = {
      input,
      primaryIntent,
      multipleIntents,
      category,
      confidence,
      mappings,
      suggestions: this.generateSuggestions(primaryIntent, multipleIntents)
    };
    
    console.log(`✅ 意图识别完成: ${primaryIntent.name} (置信度: ${confidence})`);
    return result;
  }

  /**
   * 识别主要意图
   * 
   * @param {string} input - 用户输入
   * @returns {Object} 主要意图
   */
  recognizePrimaryIntent(input) {
    let bestMatch = null;
    let maxScore = 0;
    
    for (const [intentId, intentData] of Object.entries(this.intentPatterns)) {
      let score = 0;
      let matchedPatterns = [];
      
      for (const pattern of intentData.patterns) {
        const matches = input.match(pattern);
        if (matches) {
          score += 1;
          matchedPatterns.push(pattern.toString());
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = {
          id: intentId,
          name: intentData.name,
          category: intentData.category,
          priority: intentData.priority,
          confidence: intentData.confidence * (score / intentData.patterns.length),
          matchedPatterns
        };
      }
    }
    
    if (!bestMatch) {
      bestMatch = {
        id: 'unknown',
        name: '未知',
        category: 'unknown',
        priority: 99,
        confidence: 0.1,
        matchedPatterns: []
      };
    }
    
    return bestMatch;
  }

  /**
   * 识别多个意图
   * 
   * @param {string} input - 用户输入
   * @returns {Array} 多个意图数组
   */
  recognizeMultipleIntents(input) {
    const intents = [];
    
    for (const [intentId, intentData] of Object.entries(this.intentPatterns)) {
      let score = 0;
      
      for (const pattern of intentData.patterns) {
        if (pattern.test(input)) {
          score++;
        }
      }
      
      if (score > 0) {
        intents.push({
          id: intentId,
          name: intentData.name,
          category: intentData.category,
          priority: intentData.priority,
          confidence: intentData.confidence * (score / intentData.patterns.length),
          score
        });
      }
    }
    
    // 按置信度排序
    intents.sort((a, b) => b.confidence - a.confidence);
    
    // 只返回置信度 > 0.3 的意图
    return intents.filter(intent => intent.confidence > 0.3);
  }

  /**
   * 分类意图
   * 
   * @param {Object} intent - 意图对象
   * @returns {string} 类别
   */
  classifyIntent(intent) {
    return intent.category || 'unknown';
  }

  /**
   * 计算置信度
   * 
   * @param {Object} primaryIntent - 主要意图
   * @param {Array} multipleIntents - 多个意图
   * @returns {number} 置信度 (0-1)
   */
  calculateConfidence(primaryIntent, multipleIntents) {
    // 主要意图的置信度
    let confidence = primaryIntent.confidence;
    
    // 如果有多个意图，降低置信度
    if (multipleIntents.length > 1) {
      confidence *= 0.9;
    }
    
    // 如果主要意图的置信度很低，进一步降低
    if (primaryIntent.confidence < 0.5) {
      confidence *= 0.8;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * 映射到 Agents 和 Workflows
   * 
   * @param {Object} primaryIntent - 主要意图
   * @param {Array} multipleIntents - 多个意图
   * @returns {Object} 映射结果
   */
  mapToAgentsAndWorkflows(primaryIntent, multipleIntents) {
    const mappings = {
      primary: {
        intent: primaryIntent.name,
        agents: [],
        workflows: []
      },
      secondary: []
    };
    
    // 映射主要意图
    if (this.intentMappings[primaryIntent.id]) {
      mappings.primary.agents = this.intentMappings[primaryIntent.id].agents;
      mappings.primary.workflows = this.intentMappings[primaryIntent.id].workflows;
    }
    
    // 映射次要意图
    multipleIntents.forEach(intent => {
      if (intent.id !== primaryIntent.id && this.intentMappings[intent.id]) {
        mappings.secondary.push({
          intent: intent.name,
          confidence: intent.confidence,
          agents: this.intentMappings[intent.id].agents,
          workflows: this.intentMappings[intent.id].workflows
        });
      }
    });
    
    return mappings;
  }

  /**
   * 生成建议
   * 
   * @param {Object} primaryIntent - 主要意图
   * @param {Array} multipleIntents - 多个意图
   * @returns {Array} 建议数组
   */
  generateSuggestions(primaryIntent, multipleIntents) {
    const suggestions = [];
    
    // 如果置信度低，建议用户提供更多信息
    if (primaryIntent.confidence < 0.5) {
      suggestions.push({
        type: 'info',
        message: '意图识别置信度较低，建议提供更具体的描述'
      });
    }
    
    // 如果有多个意图，建议确认
    if (multipleIntents.length > 1) {
      const intentNames = multipleIntents.map(i => i.name).join('、');
      suggestions.push({
        type: 'warning',
        message: `检测到多个意图: ${intentNames}，请确认主要意图`
      });
    }
    
    // 根据意图类型提供建议
    if (primaryIntent.id === 'develop') {
      suggestions.push({
        type: 'info',
        message: '建议先进行需求分析，再进行技术设计'
      });
    } else if (primaryIntent.id === 'test') {
      suggestions.push({
        type: 'info',
        message: '建议先设计测试用例，再实现测试代码'
      });
    } else if (primaryIntent.id === 'deploy') {
      suggestions.push({
        type: 'warning',
        message: '部署前请确保已通过所有测试'
      });
    }
    
    return suggestions;
  }

  /**
   * 获取所有意图
   * 
   * @returns {Array} 意图数组
   */
  getAllIntents() {
    return Object.entries(this.intentPatterns).map(([id, data]) => ({
      id,
      name: data.name,
      category: data.category,
      priority: data.priority,
      confidence: data.confidence
    }));
  }

  /**
   * 获取意图层次结构
   * 
   * @returns {Object} 意图层次结构
   */
  getIntentHierarchy() {
    return this.intentHierarchy;
  }
}

// 导出模块
export default IntentRecognizer;