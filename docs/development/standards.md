# ui-muyu 开发规范

本文件定义日常开发和发版前的最低要求。远端仓库当前没有单独的编码规范文件，因此本文件与根目录 `CONTRIBUTING.md`、`ui-isolation.md` 一起作为仓内规范基线。

## 分支与提交

- 所有开发在 `codex/*` 或 `development` 分支进行，`main` 只保留可发布内容。
- DSH 适配、用户可见行为、生成产物和对应文档应在同一组可审查的改动中维护。
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

## 测试产物和文档

- 可复用的 E2E harness 源码保存在 `e2e/`；其生成目录 `e2e/dist/` 忽略。
- 本地浏览器截图保存在 `gui-test-screenshots/`，默认不入库。
- 历史审查报告按日期保留，不回写旧结论；当前状态更新到 `ui-isolation.md` 和最新交接记录。
