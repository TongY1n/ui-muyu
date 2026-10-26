# 测试报告：生成 bundle 路径稳定性修复（2026-10-26）

## 修复内容

CI 的 `Check generated bundle` 失败是因为 CSS Module 编译把本机绝对路径用于虚拟模块 ID 和 Lightning CSS `filename`。本地生成的类名与 GitHub Actions runner 生成的类名不同，且 bundle region marker 记录了不同的 checkout 路径。

修复后，虚拟模块 ID 和 CSS Module 哈希只使用仓库相对路径；绝对路径只保留给 `readFile` 与 `addWatchFile`。发布产物不再依赖 checkout 位置。

## 验证结果

- 在当前 checkout 构建：`tsc -p tsconfig.build.json`、`tsdown` 通过。
- 在独立的 `/tmp/ui-muyu-determinism-check` checkout 构建：`lib/client.js` 和 `lib/client.js.map` 与当前 checkout 字节级一致。
- TypeScript 类型检查：通过。
- Vitest：2 个测试文件、14 项通过。
- `pnpm pack --dry-run`：通过。
- `node scripts/check-release-metadata.mjs`：通过。
- `git diff --check`：通过。

新增 bundle 测试确认 `lib/client.js` 不包含当前 checkout 的绝对路径，并保留稳定的 `src/client/Muyu.module.css.mjs` 标识。
