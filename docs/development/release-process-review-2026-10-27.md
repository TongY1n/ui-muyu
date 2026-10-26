# 发版流程复盘（v0.1.3 → v0.1.4）

- 日期：2026-10-27
- 范围：v0.1.3 / v0.1.4 两轮发版的过程审计（git 历史 + GitHub PR / Release / Actions 记录）
- 结论先行：**v0.1.4 本身是干净、正确的发版；问题出在 v0.1.3 那一轮——带红 CI 直推 main 并发版，且修复的是影响构建产物的问题却没有立刻补发。残留分支只是没收尾，不是流程故障的证据。**

## 一、时间线还原

| 时间 (UTC) | 事件 | 证据 |
|---|---|---|
| 10-24 21:22 | `codex/muyu-dsh-020-adaptation` 分支 push，CI 失败 | Actions run 40133959494 (failure) |
| 10-24 21:23 | v0.1.3 release 发布 | `0cfddc1` "release: prepare v0.1.3"，tag v0.1.3 指向该提交 |
| 10-24 21:42 | main push 的 CI 失败 | Actions run 40135423063 (failure) |
| 10-26 13:10 | 修复分支首次 push，CI 失败 | run 40328344793 (failure) |
| 10-26 13:24 | 补测试后 CI 转绿 | run 40330331878 |
| 10-26 14:22 | PR #1（`codex/fix-deterministic-client-bundle`）合入 main，**未发版** | `f98523c` fix: make client bundle generation path independent；`e4a94ea` test: make keyboard repeat assertion deterministic |
| 10-26 16:01 | PR #2（`codex/release-v0.1.4`）合入 main | `d0ec3d1` release: prepare v0.1.4 |
| 10-26 16:08 | v0.1.4 release 发布，tag push CI 绿 | tag v0.1.4 → `f8d319b`（merge commit），main == tag |

关键事实：

1. **v0.1.3 没走 PR**：全仓只有 PR #1 和 #2，`0cfddc1` 是直推 main 的。main 的 CI 在发版前后是红的，没有门禁拦住这次发版。
2. **红 CI 的根因是产物问题，不是测试抖动**：PR #1 修的是 "make client bundle generation path independent"——bundle 生成结果依赖构建路径，产物不可复现。这意味着 v0.1.3 发布的 npm 产物是在特定机器/路径下构建的，正确性存疑。
3. **修复滞留 main 两天**：PR #1 于 10-26 合入，但直到 v0.1.4（10-26 晚）才把修复带给用户。期间 v0.1.3 的缺陷产物一直在市场上。
4. **v0.1.4 全程正确**：走 PR、PR CI 绿、merge 后 main CI 绿、tag 指向 main 顶端的 merge commit、tag push CI 绿。codex 拉 release 分支走 PR 发版这一步，恰恰是把流程拉回正轨的动作。

## 二、问题定位

### 真正的缺口（需要修）

| # | 缺口 | 后果 |
|---|---|---|
| G1 | main 无分支保护：无 required checks、未禁直推 | 红 CI 的 commit 能进 main，红着的 main 还能出 release |
| G2 | 无发版门禁：仓库只有 `ci.yml`，没有 release workflow；bump / 打 tag / 发 release 全手动 | 没有任何机制阻止在红的 commit 上发版；也容易漏发（G3 的直接原因） |
| G3 | 已知 CI 红仍发 v0.1.3，且被修的是构建确定性问题时，fix 合入后未立刻补发 patch | 缺陷产物在外流通约 2 天 |

### 不是问题的（不需要修）

- **残留分支**：3 个开发分支内容均已进 main。`codex/release-v0.1.4` 远端已自动删除，本地指向的 `05b09c2` 是被 rebase 掉的孤儿提交，`git diff 05b09c2 d0ec3d1` 为空（内容与已合并版本完全一致）。清掉即可。
- **用 release 分支 + PR 发版**：这个模式是合理的（version bump 走 PR 让 CI 验证 release metadata），保持。

## 三、执行清单

### 1. 立即：清理残留分支

```bash
# 本地（两个已完全 merged，用 -d；release 分支含孤儿提交，需要 -D）
git checkout main && git pull
git branch -d codex/fix-deterministic-client-bundle codex/muyu-dsh-020-adaptation
git branch -D codex/release-v0.1.4

# 远端
git push origin --delete codex/fix-deterministic-client-bundle codex/muyu-dsh-020-adaptation
```

### 2. 配置：main 分支保护（GitHub → Settings → Branches）

- [ ] Require a pull request before merging（禁止直推 main）
- [ ] Require status checks to pass：勾选 ci.yml 的 `verify` job 为 required
- [ ] 仓库设置勾选 "Automatically delete head branches"（PR 合并后自动删分支，收尾自动化）

### 3. 规则：固化为团队约定（可写入 CONTRIBUTING.md）

1. **发版门禁**：只从 main 上绿 CI 的 commit 打 tag；tag push 的 CI 是最后一道验证（现状已如此，保持）。
2. **fix 跟发**：修构建/产物问题的 fix 合入 main 后，紧跟一个 release PR 发 patch，不过夜。普通小 fix 可以攒，但构建确定性类的问题必须立刻发。
3. **release PR 模式**：延续 v0.1.4 的做法——`codex/release-vX.Y.Z` 分支 bump 版本 → PR 让 CI 验证（`release:check`、`pack:check`、`git diff --exit-code -- lib` 都在 ci.yml 里）→ merge 后打 tag 发 release。

### 4. 可选增强

- [ ] 加一个 release workflow：tag push 时自动 `pnpm build` + `pnpm publish` / `gh release create`，把发版从手动步骤变成机器步骤，消除"忘了发"这类人为缺口（对应 G2/G3）。

## 四、附：核对命令

开发同学可自行复核报告中的事实：

```bash
# tag 指向与 main 对齐
git rev-parse v0.1.4^{commit} main        # 两者应同为 f8d319b
git log --oneline v0.1.4..main            # 应为空

# v0.1.3 无 PR、直推 main
gh pr list --state all                     # 只有 #1、#2

# CI 失败记录
gh run list --limit 12                     # 10-24 main failure / 10-26 首次 fix push failure

# 孤儿提交与已合并版本内容一致
git diff 05b09c2 d0ec3d1 --stat            # 应为空

# 分支均已合并
git branch --merged main
```
