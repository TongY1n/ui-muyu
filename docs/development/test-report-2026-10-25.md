# 测试报告：赛博木鱼真实宿主五维测试（2026-10-25）

对 `codex/muyu-dsh-020-adaptation` 分支（HEAD `bb4e9e7` + 工作区 speed 特性完善改动）在**真实 DSH Web 宿主**中执行的五维前端测试：正向 / 反向 / 边界 / 安全 / 回归，外加可访问性、稳定性、国际化补充维度。

## 概要

| 维度 | 用例数 | 通过 | 未执行（工具限制） | 备注 |
|---|---|---|---|---|
| 工程层 | typecheck / build / vitest | 全部 | 0 | vitest 13/13 |
| 正向 P | 7 | 7 | 0 | P7 带环境备注 |
| 反向 N | 5 | 4 | 1（N1 右键） | N1 由 vitest 覆盖 |
| 边界 B | 5 组（含 6 个存储变体） | 全部 | 0 | 精确 150ms 边界由两侧逼近覆盖 |
| 安全 S | 6 | 6 | 0 | — |
| 回归 R + 补充 | 4 | 4 | 0 | — |

**结论：未发现功能性缺陷。** 1 个环境级发现（宿主引导对话框遮挡木鱼指针交互）、1 个行为学备注（`pointerenter` 在合成指针下不触发，已有兜底）。

## 测试环境

- 测试对象：工作区实时构建（`tsc` + `tsdown` 产出 `lib/client.js` 40.61 kB），经 profile `link:/Users/xst/Dsh/ui-muyu` 挂载。
- 宿主：自起 `dsh web --port 4161`（DSH `0.2.1-rc.3`，DSH_HOME `/tmp/dsh-home-muyu-rc2-20261021`，与开发者的 4160 进程隔离）。鉴权走 launch token 正常进入。
- 浏览器：ZCode 内置浏览器 1280×720，真实指针/键盘事件驱动；速度徽标等内部状态必要时经 React fiber 只读取证。
- 截图证据：`gui-test-screenshots/r3_*.png`（本地产物，未入库）。

## 正向（P）

| # | 用例 | 结果 | 证据 |
|---|---|---|---|
| P1 | 真实 `shell.overlay` 注入：默认锚点 (1108,600) 与视口公式一致，EN locale 文案，storage 初始化 | ✅ | `r3_p1_initial.png` |
| P2 | 鼠标点击敲击：+1、位置不动、storage 同步 | ✅ | `r3_p2_click.png` |
| P3 | 键盘 Enter 连敲 5 次：计数 +5、4 条英文吐槽气泡（间隔 23–90ms < 150ms 阈值） | ✅ | `r3_p3_strike_bubbles.png` |
| P4 | 拖拽：(1181,632)→(600,300) 位移精确到 (527,268)，计数不变 | ✅ | `r3_p4_dragged.png` |
| P5 | 设置弹层：6 色板/取色器/随机/重置齐全；换红 #c0392b 全链路同步（鱼体/aria-pressed/storage） | ✅ | DOM 校验 |
| P6 | 刷新持久化：位置 (527,268)、红色、计数 0 全部恢复 | ✅ | `r3_p6_reload.png` |
| P7 | 速度徽标（新特性）：指针在鱼上时显示当前间隔（两次点击后显示 5111ms ≈ 真实间隔）；离开隐藏且保留最佳；回到鱼上首次点击即显示保留成绩 | ✅ | `r3_p7_speed_badge.png`、`r3_p7_reenter.png` |

**P7 备注**：合成指针的「瞬移」不产生 `pointerenter`（`leave` 正常、`enter` 不触发，经 fiber 取证 `fishInside` 保持 false）。「移回鱼上不点击就预览保留成绩」这条路径因此无法在本环境验证；开发者已在 `onPointerDown` 显式调用 `enterFish()` 兜底（代码注释原话「Pointer events are the reliable boundary signal in the Shadow Root」），点击主路径不受影响，真实鼠标下预期可用。

## 反向（N）

| # | 用例 | 结果 |
|---|---|---|
| N1 | 右键不敲击 | ⚠️ 本运行时不支持右键合成；代码 `event.button !== 0 → return` 由 vitest 覆盖 |
| N2 | Shift / 字符键按下不敲击 | ✅ 计数不变 |
| N3 | 弹层内按钮点击不关闭；点击外部空白关闭 | ✅（重置后 `aria-expanded` 保持 true；外部点击后 false） |
| N4 | 慢速敲击（间隔 3.2s）不弹气泡 | ✅ 计数 +2、气泡为空 |
| N5 | 拖拽不误触敲击 | ✅（P4/P1d 等多次拖拽计数均不变） |

## 边界（B）

| # | 用例 | 结果 |
|---|---|---|
| B1 | 四向拖拽出界钳制 | ✅ (0,0) / (1132,624) / (0,624) / (1132,0) 全部精确 |
| B2 | 视口 1280×720→800×600 重钳制 | ✅ x 1132→652（=800−148）；y 本就在界内不动（符合钳制语义） |
| B3 | 贴底时设置弹层向上翻转 | ✅ `bottom:calc(100%+6px)`，矩形 624–688 全在 720 视口内（`r3_b3_flip.png`） |
| B4 | 损坏 storage 六变体（坏 JSON / 负数计数 / Infinity / 恶意 color / 超大坐标 / 非法 rainbow） | ✅ 全部安全回退且无崩溃：坏 JSON 全默认；非法计数归零；`red;}body{display:none}` 被拒用默认色且宿主 body 不受影响；坐标钳制；rainbow 置 false |
| B5 | 150ms 快敲阈值 | ✅ 两侧逼近：23–90ms 弹气泡、3.2s 不弹（精确 150ms 边界不可合成，vitest 覆盖判定逻辑） |

## 安全（S）

| # | 用例 | 结果 |
|---|---|---|
| S1 | 无 token 访问 401 | ✅（curl 直测） |
| S2 | Shadow DOM 双向隔离 | ✅ 宿主 158 个样式零进入影子树；木鱼样式类在宿主文档出现 0 次 |
| S3 | 零网络外联 | ✅ 全部资源 origin 均为 `127.0.0.1:4161`，无任何外部请求 |
| S4 | 存储最小化 | ✅ 仅 `dsh-muyu.state.v1` 一个 key，载荷仅 {x,y,count,color,rainbow}，无 PII |
| S5 | 恶意 color 注入 | ✅（见 B4，正则白名单拒绝） |
| S6 | 宿主无回归 | ✅ 木鱼全程运行下宿主输入框可聚焦可输入 |

## 回归（R）+ 补充

- **核心行为复现**：敲击/拖拽/设置/持久化在本轮全部复现 ✅。
- **国际化**：本轮 EN 词典全链路（aria-label、计数、气泡、设置项）；zh 词典在 10-17 harness 轮已验证 ✅。
- **可访问性**：`role=button`、`tabIndex=0`、键盘可操作、`aria-expanded/pressed/live` 齐全；键盘聚焦后 2px 焦点环可见（`r3_a11y_focus.png`）✅。
- **稳定性**：100 次快速连敲（10 组×10）计数 6→143（暴击分布符合 5% 期望），全程组件存活、无卡死 ✅。

## 发现与建议

1. **【环境级，建议记录】宿主引导对话框会「隐身遮挡」木鱼**：DSH 无凭据时自动弹出的「Get started」对话框带全屏透明遮罩（`rgba(0,0,0,0)` + `pointer-events:auto`，z-index 1000），视觉上不可见，但会吞掉木鱼默认位置的全部点击/拖拽——用户会以为木鱼坏了。非木鱼缺陷；建议在 README「使用提示」里补一句：*若点击木鱼无反应，先确认没有未关闭的宿主对话框*。（本轮测试多次 reload 均复现，关闭对话框后一切正常。）
2. **【行为学备注】** `pointerenter` 合成事件不触发（见 P7 备注）——开发者已兜底，无需改动；如后续要支持「悬停即预览」，需评估真实浏览器事件再定。
3. **【测试基建】** IAB 合成点击单次约 5s、右键/多指/精确时间边界不可合成——这些路径依赖 vitest（13 用例已覆盖 pointerId 隔离、pointercancel、键盘 repeat、速度回合）。

## 复跑方式

```sh
pnpm build          # 或 node_modules/.bin/tsc -p tsconfig.build.json && node_modules/.bin/tsdown
DSH_HOME=/tmp/dsh-home-muyu-rc2-20261021 node /Users/xst/deepseek-harness/apps/cli/lib/bin.js web --port 4161 --no-open
# 用打印出的 token URL 进入；每个 reload 后注意先关掉 Get started 对话框
```
