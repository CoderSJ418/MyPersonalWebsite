# 交互实验室统计与隐私说明

## 客户端边界

- 未选择、明确拒绝或启用 Do Not Track 时，不创建 GA4 脚本，也不发送事件。
- 只有存在 `VITE_GA_MEASUREMENT_ID` 且本地选择为 `granted` 时才加载 GA4。
- 允许事件仅为 `lab_view`、`demo_open`、`code_expand`、`code_copy`、`lab_cta_click`、`projects_cta_click`。
- 允许参数仅为封闭枚举的 `source`、`effect_id`、`category`、`copy_target`、`placement`。
- 禁止发送搜索原文、参数值、代码内容、`user_id` 或自定义个人信息。
- 本地选择最多保存 180 天；过期后恢复为未选择。
- 页脚“统计偏好”可随时撤回；撤回会停止后续事件、移除脚本并清除本站可控的 `_ga` Cookie。

## GA4 管理后台发布检查

以下设置无法由前端代码替代，正式数据评估前必须由站点所有者截图确认：

1. 事件数据保留期设为 2 个月。
2. Google Signals 关闭。
3. 广告个性化关闭。
4. Measurement ID 与正式域名匹配。
5. DebugView 确认同意前与 DNT 下没有事件。

Google 数据处理说明：<https://policies.google.com/technologies/partner-sites>
