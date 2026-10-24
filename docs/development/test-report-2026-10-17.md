# 测试报告：赛博木鱼前端测试（2026-10-16 ~ 10-17）

对开发分支 `codex/muyu-dsh-020-adaptation` 做了两轮完整前端测试：第一轮针对 `ae81ddd`（alpha.2 适配），第二轮针对 `0ec6650`（alpha.4 适配）。每轮均覆盖工程层（typecheck / build / vitest）与真实浏览器交互层。

## 概要

| 轮次 | 测试对象 | 工程层 | 浏览器实测 | 新发现 |
|---|---|---|---|---|
| 第一轮 | `ae81ddd` | typecheck ❌ / build ✅ / vitest 4/5 | 12/12 通过 | 2 个（见下） |
| 第二轮 | `0ec6650` | typecheck ✅ / build ✅ / vitest 8/8 | 8/8 通过 | 0 个 |

**最终结论：alpha.4 适配版本全绿。第一轮的 2 个问题均已在 `0ec6650` 中修复并复测确认；未发现新问题。**

## 测试方法

双层验证：

1. **工程层**：`tsc --noEmit` 类型检查 → `tsc -p tsconfig.build.json && tsdown` 构建 → `vitest run`（jsdom + @testing-library，含对构建产物 `lib/client.js` 的整包加载测试）。
2. **真实浏览器层**：自建 DSH 宿主模拟 harness（`e2e/`，未入库）：stub `window.__ModuleLoader__`、注入打包后的 `react` / `react/jsx-runtime` / `react-dom` 作为 require 表、以 zh 词典实现 `t` 插值，经 `slots.register` 捕获组件后用 `createRoot` 渲染。宿主页面注入「button 强制青色放大」的对抗样式，用于目视验证 Shadow DOM 隔离。浏览器内全部通过真实输入事件（坐标点击/拖拽、键盘）驱动，结论均有截图证据（`gui-test-screenshots/`，未入库的本地产物）。

## 工程层结果（第二轮）

| 检查 | 结果 | 备注 |
|---|---|---|
| `tsc --noEmit` | ✅ 0 错误 | 第一轮失败，见「发现与闭环」 |
| `tsc -p tsconfig.build.json` + `tsdown` | ✅ | `lib/client.js` 37.73 kB（gzip 11.41 kB） |
| `vitest run` | ✅ 8/8 | `client-bundle.test.tsx` 7 用例 + `logic.test.ts` 1 用例 |

vitest 用例构成：原 5 个（Shadow DOM 隔离与卸载清理、跨影子边界敲击/换色/重置、快速连敲吐槽数泡、拖拽移动并持久化、弹层翻转与防溢出）+ 新增 2 个交互用例（pointerId 不匹配与 pointercancel 不误敲击、`event.repeat` 键盘自动重复不连击）+ 新增 `logic.test.ts`（`loadState` 拒绝非有限计数值）。

## 浏览器实测结果（第二轮，1280×720 视口）

| # | 测试点 | 结果 | 证据 |
|---|---|---|---|
| T1 | 初始渲染：默认木色 `#a35c2f`、右下角锚点 (1108,600) 与视口公式一致；对抗样式只影响宿主按钮，木鱼不受染；样式仅入影子树不泄漏 document.head | ✅ | `r2_t1_initial.png` |
| T2 | 点击敲击：功德 +1、金色计数、金色「+1」飘字（700ms 瞬态捕捉成功） | ✅ | `r2_t2_click.png` |
| T3 | 快速连敲（Enter 间隔 23–89ms）：弹出 3 条随机吐槽气泡，堆叠于木鱼右上；5 秒后自动消失；慢速敲击不弹 | ✅ | `r2_t3_bubbles.png` |
| T4 | 拖拽：位移精确（1108-581=527, 600-332=268）、拖拽不加分、storage 同步 | ✅ | `r2_t4_dragged.png` |
| T5 | 弹层防溢出（本版重点）：木鱼贴视口底缘时弹层向上翻转（`bottom: calc(100% + 6px)`），完整位于视口内 | ✅ | `r2_t5_popover_flip.png` |
| T6 | 色板换色（鱼体渐变/木槌同色/aria-pressed/storage 四处同步）、随机颜色、重置计数归零、点击外部关闭弹层（点弹层内按钮不关闭） | ✅ | `r2_t6_settings_flow.png`、`r2_t6b_random.png` |
| T7 | 刷新持久化：位置/计数/颜色从 `localStorage`（`dsh-muyu.state.v1`）完整恢复 | ✅ | —（DOM 校验） |
| T8 | 边界钳制：拖出左上精确钳制 (0,0)、拖出右下精确钳制 (1132,624)（= 视口 − 控件尺寸） | ✅ | `r2_t8_clamped.png` |

第一轮额外覆盖并 passing 的点（第二轮未重复全量执行，由回归保障）：宿主按钮对照样本、hover 显示设置按钮、focus-within 可见性、键盘 Enter/Space 双键敲击、Tab 聚焦不触发敲击。

## 发现与闭环

### 第一轮发现（对象 `ae81ddd`，均已修复）

1. **`pnpm typecheck` 失败（回归）**：`tsconfig.json` 将 `tests/**` 纳入类型检查且 `"types": []`，但缺 `@types/node`，测试文件的 `node:fs` / `node:module` / `node:path` 导入报 TS2307。背景：10-16 code review 刚把测试文件纳入 tsconfig。`pnpm build`（走只含 `src/**` 的 `tsconfig.build.json`）不受影响。
   → **`0ec6650` 补齐修复，第二轮 `tsc --noEmit` 零错误。**
2. **vitest 断言对压缩器输出过敏**：CSS 断言期望 `46% 54% 54% 46%/52%…`（斜杠无空格），lightningcss 1.32.0 实际输出带空格 ` / `。CSS 自定义属性按 token 流传递，功能等价，纯断言写法问题。
   → **`0ec6650` 改为按运行时类名动态校验（`new RegExp(`\\.${fishClass}\\{[^}]*animation:`)`），第二轮 8/8 通过。**

### 本轮无新发现

测试过程中出现的两次「可疑现象」经查均非缺陷：

- 随机颜色「点了没变」：`#c0392b` 恰在随机调色板内（1/10 概率抽中同色），复测一次即抽中 `#27ae60` 全链路同步。
- 设置按钮点击落空：按钮隐藏态为 `pointer-events: none`，可见依赖 hover 或 focus-within；焦点被先前落空的点击移除所致，属测试操作顺序问题。聚焦鱼后（含 Tab 路径）稳定复现。

## 覆盖边界与运行时限制

以下新版行为**无法在真实浏览器 GUI 层合成**（本环境合成鼠标点击单次约 5s、无 pointercancel 手势、无按住重复），由 vitest 新用例覆盖：

- 多指 pointerId 隔离（第二指的 up/cancel 不干扰第一指的拖拽会话）；
- pointercancel 不误触发敲击；
- 按住 Enter 的键盘自动重复不连击。

控制台错误监听在本环境不可用，以页面可见表现为准：两轮全程无错误表现、无资源加载失败、组件持续可用。

## 环境注意事项（非代码问题）

`pnpm install` 目前会被 supply-chain 的 `minimumReleaseAge` 策略拦截：lockfile 中 74 个 `@deepseek-ai/*@0.2.1-alpha.4` 包发布于 2026-10-15，尚不满足发布时长门槛。本次测试以 `pnpm install --frozen-lockfile --config.minimum-release-age=0` 豁免安装，并以 `node_modules/.bin` 直跑绕过 `verify-deps-before-run` 前置校验。

**影响**：CI 或其他协作者常规 `pnpm install && pnpm test` 会同样被拦；包龄过门槛后自愈。若需立即解锁，可将 alpha.4 系列加入 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude`（与现有 rc.7 条目同法）。

## 复跑方式

```sh
pnpm install            # 若被 minimumReleaseAge 拦截，见上节
pnpm check              # typecheck + build
pnpm test               # build + vitest run
# 浏览器层：
pnpm exec tsdown -c e2e/tsdown.harness.ts   # 打包 harness（产物 e2e/dist/harness.js）
python3 -m http.server 8765 --bind 127.0.0.1  # 仓库根起静态服务
# 打开 http://127.0.0.1:8765/e2e/index.html
```

harness 文件（`e2e/`）与截图（`gui-test-screenshots/`）为未入库的本地测试产物，不需要可直接删除。
