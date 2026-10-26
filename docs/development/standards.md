# ui-muyu 开发规范

本文件定义日常开发和发版前的最低要求。远端仓库当前没有单独的编码规范文件，因此本文件与根目录 `CONTRIBUTING.md`、`ui-isolation.md` 一起作为仓内规范基线。

## 分支与提交

- 所有开发在无 `codex/` 前缀的开发分支进行，例如 `feature-...`、`fix-...` 或 `release-vX.Y.Z`；`main` 只保留可发布内容。
- 开始每项新开发前，必须先获取远端最新状态，将本地 `main` 快进到 `origin/main`，再从该提交创建新的开发分支：

  ```sh
  git fetch origin --prune
  git switch main
  git pull --ff-only
  git switch -c <branch-name>
  ```

- DSH 适配、用户可见行为、生成产物和对应文档应在同一组可审查的改动中维护。
- 开发和验证阶段默认只保留在本地；完成本地验证并经维护者确认后，才推送远端、创建 PR 和请求合并。不得未经确认直接推送开发分支或合入 `main`。
- 合并前确认当前分支包含最新 `main`，工作区无无意修改，并重新运行全部门禁。

## 源码与产物

- `src/` 和 `shared/` 是源码目录，`lib/` 是 `pnpm build` 生成的发布产物。
- 不手工编辑 `lib/` 中的 JavaScript、source map 或声明文件；源码变化后必须重新构建并检查产物差异。
- `docs/images/preview.png` 是受保护的视觉基准。除非产品需求明确改变外观，否则普通和彩虹木鱼都必须保持 main 的轻微不规则圆形轮廓。

## UI 隔离

- 使用宿主提供的 React 和 `createPortal`，完整挂件渲染在一个 open Shadow Root 中，不创建第二个 React root。
- 局部 CSS 必须留在 Shadow Root 内，不向 `document.head` 注入插件样式，不使用 `:global()` 越过隔离边界。
- DSH 主题 token 只用于主题颜色；尺寸、圆角、边框、阴影、动画时长和控件布局由插件定义。
- 木鱼锤始终挂载，敲击时只播放锤子动作，鱼体本身不做位移或旋转动画。

## 隐私与状态

- 不发起网络请求，不读取凭据、文件、shell、会话或对话内容。
- 唯一持久化机制是 `localStorage`，键为 `dsh-muyu.state.v1`；新增字段必须同步更新文档和测试。

## 验证门禁

提交或创建 PR 前运行：

```sh
pnpm typecheck
pnpm test
pnpm pack:check
pnpm release:check
git diff --check
```

浏览器和 Desktop 验证必须使用隔离的 `DSH_HOME`，不能操作用户真实 DSH 配置。发布记录必须说明所验证的 DSH 版本、Web/Desktop 状态、主题切换、卸载重载和宿主强制样式隔离结果。

## 版本与 registry

- `package.json` 的版本、`registry/curated/plugin.json` 的 `version` 和 tarball 路径必须同步。
- `pnpm release:check` 是发布元数据的一致性检查，版本变更后必须通过。
- 发布前不得继续复用旧版本 tarball 的 registry 地址。

## 标准发版流程

1. 从最新且 CI 通过的 `main` 创建 `release-vX.Y.Z` 分支。禁止直接在 `main` 上改版本、打 tag 或发布。
2. 同步更新 `package.json`、`registry/curated/plugin.json` 和 `CHANGELOG.md`。源码有变化时先运行构建并提交生成的 `lib/`。
3. 在发布分支运行 `pnpm typecheck`、`pnpm test`、`pnpm pack:check`、`pnpm release:check` 和 `git diff --check`。涉及 DSH 适配或用户可见行为时，还要记录隔离 `DSH_HOME` 下的 Web/Desktop 验证结果。
4. 推送发布分支并创建 PR。PR 的所有 CI 检查必须通过；任一检查失败时停止发布，修复后重新验证，禁止带红合入或发布。
5. PR 合并后同步本地 `main`，确认工作区干净，并确认待发布提交就是 `main` 的最新提交。
6. 只在该 `main` 提交上创建版本 tag，并推送 tag。GitHub Release 必须使用同一个 tag，上传从该提交生成的 tarball。
7. 发布后核对 tag、`main`、Release 资产和 registry tarball 地址一致，并确认 tag push CI 通过。
8. 构建确定性、发布产物或安装链路问题修复合入后，应立即发布下一个 patch 版本，不得让已知缺陷产物继续流通。

发布说明只记录用户可理解的功能、兼容性、构建和验证信息，不公开内部彩蛋实现细节。

## 测试产物和文档

- 可复用的 E2E harness 源码保存在 `e2e/`；其生成目录 `e2e/dist/` 忽略。
- 本地浏览器截图保存在 `gui-test-screenshots/`，默认不入库。
- 历史审查报告按日期保留，不回写旧结论；当前状态更新到 `ui-isolation.md` 和最新交接记录。
