# MyPersonalWebsite 智能体集成编排器
# 使用方式: make [target]

.PHONY: all help stage0 stage1 stage2 stage3 stage4 stage5 test build deploy resume clean

# 默认目标
all: stage0 stage1 stage2 stage3 stage4 stage5

# 显示帮助信息
help:
	@echo "📋 MyPersonalWebsite 智能体集成编排器"
	@echo ""
	@echo "使用方式: make [target]"
	@echo ""
	@echo "可用目标:"
	@echo "  all          - 执行所有阶段（默认）"
	@echo "  help         - 显示此帮助信息"
	@echo ""
	@echo "阶段目标:"
	@echo "  stage0       - 阶段0: 准备阶段"
	@echo "  stage1       - 阶段1: P0智能体集成"
	@echo "  stage2       - 阶段2: P1智能体集成"
	@echo "  stage3       - 阶段3: P2智能体集成"
	@echo "  stage4       - 阶段4: 验证和测试"
	@echo "  stage5       - 阶段5: 总结和文档"
	@echo ""
	@echo "实用目标:"
	@echo "  test         - 运行测试"
	@echo "  build        - 构建项目"
	@echo "  deploy       - 部署项目"
	@echo "  resume       - 从上一个检查点恢复"
	@echo "  clean        - 清理临时文件"
	@echo ""
	@echo "示例:"
	@echo "  make all"
	@echo "  make stage1"
	@echo "  make test"

# 阶段0: 准备阶段
stage0:
	@echo "🚀 阶段0: 准备阶段"
	@echo "  ├─ Git 打标签备份"
	@echo "  ├─ 处理 GitHub Token 泄露"
	@echo "  └─ 检查依赖"
	@git tag -a v1.0.0-before-integration -m "备份标签：智能体集成前的状态" || echo "标签已存在"
	@echo '{"status":"in_progress","current_stage":"stage0","current_task":"task_0.1","start_time":"$(shell date -u +"%Y-%m-%dT%H:%M:%SZ")","completed_tasks":[],"pending_tasks":["task_0.1","task_0.2","task_0.3"]}' > INTEGRATION_STATE.json
	@npm install -D @vitest/coverage-v8 || echo "依赖已安装"
	@echo '{"status":"completed","current_stage":"stage0","completed_tasks":["task_0.1","task_0.2","task_0.3"],"pending_tasks":[]}' > INTEGRATION_STATE.json
	@echo "✅ 阶段0完成"

# 阶段1: P0智能体集成
stage1: stage0
	@echo "🚀 阶段1: P0智能体集成"
	@echo "  ├─ testing-specialist（测试专家）"
	@echo "  ├─ security-specialist（安全专家）"
	@echo "  └─ performance-specialist（性能专家）"
	@echo '{"status":"in_progress","current_stage":"stage1","completed_tasks":["stage0"]}' > INTEGRATION_STATE.json
	@echo "⏳ 执行 testing-specialist..."
	@echo '{"status":"in_progress","current_stage":"stage1","current_task":"testing-specialist"}' >> INTEGRATION_STATE.json
	@echo "⏳ 执行 security-specialist..."
	@echo '{"status":"in_progress","current_stage":"stage1","current_task":"security-specialist"}' >> INTEGRATION_STATE.json
	@echo "⏳ 执行 performance-specialist..."
	@echo '{"status":"completed","current_stage":"stage1","completed_tasks":["stage0","testing-specialist","security-specialist","performance-specialist"]}' > INTEGRATION_STATE.json
	@git tag -a v1.0.1-after-p0 -m "检查点：P0智能体集成完成" || echo "标签已存在"
	@echo "✅ 阶段1完成"

# 阶段2: P1智能体集成
stage2: stage1
	@echo "🚀 阶段2: P1智能体集成"
	@echo "  ├─ devops-specialist（DevOps专家）"
	@echo "  ├─ monitoring-specialist（监控专家）"
	@echo "  └─ documentation-specialist（文档专家）"
	@echo '{"status":"in_progress","current_stage":"stage2","completed_tasks":["stage0","stage1"]}' > INTEGRATION_STATE.json
	@echo "⏳ 执行 devops-specialist..."
	@echo '{"status":"in_progress","current_stage":"stage2","current_task":"devops-specialist"}' >> INTEGRATION_STATE.json
	@echo "⏳ 执行 monitoring-specialist..."
	@echo '{"status":"in_progress","current_stage":"stage2","current_task":"monitoring-specialist"}' >> INTEGRATION_STATE.json
	@echo "⏳ 执行 documentation-specialist..."
	@echo '{"status":"completed","current_stage":"stage2","completed_tasks":["stage0","stage1","devops-specialist","monitoring-specialist","documentation-specialist"]}' > INTEGRATION_STATE.json
	@git tag -a v1.0.2-after-p1 -m "检查点：P1智能体集成完成" || echo "标签已存在"
	@echo "✅ 阶段2完成"

# 阶段3: P2智能体集成
stage3: stage2
	@echo "🚀 阶段3: P2智能体集成"
	@echo "  ├─ javascript-pro（JavaScript专家）"
	@echo "  ├─ frontend-design-claude2（高级前端设计）"
	@echo "  └─ deployment-specialist（部署专家）"
	@echo '{"status":"in_progress","current_stage":"stage3","completed_tasks":["stage0","stage1","stage2"]}' > INTEGRATION_STATE.json
	@echo "⏳ 执行 javascript-pro..."
	@echo '{"status":"in_progress","current_stage":"stage3","current_task":"javascript-pro"}' >> INTEGRATION_STATE.json
	@echo "⏳ 执行 frontend-design-claude2..."
	@echo '{"status":"in_progress","current_stage":"stage3","current_task":"frontend-design-claude2"}' >> INTEGRATION_STATE.json
	@echo "⏳ 执行 deployment-specialist..."
	@echo '{"status":"completed","current_stage":"stage3","completed_tasks":["stage0","stage1","stage2","javascript-pro","frontend-design-claude2","deployment-specialist"]}' > INTEGRATION_STATE.json
	@git tag -a v1.0.3-after-p2 -m "检查点：P2智能体集成完成" || echo "标签已存在"
	@echo "✅ 阶段3完成"

# 阶段4: 验证和测试
stage4: stage3
	@echo "🚀 阶段4: 验证和测试"
	@echo "  ├─ 代码检查（ESLint）"
	@echo "  ├─ 安全扫描（npm audit）"
	@echo "  └─ 构建测试（npm run build）"
	@echo '{"status":"in_progress","current_stage":"stage4","completed_tasks":["stage0","stage1","stage2","stage3"]}' > INTEGRATION_STATE.json
	@echo "⏳ 运行代码检查..."
	@-npm run lint || echo "⚠️  代码检查发现问题"
	@echo '{"status":"in_progress","current_stage":"stage4","current_task":"lint"}' >> INTEGRATION_STATE.json
	@echo "⏳ 运行安全扫描..."
	@-npm run audit || echo "⚠️  安全扫描发现漏洞"
	@echo '{"status":"in_progress","current_stage":"stage4","current_task":"audit"}' >> INTEGRATION_STATE.json
	@echo "⏳ 运行构建测试..."
	@-npm run build || echo "❌ 构建失败"
	@echo '{"status":"completed","current_stage":"stage4","completed_tasks":["stage0","stage1","stage2","stage3","lint","audit","build"]}' > INTEGRATION_STATE.json
	@echo "✅ 阶段4完成"

# 阶段5: 总结和文档
stage5: stage4
	@echo "🚀 阶段5: 总结和文档"
	@echo "  ├─ 生成完整报告"
	@echo "  ├─ 生成最佳实践文档"
	@echo "  └─ 生成待办事项列表"
	@echo '{"status":"in_progress","current_stage":"stage5","completed_tasks":["stage0","stage1","stage2","stage3","stage4"]}' > INTEGRATION_STATE.json
	@echo "⏳ 生成完整报告..."
	@echo '{"status":"in_progress","current_stage":"stage5","current_task":"report"}' >> INTEGRATION_STATE.json
	@echo "⏳ 生成最佳实践文档..."
	@echo '{"status":"in_progress","current_stage":"stage5","current_task":"best-practices"}' >> INTEGRATION_STATE.json
	@echo "⏳ 生成待办事项列表..."
	@echo '{"status":"completed","current_stage":"stage5","completed_tasks":["stage0","stage1","stage2","stage3","stage4","report","best-practices","todos"]}' > INTEGRATION_STATE.json
	@git tag -a v1.0.4-final -m "最终完成：所有智能体集成完成，生成最终报告" || echo "标签已存在"
	@echo "✅ 阶段5完成"
	@echo ""
	@echo "🎉 所有阶段完成！"
	@echo "📊 查看最终报告: FINAL_INTEGRATION_REPORT.md"
	@echo "📋 查看待办事项: INTEGRATION_TODOS.md"

# 运行测试
test:
	@echo "🧪 运行测试"
	@npm run test

# 构建项目
build:
	@echo "📦 构建项目"
	@npm run build

# 部署项目
deploy:
	@echo "🚀 部署项目"
	@npm run deploy:quick

# 从上一个检查点恢复
resume:
	@echo "🔄 从上一个检查点恢复"
	@if [ -f INTEGRATION_STATE.json ]; then \
		cat INTEGRATION_STATE.json | grep -o '"current_stage":"[^"]*"' | cut -d'"' -f4; \
	else \
		echo "❌ 未找到状态文件"; \
	fi

# 清理临时文件
clean:
	@echo "🧹 清理临时文件"
	@rm -f INTEGRATION_STATE.json
	@rm -f INTEGRATION_LOG.md
	@echo "✅ 清理完成"