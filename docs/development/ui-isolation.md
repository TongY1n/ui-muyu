# 木鱼外观与样式隔离规范

2026-10-07 创建，2026-10-10 更新验证状态。维护者内部说明；本轮在 `codex/muyu-dsh-020-adaptation` 开发，基线为 `main` 的 `ef96072`。

## 外观约定

- 2026-10-08 用户根据实机预览改回 README 原版轮廓。普通状态的鱼体为 64px（含 3px 边框）的轻微不规则圆形，使用 main 原有的 `border-radius: 46% 54% 54% 46% / 52% 50% 50% 48%`；不得自行拟合新的普通轮廓。保留 main 的木色渐变、眼睛、槽线和交互。
- `docs/images/preview.png` 是受保护的原图，不得为了让实现“通过验收”而重绘或替换。普通状态与七彩状态都以该图和 main 原 CSS 的轻微不对称百分比圆角为准；七彩彩蛋只改变颜色渐变和光晕，不能出现方形内层或黑色内边。
- 不再使用拟合 SVG path 和 `clip-path` 重建普通鱼体；边框由同一个不规则圆角盒绘制。七彩彩蛋沿用同一个圆角盒，并显式使用 `background-clip: border-box`，让渐变覆盖透明边框，避免宿主背景形成黑边。外阴影、内阴影和键盘焦点环不可被裁切。
- 木鱼锤始终挂载并可见，点击时只播放木鱼锤的 `malletSwing` 动画；鱼体本身不得绑定位移或旋转动画。
- 设置入口仍为计数旁的 `···`。main 已经如此，README 展示的是打开面板后的状态。面板保留木色及红、蓝、绿、紫、橙六个色块、自选颜色、随机颜色和重置。
- 面板在底部空间不足时向上展开，在左右边缘向内平移；窄窗口允许色板换行。

## 隔离边界

`Muyu` 创建一个 open Shadow Root，使用宿主提供的 `react-dom.createPortal` 渲染完整挂件，包括弹层、木槌、反馈文字和局部 `<style>`。不引入第二份 React，不另建 React Root，保留宿主的语言和上下文。

`shared/tsdown.client.ts` 将 CSS Module 编译为类名表与 `cssText`。CSS 导入不再向 `document.head` 注入样式，组件卸载时样式一并移除。

内部 CSS 的尺寸、字体、间距、按钮外观、圆角、边框宽度、阴影都由插件定义。内部无需堆叠 `!important`；仅 Shadow Host 用它保护边界自身。不要用 `:global()` 泄漏规则，也不要将弹层 portal 回宿主的 `document.body`。`:global()` 并不能穿透 Shadow DOM。

这项隔离阻止宿主 CSS 选择器影响内部元素，不是对未来所有 DSH API、挂载行为或浏览器改变的兼容保证。宿主移除插件、裁切其祖先或更改插件 API，仍需单独适配。

## 主题接口

仅在 `.root` 中将 DSH 颜色 token 映射为 `--muyu-*` 变量。颜色通过 Shadow Host 继承，随主题动态更新；布局和阴影不读取 DSH token。

当颜色 token 缺失时使用 `Canvas`、`CanvasText` 和 `color-mix()`；继承 `color-scheme`，不硬编码深色面板。木色、功德金色等插件固有色保留。若 DSH 将来更换颜色 token，应修改这一处映射并重新验证两种主题。

## 事件与边界

Shadow DOM 会将 document 层收到的 `event.target` 重定向为 Host。判断是否点击面板内部必须使用 `event.composedPath()`；不能只用 `panel.contains(event.target)`，否则点击色块或重置会提前关闭弹层。

拖拽仍由 window 的 pointer 监听器追踪；位置、颜色和计数继续使用原 localStorage 键。主体定位高度为 96px（64px 鱼体 + 6px 间隔 + 26px 计数），并独立处理展开面板的窗口边界。

相邻两次敲击间隔小于 `88ms` 时显示快速敲击提示。该窗口是为快速连续点击保留可见反馈的产品规则，修改时必须同步更新测试和交接记录。功德浮字从木鱼边界上方约 4px 处开始，避免贴住边框。

## 验证与当前限制

`pnpm test` 先构建，再从真实 `lib/client.js` 加载模块工厂和 slot 注册，检查：Shadow Root/样式生命周期、StrictMode 挂载、敲击、换色、重置、外部点击、跨边界拖拽、持久化，以及弹层边缘定位。测试使用 jsdom，不能代替真实浏览器的像素和主题验收。

当前开发分支的 alpha.2 适配已通过类型检查、构建、5 项交互测试、依赖元数据检查、pack dry-run 和 `git diff --check`。旧 main bundle 运行隔离测试会因缺少 Shadow Root 而失败，这是预期的基线差异；验收以当前分支构建产物为准。由于 pnpm 会尝试重建现有 node_modules，脚本验证使用 `pnpm_config_verify_deps_before_run=false` 保留当前依赖，未清空或重装工作区依赖。

2026-10-10 已在官方 DSH `0.2.1-alpha.2` Web 宿主中完成隔离验证：`/Users/xst/deepseek-harness` 为 `local/dsh-v0.2.1-alpha.2`，配置使用 `DSH_HOME=/tmp/dsh-home-alpha2`，本地 link 安装插件并启动 `127.0.0.1:4162`。页面 boot manifest、Shadow Root、64px 不规则轮廓、阴影、常驻木鱼锤及展开面板均已检查；截图保存在 `/tmp/muyu-alpha2-open.png`。验证 token 不写入文档，也未操作真实 `~/.dsh`。浏览器检查还确认插件 stylesheet 只存在于 Shadow Root，宿主 `document.head` 没有注入插件样式。

2026-10-10 已补完成官方 DSH `0.2.1-alpha.2` Desktop 实机验证：运行 `pnpm run dev:desktop`，使用 `DSH_HOME=/tmp/dsh-home-alpha2-desktop`，通过 Desktop 插件页安装绝对路径 `/Users/xst/Dsh/ui-muyu` 并启用。`dsh-app://app/` 页面成功创建 muyu Shadow Root；64×64 鱼体、README/main 不规则圆角、外阴影、内阴影、常驻木鱼锤和展开面板均已读取。敲击检查确认 `malletSwing` 生效且鱼体 `animation-name: none`；面板包含六个色块、随机颜色和重置计数。截图保存在 `/tmp/muyu-alpha2-desktop.png`，不是项目资产。

2026-10-10 根据用户复核结果，撤销会形成黑色内边的七彩裁剪方案。`.rainbow` 恢复 main 的不规则圆角、可见溢出和 `background-clip: border-box`；透明边框由渐变覆盖，普通与七彩状态的外轮廓保持一致。此前使用 `padding-box` 的截图不再作为验收依据。

早先压力测试页的截图属于被淘汰的 CSS 加权方案，不代表最终 Shadow DOM 实现；不要宣称已经和 README 像素一致，当前验收依据是 main 的圆角参数、结构约定和 alpha.2 实机检查结果。详细环境与历史限制见 [交接补充稿](./handoff-2026-10-07.md)。

发布前仍应在隔离配置目录中补做浅色/深色主题切换、悬停、键盘焦点、拖拽、窗口边缘和插件卸载重载回归；当前 Web 与 Desktop 的静态结构、样式隔离、面板和敲击动作已验证。应在测试页面加入带 `!important` 的全局 button/div/span/svg 规则，确认内部视觉不变。始终隔离 DSH 配置目录，不操作用户真实 `~/.dsh`。

## 参考

- [MDN：Shadow DOM 的样式封装](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [React：createPortal 与上下文、事件传播](https://react.dev/reference/react-dom/createPortal)
