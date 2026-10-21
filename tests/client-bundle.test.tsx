// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import React, { StrictMode, type ComponentType } from 'react'
import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

const require = createRequire(import.meta.url)
type Translate = (key: string, values?: Record<string, number>) => string
const runtime = globalThis as typeof globalThis & {
  process?: {
    cwd?: () => string
    env?: Record<string, string | undefined>
  }
}
const bundle = readFileSync(
  runtime.process?.env?.MUYU_TEST_BUNDLE ?? resolve(runtime.process?.cwd?.() ?? '.', 'lib/client.js'),
  'utf8',
)

/** Exercise the shipped factory and slot registration, including compiled CSS. */
function mountBundle() {
  let Widget: ComponentType<{ t: Translate }> | undefined
  const sheetsBefore = document.head.querySelectorAll('style').length
  const loader = {
    load({ factory }: { factory: (require: ReturnType<typeof createRequire>) => { apply: (ctx: unknown) => void } }) {
      const plugin = factory(require)
      plugin.apply({
        effect: (callback: () => void) => callback(),
        locale: { register: () => () => {} },
        slots: {
          inject: (_name: string, callback: () => void) => callback(),
          register: (_entry: unknown, component: ComponentType<{ t: Translate }>) => { Widget = component },
        },
      })
    },
  }
  Object.defineProperty(window, '__ModuleLoader__', { configurable: true, value: loader })
  new Function('window', bundle)(window)
  if (!Widget) throw new Error('The bundle did not register its overlay')
  const t: Translate = (key, values) => key === 'count' ? `count ${values?.count}` : key
  const mounted = render(<StrictMode>{React.createElement(Widget, { t })}</StrictMode>)
  const host = mounted.container.querySelector('[data-muyu-host]')
  expect(host, 'The widget must be enclosed in a Shadow DOM host').not.toBeNull()
  const shadow = host?.shadowRoot
  if (!shadow) throw new Error('Missing shadow root')
  const root = shadow.querySelector('div')
  if (!root) throw new Error('Missing widget root')
  return { ...mounted, host, shadow, root, ui: within(root), sheetsBefore }
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.head.querySelectorAll('style').forEach(style => style.remove())
})

test('the shipped bundle scopes all controls and CSS to a shadow root and cleans up on unmount', () => {
  const pageStyle = document.createElement('style')
  pageStyle.textContent = 'button, [role=button] { border-radius:0!important; padding:40px!important; background:cyan!important }'
  document.head.append(pageStyle)
  const view = mountBundle()
  expect(document.head.querySelectorAll('style').length).toBe(view.sheetsBefore)
  expect(view.shadow.querySelectorAll('style')).toHaveLength(1)
  expect(document.querySelectorAll('[role=button]')).toHaveLength(0)
  expect(view.ui.getByRole('button', { name: 'fish.aria' }).getRootNode()).toBe(view.shadow)
  expect(view.shadow.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
  const widgetStyle = view.shadow.querySelector('style')?.textContent ?? ''
  expect(widgetStyle).toMatch(/--muyu-fish-radius:46% 54% 54% 46%\s*\/\s*52% 50% 50% 48%/)
  expect(widgetStyle).toContain('border-radius:var(--muyu-fish-radius)')
  expect(widgetStyle).toContain('border:3px solid #0000')
  expect(widgetStyle).toContain('background-clip:border-box')
  expect(widgetStyle).toContain('box-shadow:var(--muyu-glow-from)')
  expect(widgetStyle).toMatch(/rainbow:focus-visible\{[^}]*outline-offset:3px[^}]*outline:2px solid/)
  expect(widgetStyle).not.toContain('background-clip:padding-box')
  const fishClass = view.ui.getByRole('button', { name: 'fish.aria' }).className.split(' ')[0]
  expect(widgetStyle).not.toMatch(new RegExp(`\\.${fishClass}\\{[^}]*animation:`))
  view.unmount()
  expect(view.host?.isConnected).toBe(false)
  expect(view.shadow.childNodes).toHaveLength(0)
})

test('striking, recoloring and resetting work across the shadow event boundary', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  const { ui, shadow } = mountBundle()
  const fish = ui.getByRole('button', { name: 'fish.aria' })
  fireEvent.keyDown(fish, { key: 'Enter' })
  expect(ui.getByText('count 1')).toBeTruthy()
  const settings = ui.getByRole('button', { name: 'settings.title' })
  fireEvent.click(settings)
  const colors = ui.getAllByRole('button', { name: 'color.custom' })
  expect(colors).toHaveLength(6)
  const red = colors[1]
  // A composed pointerdown is retargeted to the shadow host at document level.
  fireEvent(red, new MouseEvent('pointerdown', { bubbles: true, composed: true, button: 0 }))
  expect(settings.getAttribute('aria-expanded')).toBe('true')
  fireEvent.click(red)
  expect(JSON.parse(localStorage.getItem('dsh-muyu.state.v1')!).color).toBe('#c0392b')
  const reset = ui.getByRole('button', { name: 'reset' })
  fireEvent(reset, new MouseEvent('pointerdown', { bubbles: true, composed: true, button: 0 }))
  fireEvent.click(reset)
  expect(ui.getByText('count 0')).toBeTruthy()
  expect(shadow.querySelector('input[type=color]')).toBeTruthy()
  fireEvent(document.body, new MouseEvent('pointerdown', { bubbles: true, composed: true }))
  expect(settings.getAttribute('aria-expanded')).toBe('false')
})

test('rapid strikes show a complaint bubble', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  vi.spyOn(Date, 'now').mockReturnValueOnce(1_000).mockReturnValueOnce(1_080)
  const { ui } = mountBundle()
  const fish = ui.getByRole('button', { name: 'fish.aria' })
  fireEvent.keyDown(fish, { key: 'Enter' })
  fireEvent.keyDown(fish, { key: 'Enter' })
  expect(ui.getByText('bubble.6')).toBeTruthy()
})

test('strike interval is live while tapping and keeps the best interval after idle', () => {
  vi.useFakeTimers()
  vi.setSystemTime(1_000)
  const { ui } = mountBundle()
  const fish = ui.getByRole('button', { name: 'fish.aria' })
  fireEvent.keyDown(fish, { key: 'Enter' })
  vi.advanceTimersByTime(80)
  fireEvent.keyDown(fish, { key: 'Enter' })
  expect(ui.getByText('80ms')).toBeTruthy()
  act(() => { vi.advanceTimersByTime(500) })
  expect(ui.getByText('80ms')).toBeTruthy()
  fireEvent.mouseOut(fish)
  expect(ui.queryByText('80ms')).toBeNull()
  fireEvent.mouseOver(fish)
  expect(ui.getByText('80ms')).toBeTruthy()
})

test('pointer dragging across the boundary moves the widget without striking and persists it', () => {
  const { ui, unmount } = mountBundle()
  const fish = ui.getByRole('button', { name: 'fish.aria' })
  const before = JSON.parse(localStorage.getItem('dsh-muyu.state.v1')!)
  fireEvent(fish, new MouseEvent('pointerdown', { bubbles: true, composed: true, button: 0, clientX: 100, clientY: 100 }))
  fireEvent(window, new MouseEvent('pointermove', { clientX: 50, clientY: 60 }))
  fireEvent(window, new MouseEvent('pointerup'))
  const after = JSON.parse(localStorage.getItem('dsh-muyu.state.v1')!)
  expect(after).toMatchObject({ x: before.x - 50, y: before.y - 40, count: 0 })
  unmount()
  mountBundle()
  expect(JSON.parse(localStorage.getItem('dsh-muyu.state.v1')!)).toEqual(after)
})

test('pointer cancellation and unrelated pointer ids do not strike the fish', () => {
  const { ui } = mountBundle()
  const fish = ui.getByRole('button', { name: 'fish.aria' })
  const down = new Event('pointerdown', { bubbles: true, composed: true })
  Object.defineProperties(down, {
    button: { value: 0 }, clientX: { value: 100 }, clientY: { value: 100 }, pointerId: { value: 1 },
  })
  fireEvent(fish, down)
  const up = new Event('pointerup')
  Object.defineProperty(up, 'pointerId', { value: 2 })
  fireEvent(window, up)
  const cancel = new Event('pointercancel')
  Object.defineProperty(cancel, 'pointerId', { value: 1 })
  fireEvent(window, cancel)
  expect(ui.getByText('count 0')).toBeTruthy()
})

test('keyboard auto-repeat does not create another strike', () => {
  const { ui } = mountBundle()
  const fish = ui.getByRole('button', { name: 'fish.aria' })
  fireEvent.keyDown(fish, { key: 'Enter' })
  fireEvent.keyDown(fish, { key: 'Enter', repeat: true })
  expect(ui.getByText('count 1')).toBeTruthy()
})

test('an opened panel flips above the counter and shifts inward when it would overflow', () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const flipped = this.style.bottom !== ''
    return {
      x: -20, y: flipped ? 400 : 750, left: -20, right: 200,
      top: flipped ? 400 : 750, bottom: flipped ? 464 : 814,
      width: 220, height: 64, toJSON: () => ({}),
    }
  })
  const { ui } = mountBundle()
  fireEvent.click(ui.getByRole('button', { name: 'settings.title' }))
  const popover = ui.getByRole('button', { name: 'reset' }).parentElement
  expect(popover?.style.bottom).toBe('calc(100% + 6px)')
  expect(popover?.style.transform).toBe('translate(28px, 0px)')
})
