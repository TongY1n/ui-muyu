# 开发分支合并与人工验收（2026-11-01）

- [x] 核实所有远端待合并开发分支，并纳入本次任务
- [x] 规范 PR #4：本地完整门禁通过，PR CI 通过，合并后 main CI 通过
- [x] DSH 适配 PR #5：同步最新 main，完整门禁和 PR CI 通过，合并后 main CI 通过
- [x] npm 分支同步最新 main，保留包名迁移和 DSH 最新依赖，合并两边任务记录
- [x] npm 分支同步 main 后本地完整门禁通过：typecheck、14 项测试、pack:check、npm:check、release:check、产物一致性与空白检查
- [x] 推送 npm 分支并创建独立 PR，等待 PR CI 通过后合并（PR #6）
- [x] 等待 npm PR 合并后的 main CI 通过（9303d99，run 41227350832）
- [x] 从最终 main 构建并启动隔离 DSH 实例，交由维护者人工验收（4167）
- [x] 维护者明确确认人工验收通过后，进入 release-vX.Y.Z 分支（2026-11-01 确认通过）

## Review

- npm 前置条件：registry 查询 dsh-ui-muyu 返回 HTTP 404；本机 npm whoami 返回 401，尚无可用发布身份。
- npm workflow 仅由 Release published 事件触发；普通分支或 main 的 push/merge 不会发布 npm。
- 首次发布账号、包归属和 npm Trusted Publishing 绑定仍待完成，不能将 workflow 存在视为已具备发布权限。
- 保留 GitHub Release 兼容下载入口；维护者已于 2026-11-01 明确确认人工验收通过，进入发布准备。
- 彩蛋专项实测 22 项：21 项通过，1 项已知异常：暴富提示节点保留 88 秒，但公用 floatUp 动画约 700ms 后透明。已向维护者报告，维护者随后确认人工验收通过；本次不扩大 UI 修改范围，公开更新日志不披露彩蛋信息。

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
- [x] 根据用户确认将 npm 包名改为 `dsh-ui-muyu`，同步 DSH bundle 标识与 npm 包校验
- [x] 经用户认可后推送远端并创建 PR（#6，已合并）

## Review

- 本地门禁通过：typecheck、14 项 Vitest、pack:check、npm:check、release:check、workflow YAML 校验和 git diff --check。
- 生成的 lib/ 未发生额外变化。
- PR #6 已合并，合并后 main CI 通过。
- 包名变更验证通过：类型检查、构建、14 项 Vitest、npm 包内容检查、发布元数据检查和 `git diff --check`。
- pnpm 统一命令曾被环境网络/DNS 与 npm 缓存权限阻断，已使用现有本地依赖和临时 npm 缓存完成等价验证。

# v0.1.5 发布准备（2026-11-01）

- [x] 核对最新 main、CI 和版本占用情况，从 9303d99 创建 release-v0.1.5
- [x] 同步 package.json、registry 元数据与公开更新日志
- [x] 发布分支完整本地门禁及包内容核验
- [x] 推送发布分支并创建独立草稿 PR（#7）
- [x] 发布 PR #7 的 CI 通过（305671d 的两项 verify 检查通过）
- [ ] 发布 PR 合并后等待 main CI 通过
- [ ] 完成 npm 首次发布身份与 Trusted Publishing 前置条件
- [ ] 从最终 main 创建 tag、构建兼容下载资产、发布 Release 并核对 npm 与 tag CI

## Review

- 验收实例由 main 9303d99 的真实安装包启动，隔离 DSH_HOME；维护者已明确确认人工验收通过。
- Desktop 的 8 个构建 gate 与启动通过；受 CUA 权限限制，未完成 Desktop UI 自动化逐元素验收。
- npm 发布身份未就绪时，不触发 Release published 事件，避免自动 npm 发布失败。
- v0.1.5 本地门禁通过：typecheck、构建、2 个测试文件共 14 项测试、pack:check、npm:check、release:check、git diff --check、lib 产物一致性。
- 本次检查设置 pnpm_config_verify_deps_before_run=false 使用现有本地依赖，避免 pnpm 自动重装在无 TTY 环境中中断；没有修改依赖或项目配置。
- 2026-11-01 再次核实 npm whoami 返回 401；发布 PR 保持 draft，暂不合并或发布。

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
