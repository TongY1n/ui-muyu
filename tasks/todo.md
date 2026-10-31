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

- 初始 npm 检查曾返回包 404、身份 401；维护者随后完成登录及 2FA，正式包已发布，见下方 v0.1.5 Review。
- npm workflow 仅由 Release published 事件触发；普通分支或 main 的 push/merge 不会发布 npm。
- 首次发布账号为 tongy1n，Trusted Publisher 配置已创建；尚未完成首个 OIDC 实际发布，不将配置存在等同于自动发布链路已经验证。
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
- [x] 发布 PR #7 合并后 main CI 通过（f3fd94a，run 41237261480）
- [x] 确认 npm 首次发布身份（tongy1n，2FA auth-and-writes）
- [x] 首次发布正式包后创建 npm Trusted Publishing 配置
- [x] 从最终 main 创建 tag、构建兼容下载资产、发布 Release 并核对 npm 与 tag CI
- [x] 从 npm registry 安装正式包，在隔离 DSH_HOME 验证真实客户端加载与点击计数
- [ ] 后续发布前检查 Trusted Publisher 状态并完成首个真实 OIDC 发布；若新配置已过期，先重建

## Review

- 验收实例由 main 9303d99 的真实安装包启动，隔离 DSH_HOME；维护者已明确确认人工验收通过。
- Desktop 的 8 个构建 gate 与启动通过；受 CUA 权限限制，未完成 Desktop UI 自动化逐元素验收。
- npm 首次发布已采用本机已登录账号完成；Trusted Publisher 配置已创建，后续版本需验证 Release 工作流的 OIDC 真实发布。
- v0.1.5 本地门禁通过：typecheck、构建、2 个测试文件共 14 项测试、pack:check、npm:check、release:check、git diff --check、lib 产物一致性。
- 本次检查设置 pnpm_config_verify_deps_before_run=false 使用现有本地依赖，避免 pnpm 自动重装在无 TTY 环境中中断；没有修改依赖或项目配置。
- 2026-11-01 维护者已完成 npm 登录与浏览器 2FA 认证；npm whoami 返回 tongy1n。包尚不存在时 trust API 返回 404，需先首次发布再绑定。
- 首次发布先合并本发布 PR，等待 main CI，通过后从同一 main 提交打 tag 和构建发布包；创建 GitHub Release 时临时停用仅 npm-publish 工作流，随后恢复，避免重复发布同一个已存在版本。不使用占位包或长期 token。
- v0.1.5 已公开发布至 npm 与 GitHub Release；npm latest 为 0.1.5。发布时远端 main 和 v0.1.5 tag 均为 f3fd94a5864100c41859d5e56b2c0f02b05f4cfc；tag CI run 41237577247 通过。
- npm 包、GitHub 下载资产与本地包逐字节一致，SHA256 为 70e8e3c7642c076d25f0a6ab9b5fd9333055f32b0ef0d927c23b8a01327db71d。GitHub 资产保留名称 deepseek-ai-dsh-client-ui-muyu-0.1.5.tgz。
- Trusted Publisher 创建返回成功，id 为 2433e93c-5327-4bcc-abfd-4664a9eb9171，仓库 TongY1n/ui-muyu，工作流 npm-publish.yml。npm 官方文档的 Trusted publisher configuration expiry 条款要求新配置两天内首次成功发布，否则过期；本版为手动首次发布，不声称 OIDC 已实际验证，下一次发版需先核对并按需重建，不为此额外发布无功能变化的版本。
- npm-publish.yml 已恢复 active；工作流运行列表为空，未触发重复 npm 发布。
- 实际验证命令：dsh plugin --profile web add dsh-ui-muyu@0.1.5；配置目录 /tmp/dsh-muyu-npm-v0.1.5-install。正式包在 DSH 0.2.2-alpha.2 启动成功，木鱼可见，点击计数增长，Playwright 控制台零 error、零 warning；没有修改用户真实 DSH 配置。
- 发布结果已同步到既有 PR #7。本地后续收尾记录位于 docs/release-v0.1.5-closeout，仅修改本任务文件，不混入已发布的 tag/main，也未推送新的开发分支。

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
