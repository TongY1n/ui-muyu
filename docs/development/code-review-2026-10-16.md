# 代码审查：codex/muyu-dsh-020-adaptation（2026-10-16）

- **审查对象**：分支 `codex/muyu-dsh-020-adaptation` 的 HEAD `d07cbb8` 相对 `main`（`ef96072`）的全部改动；两者线性相连，共 1 个提交。
- **Spec 来源**：`docs/development/ui-isolation.md`（主）+ `docs/development/handoff-2026-10-07.md`（含 2026-10-10 alpha.2 适配记录）+ `docs/development/code-review-2026-10-11.md`（上一轮报告及其「修复状态」小节）。
- **Standards 来源**：本仓无 `CONTRIBUTING.md` / `CODING_STANDARDS.md` / ESLint / Prettier；以 `ui-isolation.md` 规范性条款作为 documented standards，另加 Fowler smell 基线。
- **方法**：双轴（Standards / Spec）独立审查后汇总，两轴不合并、不重排。
- **工具说明**：本轮派出的三个只读探子被中途打断终止，两轴由主代理亲自完成；工作区 `node_modules` 为空且网络受限，`pnpm test` / `typecheck` **未实跑**，结论来自静态阅读与已提交产物（`lib/client.js`）对源文件的一致性核对。本仓缺 `docs/agents/issue-tracker.md`，spec 改由仓内文档提供。

## Standards 轴

未发现硬性违反成文规范之处。以下条款已逐条核实成立：`!important` 仅出现在 `:host`，内部重置改用零权重 `:where()`；无 `:global()`；未引入第二份 React 或第二个 React Root；面板内部判定使用 `event.composedPath()`；`docs/images/preview.png` 未改动；抠图/宽高/圆角参数与 spec 一致。

以下 4 条为判断题：

1. **[最重] 有一条测试断言永远不会失败。** `tests/client-bundle.test.tsx:78` 的 `expect(widgetStyle).not.toContain('.struck .fish')`：类名经 `shared/tsdown.client.ts:264` 的 `[hash]_[local]` 哈希为 `.zL9bQa_struck .zL9bQa_fish`，该字面量不可能出现在产物里，断言因此恒真，守不住 spec 的「鱼体本身不得绑定位移或旋转动画」。同文件上一行的 `background-clip:padding-box` 断言有效（属性名不参与哈希）。建议改为对 fish 规则断言不含 `animation`，或改查 computed style。
2. **死引用 `css.hovered`。** 本次改动删除了 `.hovered .mallet` 规则，`src/client/Muyu.module.css` 中已无任何 `.hovered` 选择器，构建产物类名表（`lib/client.js:38-55`）也没有 `hovered` 键；但 `src/client/Muyu.tsx:367` 仍写 `clsx(css.root, hovered && css.hovered, ...)`。运行期无害（`undefined` 被 clsx 丢弃），属残留。同理 `src/client/Muyu.module.css:179` 的 `transition: opacity 140ms` 在 `opacity: 1` 常量下已无作用。
3. **视口来源重复。** 新增的弹层定位直接读 `window.innerWidth` / `window.innerHeight`（`src/client/Muyu.tsx:164`），而同文件已有 `viewport()`（`src/client/Muyu.tsx:75`）。
4. **文档已过期。** `docs/development/handoff-2026-10-07.md:6` 写「全部修改未提交、未推送、未发布」，但该文档本身就在 `d07cbb8` 中，表述已不成立。

## Spec 轴

### (a) spec 要求但未闭合

1. **发布前实机回归清单未做**——`docs/development/ui-isolation.md:52` 要求补做浅色/深色主题切换、悬停、键盘焦点、拖拽、窗口边缘、卸载重载，以及「在测试页面加入带 `!important` 的全局 button/div/span/svg 规则」。后一条只在 jsdom 里做了一半（`tests/client-bundle.test.tsx:61-63`），jsdom 不构成实机级联验证。
2. **声明支持 rc.2，却只在 alpha.2 上验证过**——`package.json:52` 的 OR 范围写法正确，但 `docs/development/handoff-2026-10-07.md:47` 自述「如果保留 rc.2 支持，需分别验证两个版本」，该验证未执行。
3. **版本号未提升，发布制品对不上**——`package.json:4` 仍为 `0.1.2`，而 `registry/curated/plugin.json:7` 指向已存在的 `v0.1.2` tarball；该制品不含本次改动（peer 范围、Shadow DOM、依赖表均已改变），重复发布 0.1.2 又不被 npm 允许。属发布阻断项。

### (b) spec 没要求却改了（scope creep）

4. **`FAST_STRIKE_MS` 100 → 200**（`src/client/logic.ts:44`）已事后记入 `docs/development/ui-isolation.md:36` 作为产品规则，但仍是可感知的玩法变更（吐槽气泡出现频率翻倍），release notes 需要交代。
5. **`@deepseek-ai/cordis` peer 从 `^4.0.1` 收紧到 `~4.0.4`**（`package.json:49`）——没有任何 spec 要求这一步，且与「保留 rc.2 支持」的意图相抵，rc.2 时代的主机兼容面被削窄。
6. `.gitignore` 新增 `.playwright-cli/`、`.browser-harness.*`，与 spec 无关，无害。

### (c) 看似实现但可疑

7. **弹层顶部只做单边 clamp**——`src/client/Muyu.tsx:165` 的 `Math.max(8, rect.top)` 只会把面板往下推，窗口矮、面板高（色板换行后）时翻转仍可能顶出屏幕。
8. **`pointercancel` 被当作敲击**——`src/client/Muyu.tsx:320-333` 让 `pointerup` 与 `pointercancel` 共用同一个 `up`，且未移动即记一次功德（`src/client/Muyu.tsx:327`）。被浏览器取消的手势（滚动接管、手势取消）会白送功德。此条继承自 `main`，但就在本次改动的交互代码内。
9. **键盘自动重复未过滤**——`src/client/Muyu.tsx:336-340` 无 `event.repeat` 守卫。与第 4 条叠加后，长按回车/空格的每次重复都短于 200ms，于是每个重复都 push 一个 5 秒气泡及其计时器，按住不放会持续堆积状态与定时器。
10. **非 hover 定时器未在卸载时清理**——`src/client/Muyu.tsx:240`、`:249`、`:286` 的 `setTimeout` 未登记，清理 effect（`src/client/Muyu.tsx:179-186`）只覆盖 hover 定时器与拖拽监听；暴富 floater 时长为 88 秒，插件卸载后仍会按引用留住已卸载的树。
11. **`loadState` 接受非有限数**——`src/client/logic.ts:207` 只判 `typeof === 'number' && >= 0`，手工写入 `1e999` 会得到 `Infinity` 计数，并使彩虹保证条件恒真。

### 上一轮结论核对

`docs/development/code-review-2026-10-11.md`「修复状态」6 条逐条核实，**全部真实落地**：七彩焦点环恢复可见、`--muyu-fish-radius` 普通/七彩共用、200ms 已记录并测试覆盖、测试文件纳入 `tsconfig.json`、文档测试数量统一为 5、「alpha.2 专属的无效 `pnpm-workspace.yaml` 排除项」已移除（该文件本次未进入 diff，内容等于 `main`）。

需要更正上一轮报告的「轴外上下文」：它称本分支不含 pointercancel / 多指 pointerId / 键盘 repeat / 定时器 / 存储 schema 加固那一批修复，其中 **存储 schema 校验实际存在**（`src/client/logic.ts:195-210` 有 typeof 校验、hex 正则、位置 clamp），**`pointercancel` 也已监听**（只是被错误地当作敲击处理，见第 8 条）。真正缺失的是 pointerId 跟踪、`event.repeat` 过滤，以及非 hover 定时器的卸载清理。

## 总结

- **Standards 轴 4 项**，无硬违规；最重为 `tests/client-bundle.test.tsx:78` 恒真断言，spec 的「鱼体不绑动画」因此缺少有效守卫。
- **Spec 轴 11 项**，最重为发布阻断项：版本号未提升而 registry 仍指向旧的 `v0.1.2` 制品。
- 覆盖本次改动核心声明的核对结论：lib 产物与 `src` 同步（`invariant` 文件/导出/peer 已清干净，`lib/client.js` 仅 `require` react、react-dom、react/jsx-runtime，与平台模块表一致），Shadow DOM 隔离、`cssText` 进 Shadow Root 而非 `document.head`、`composedPath()` 判定、木鱼锤常驻、`fishShake` 移除均已落实。

## 建议修复顺序

1. 发版前必须：提升 `package.json` 版本并同步 `registry/curated/plugin.json` 的 tarball 指向；确认 rc.2 是否继续声明（声明就得验证，不验证就收窄范围）。
2. 交互健壮性：`event.repeat` 过滤、pointerId 跟踪、`pointercancel` 不记敲击、定时器卸载清理。
3. 测试与清理：修掉恒真断言，补弹层顶部边界用例，删除 `css.hovered` 残留与失效 transition。
4. 文档：更新交接稿中「未提交」的历史表述，并补做 `ui-isolation.md:52` 列出的实机回归。
