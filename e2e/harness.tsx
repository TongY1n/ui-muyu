/**
 * 真实浏览器 E2E harness：模拟 DSH 宿主加载 lib/client.js。
 * 与 tests/client-bundle.test.tsx 同一套接线，但跑在真浏览器里：
 * require 表注入打包后的 react/react-dom/jsx-runtime（与 harness 自身同一实例），
 * slots.register 捕获木鱼组件后用 createRoot 渲染，t 用 zh 词典做插值。
 */
import { StrictMode } from 'react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as jsxRuntime from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client'
import type { ComponentType } from 'react'

type Translate = (key: string, values?: Record<string, number | string>) => string

/** zh 词典（与 src/client/locales.ts 保持一致，宿主 locale 座位的角色）。 */
const zh: Record<string, string> = {
  'fish.aria': '赛博木鱼：点击敲击，可拖拽',
  'count': '功德 +{count}',
  'settings.title': '设置',
  'color.custom': '自定义颜色',
  'color.random': '随机颜色',
  'reset': '重置计数',
  'rainbow.burst': '七彩！',
  'color.shift': '变色！',
  'strike.plus': '+1',
  'strike.crit': '+{gain} 暴击！',
  'fortune': '+{gain} 暴富！',
  'bubble.0': '慢一点嘛，木鱼都要冒烟啦~',
  'bubble.1': '这么快，功德没跟上呢_(´ཀ`」 ∠)_',
  'bubble.2': '手速过快，功德溢出……',
  'bubble.3': '再快它就要唱rap了，冷静！',
  'bubble.4': '您的手速已超越全国99%的人，请减速慢敲～',
  'bubble.5': '施主，欲速则不达～',
  'bubble.6': '木鱼头晕了，让鱼缓缓……',
  'bubble.7': '检测到手速异常，功德源已限流',
  'bubble.8': '这么急，是老板来了吗？',
  'bubble.9': '心静自然凉，手慢功德多',
  'bubble.10': '手速惊人，可惜这里不是音游',
  'bubble.11': '先喝口水，功德跑不掉～',
}

const t: Translate = (key, values) => {
  let out = zh[key] ?? key
  if (values) {
    for (const [name, value] of Object.entries(values)) out = out.replaceAll(`{${name}}`, String(value))
  }
  return out
}

type Widget = ComponentType<{ t: Translate }>
let Widget: Widget | undefined

interface LoaderPayload {
  factory: (require: (id: string) => unknown) => { apply: (ctx: unknown) => void }
}

interface ClientContext {
  effect: (callback: () => void) => void
  locale: { register: (...args: unknown[]) => () => void }
  slots: {
    inject: (name: string, callback: () => void) => void
    register: (entry: unknown, component: Widget) => void
  }
}

;(window as unknown as Record<string, unknown>).__ModuleLoader__ = {
  load({ factory }: LoaderPayload): void {
    const table: Record<string, unknown> = {
      'react': React,
      'react/jsx-runtime': jsxRuntime,
      'react-dom': ReactDOM,
    }
    const plugin = factory((id: string) => {
      if (!(id in table)) throw new Error(`harness require: 未声明的模块 ${id}`)
      return table[id]
    })
    plugin.apply({
      effect: (callback: () => void) => callback(),
      locale: { register: () => () => {} },
      slots: {
        inject: (_name: string, callback: () => void) => callback(),
        register: (_entry: unknown, component: Widget) => { Widget = component },
      },
    } satisfies ClientContext)
  },
}

async function boot(): Promise<void> {
  const response = await fetch('../lib/client.js')
  if (!response.ok) throw new Error(`加载 lib/client.js 失败: HTTP ${response.status}`)
  const source = await response.text()
  new Function('window', source)(window)
  if (!Widget) throw new Error('bundle 未注册 shell.overlay 组件')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Widget t={t} />
    </StrictMode>,
  )
  ;(window as unknown as Record<string, unknown>).__harnessReady__ = true
}

void boot().catch((error) => {
  console.error('[harness] 启动失败:', error)
  document.title = `HARNESS-ERROR: ${String(error)}`
})
