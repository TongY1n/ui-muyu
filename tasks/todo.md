# npm 一键安装支持

- [x] 现状分析：确认 npm 包、DSH Bundle 契约和市场索引格式
- [x] Spec 第一段确认：现状与目标边界（范围从 A 调整为 C）
- [x] Spec 第二段确认：功能点与发布方案
- [x] Spec 第三段确认：风险、兼容策略与验收标准
- [x] 用户确认完整 Spec
- [x] 从最新 main 创建无前缀开发分支
- [x] 实现 npm 发布与安装链路
- [x] 运行类型检查、构建、测试、打包和发布元数据检查
- [x] 本地验证并等待用户认可
- [ ] 经用户认可后推送远端并创建 PR

## Review

- 本地门禁通过：typecheck、14 项 Vitest、pack:check、npm:check、release:check、workflow YAML 校验和 git diff --check。
- 生成的 lib/ 未发生额外变化。
- 待用户认可后再推送远端并创建 PR。
