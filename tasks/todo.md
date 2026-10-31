# DSH 0.2.2-alpha.2 适配

## 现状分析

- [x] 从 `origin/main` 的 `8cf791c` 创建分支 `feat/dsh-0.2.2-alpha.2-adaptation`
- [x] 确认本地 DSH checkout 为 `dsh-v0.2.2-alpha.2`（commit `f3803c9`）
- [x] 确认当前插件依赖仍固定在 `0.2.1-rc.3`（`package.json`、`pnpm-lock.yaml`）
- [x] 对比 DSH 新旧源码，确认 `shell.overlay`、slots、locale、client bundle factory 契约未发现破坏性变化
- [x] 用户确认本 Spec 后开始编码

## 功能点

- [x] 将 DSH 开发依赖和锁文件更新到 `0.2.2-alpha.2`
- [x] 保持 `engines.dsh` 的兼容范围覆盖已验证的 `0.2.2-alpha.2`
- [x] 使用最新 DSH checkout 完成类型检查、构建、测试和包内容检查
- [x] 在隔离 `DSH_HOME` 下完成 Web 实机验证，并完成 Desktop 构建与启动验证
- [x] 未发现真实宿主 API 或样式回归，因此没有引入额外适配代码

## 风险与决策

- [x] 不把伪宿主 Vitest 结果当作最新 DSH 的完整兼容证明
- [x] 不修改受保护的 README 木鱼视觉基准，因本次未发现宿主升级造成回归
- [x] 不扩展 `dsh.client.external` 或资产加载能力，因新版本真实运行未要求
- [x] 不改变 GitHub Release tarball 和插件市场索引，本次仅完成框架适配

## Review

- 当前分支：`feat/dsh-0.2.2-alpha.2-adaptation`，基于本地 `origin/main` 的 `8cf791c` 创建。
- DSH 验证基线：`dsh-v0.2.2-alpha.2`，commit `f3803c96974ad4a94195fb97e5c637e9c2a3afe3`。
- 代码变更仅涉及 `package.json` 和 `pnpm-lock.yaml`；源码、`lib/`、视觉基准和发布元数据没有额外改动。
- `pnpm typecheck`：通过。
- `pnpm test`：通过，2 个测试文件、14 个测试全部通过；构建产物生成成功。
- `pnpm pack:check`：通过，包内容检查成功。
- `pnpm release:check`：通过，发布元数据一致。
- `git diff --check`：通过。
- Web 实机：在隔离 `DSH_HOME` 下成功安装并加载插件，木鱼、木鱼锤、点击功德、轮廓和阴影均正常，控制台无 warning/error。
- Desktop：最新版 DSH 的 8 个构建 gate 全部通过，Electron `Harness Dev` 成功启动；由于当前 CUA 权限限制，未完成 Desktop UI 的自动化逐元素检查，不能将其表述为 Desktop UI 完整验收。
- 上一项 npm 任务遗留的 3 个未跟踪 Spec 文件已放入可恢复 stash `preserve npm spec files before dsh adaptation`，未混入本分支。
