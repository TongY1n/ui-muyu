# 代码审查：codex/muyu-dsh-020-adaptation（2026-10-11）

- **审查对象**：本分支全部**未提交工作区改动**（分支与 `main` 同点 `ef96072`，零提交；21 个修改文件 + 3 个未跟踪文件）
- **Spec 来源**：`docs/development/ui-isolation.md` + `docs/development/handoff-2026-10-07.md`（含 2026-10-10 alpha.2 适配记录）
- **Standards 来源**：`main` 无成文规范；以 `ui-isolation.md` 规范性条款为 documented standards + Fowler smell 基线
- **方法**：双轴（Standards / Spec）独立审查后汇总；审查期间未修改任何工作区文件
- **工具说明**：审查执行时子代理通道不可用，两轴由主代理亲自完成，仍保持两轴独立汇报

## Standards 轴

### 疑似硬违规（documented standard）

1. **彩虹状态键盘焦点环被整体移除**——`src/client/Muyu.module.css` 新增 `.rainbow:focus-visible { outline: none }`，且 `tests/client-bundle.test.tsx:66` 将其固化为预期行为。spec 原文："外阴影、内阴影和键盘焦点环不可被裁切"（ui-isolation.md §外观约定）。注释理由是焦点环"看起来像用户上报的黑色圆环"——这是用真实的 a11y 回退（WCAG 2.4.7 焦点可见性）换视觉洁癖。普通鱼体有 outline 焦点环，彩虹态完全没有，键盘用户在彩蛋状态下失去焦点指示。**建议改为可见的非黑色方案（如 `outline: 2px solid currentColor`）而非删除。**

### Smell（judgement call）

2. **Duplicated Code**：鱼体圆角值 `46% 54% 54% 46% / 52% 50% 50% 48%` 在 `.fish` 与 `.rainbow` 两处字面重复（spec 格外强调两状态轮廓必须一致，同步风险）——建议提为 `--muyu-fish-radius` 变量一处定义。
3. **测试不在 typecheck 覆盖内**：`tests/` 不在 tsconfig `include`（仅 `src/**`），`pnpm typecheck` 不检查测试文件，vitest 只转译不查类型。
4. **pnpm-workspace.yaml 追加 74 行 alpha.2 排除项**：独立仓中该文件无 `minimumReleaseAge` 主键配套，属死配置加长——无害但无收益（历史考证见 job 目录废轮 ADR 认知）。
5. 生成物自洽性核对**通过**：`src/invariant.ts` 删除后，`lib/invariant.js`、`lib/types/invariant.d.ts`、exports、files、tsdown entry 全部同步清除，无残留引用（`cordis.patch.yml` 本就不引用它）。

## Spec 轴

### (a) spec 要求但缺失/部分完成

1. **真实浏览器回归清单未做**——spec 自述"发布前仍应补做主题切换、悬停、键盘焦点、拖拽、窗口边缘、卸载重载回归"（ui-isolation.md §验证与当前限制）。已做的 Web/Desktop 实机验证是静态结构+敲击检查。诚实记录，但未闭合。
2. **rc.2 兼容声明未经 rc.2 验证**——peer 为 `^0.2.0-rc.2 || ^0.2.1-alpha.2`（写法正确，预发布同元组规则下 OR 链必要），但所有验证都在 alpha.2 上完成；spec 原文"如果保留 rc.2 支持，需分别验证两个版本"。

### (b) spec 没要求但改了（scope creep）

3. **`FAST_STRIKE_MS` 100 → 200**（`src/client/logic.ts:40`）——两份 spec 文档均未提及。快敲吐槽气泡触发阈值放宽一倍，直接改变彩蛋文案池触发频率，属产品行为变更，需用户裁定（若进 release notes 须遵守彩蛋红线）。
4. pnpm-workspace.yaml 的 74 行追加（同 Standards #4，spec 未提及）。

### (c) 看似实现但可疑

5. 彩虹焦点环移除（同 Standards #1，spec 条款与实现意图冲突处）。
6. **文档计数漂移**：spec 与交接稿多处写"4 项测试/4/4"，实际 `tests/client-bundle.test.tsx` 有 **5** 个 test（多出的是 rapid-strikes 气泡测试）。

### 已逐条核实为真的核心声明

- Shadow DOM + 宿主 `react-dom` `createPortal`，不引入第二份 React ✓
- cssText 挂 Shadow Root 内、不进 document.head（测试断言 head 样式数不变）✓
- 仅 `:host` 使用 `!important` ✓；颜色 token 一处映射 + `Canvas`/`color-mix` 回退 ✓
- `event.composedPath()` 判面板内部点击 ✓；localStorage 键 `dsh-muyu.state.v1` 未动 ✓；主体高 96px ✓
- 木鱼锤常驻可见、敲击仅 `malletSwing`（`fishShake` 已删，测试反向断言）✓；preview.png 未动 ✓
- react-dom 补为 dependency 且经宿主 module table 外置 ✓
- invariant 接口移除干净（peer/export/src/lib/files/entry）✓

## 轴外上下文（不计入发现）

本分支基于 `main`，**不含** 2026-09 废轮中已修复的 P1/P2 运行时缺陷（pointercancel 误敲、多指 pointerId、键盘 repeat、定时器卸载清理、存储 schema 加固/v2 迁移——见 job 目录《全量代码审查-2026-09-15.md》；修复代码在 `backup-scrapped-round-20260926.tar.gz` 与 stash 备份中）。若本轮发布，那批已知缺陷仍然在场。

## 总结

- **Standards 轴 5 项**，最重：彩虹态键盘焦点环被移除（a11y 回退）
- **Spec 轴 7 项**，最重：`FAST_STRIKE_MS` 100→200 未声明玩法变更（另有两项 spec 自我声明的未闭合验证）

## 修复前建议（历史记录）

1. 彩虹焦点环改为可见方案而非 `outline: none`
2. `FAST_STRIKE_MS` 回 100，或补记用户裁定后保留 200
3. 圆角值收敛为 `--muyu-fish-radius` 变量

## 修复状态（2026-10-11）

- 七彩状态恢复可见键盘焦点环，使用 `currentColor` 和外部 `outline-offset`，不在鱼体内部绘制黑色边圈。
- 普通与七彩状态共用 `.root` 中的 `--muyu-fish-radius`，避免轮廓参数漂移。
- `FAST_STRIKE_MS = 200` 已记录为恢复真实连续点击反馈的产品规则，并由快速敲击回归测试覆盖。
- 测试类型检查已纳入 `tsconfig.json`，构建配置继续只声明 `src`，避免测试文件进入发布产物。
- 文档中的测试数量已从 4 项统一为 5 项；alpha.2 专属的无效 `pnpm-workspace.yaml` 排除项已移除。
- 主题切换、窗口边缘、卸载重载及 rc.2 兼容性仍属于发布前实机验证项，本次代码修复没有将 jsdom 结果扩大解释为像素级验收。
