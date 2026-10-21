import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls ui-layout's SlotMap merge (the 'shell.overlay' key) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import css, { cssText } from './Muyu.module.css'
import { BUBBLE_KEYS, NS } from './locales.ts'
import {
  BUBBLE_MS, clampPosition, crossesFortune, FAST_STRIKE_MS, FORTUNE_MS, loadState,
  pickFastStrikeMessage, randomColor, rollColorShift, rollGain, rollRainbow, safeStorage,
  saveState, shade,
  type MuyuState, type Viewport,
} from './logic.ts'

/** Full props for the frame-overlay wooden fish entry. */
export type MuyuProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS>

/** Keep the complete widget and stylesheet behind one CSS boundary. A portal
 * preserves the DSH locale/context while React owns mounting and cleanup. */
export function Muyu(props: MuyuProps): ReactNode {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  const attach = useCallback((host: HTMLDivElement | null): void => {
    if (host !== null) setShadowRoot(host.shadowRoot ?? host.attachShadow({ mode: 'open' }))
  }, [])
  return (
    <div ref={attach} data-muyu-host="">
      {shadowRoot === null ? null : createPortal(
        <>
          <style>{cssText}</style>
          <MuyuWidget {...props} />
        </>,
        shadowRoot,
      )}
    </div>
  )
}

/** One floating merit label, removed by its own timer. */
interface Floater {
  id: number
  label: string
  rainbow: boolean
}

/** One fast-strike complaint bubble, removed by its own timer. */
interface Bubble {
  id: number
  text: string
}

/** Strike-interval display for the current tapping run. */
interface StrikeSpeed {
  currentMs: number
  bestMs: number
  active: boolean
}

/** An in-flight drag session (null when idle). */
interface DragSession {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  moved: boolean
}

/** Pointer movement below this distance counts as a strike, not a drag. */
const DRAG_THRESHOLD_PX = 4
/** Mallet swing / fish shake duration. */
const SWING_MS = 240
/** Floating label lifetime. */
const FLOATER_MS = 700
/** Inactivity window after which the current interval is retained as the run best. */
const SPEED_IDLE_MS = 500
/** How long the hover reveal lingers after the pointer leaves, so the pointer
    can reach the settings button (which sits beyond the root's edge). */
const HOVER_LEAVE_MS = 1_000

/** Quick-pick body colors shown in the settings popover. */
const PRESET_COLORS = ['#a35c2f', '#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#e67e22'] as const

/** The current viewport (the widget clamps itself inside it). */
function viewport(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight }
}

/**
 * A wooden-fish mallet (hammer) icon hovering above the fish. Its wood tones
 * derive from the current fish color, so recoloring the fish recolors the
 * mallet together; while the rainbow easter egg is active the mallet wears the
 * same rainbow gradient as the fish.
 * @param props - the fish's current base color and rainbow flag.
 * @returns the mallet svg.
 */
function MalletIcon({ color, rainbow }: { color: string; rainbow: boolean }): ReactNode {
  // A per-instance gradient id keeps HMR double-mounts from colliding.
  const gradientId = useId()
  const paint = rainbow ? `url(#${gradientId})` : color
  const stroke = rainbow ? `url(#${gradientId})` : shade(color, 0.55)
  const handle = rainbow ? `url(#${gradientId})` : shade(color, 0.72)
  return (
    <svg className={clsx(css.mallet, rainbow && css.malletRainbow)} viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      {rainbow
        ? (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f00" />
              <stop offset="20%" stopColor="#ff0" />
              <stop offset="40%" stopColor="#0f0" />
              <stop offset="60%" stopColor="#0af" />
              <stop offset="80%" stopColor="#80f" />
              <stop offset="100%" stopColor="#f0f" />
            </linearGradient>
          </defs>
        )
        : null}
      <g transform="rotate(-45 12 12)">
        <rect x="10.8" y="3" width="2.4" height="15" rx="1.2" fill={handle} />
        <circle cx="12" cy="4.5" r="5" fill={paint} stroke={stroke} strokeWidth="1" />
      </g>
    </svg>
  )
}

/**
 * The cyber wooden fish: a draggable, always-on-top widget mounted on
 * document.body. Pointer-press on the fish starts a drag session on the
 * window; a press that never moves beyond the threshold counts as a strike.
 * Strikes gain 1 merit (or a 5%-odds crit of 2..9), float a gold "+N", swing
 * the mallet, roll the rainbow easter egg (guaranteed past 100,000 cumulative
 * strikes), and — when they arrive faster than FAST_STRIKE_MS apart — pop a
 * random complaint bubble at the fish's top-right corner. Position, count,
 * color, and rainbow mode persist through localStorage.
 * @param props - the locale seat.
 * @returns the floating widget.
 */
function MuyuWidget({ t }: MuyuProps): ReactNode {
  const [state, setState] = useState<MuyuState>(() => loadState(safeStorage(), viewport()))
  const [hovered, setHovered] = useState(false)
  // Start visible so keyboard users and a pointer already over the fish can
  // see the speed as soon as the first tapping run produces a value.
  const [fishHovered, setFishHovered] = useState(true)
  const [speed, setSpeed] = useState<StrikeSpeed>({ currentMs: 0, bestMs: 0, active: false })
  const hoverTimer = useRef<number | null>(null)
  const speedIdleTimer = useRef<number | null>(null)
  // Keep the run's fastest interval outside React scheduling so the idle
  // callback can restore it even when several strikes arrive in one frame.
  const bestStrikeMs = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [striking, setStriking] = useState(false)
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dragRef = useRef<DragSession | null>(null)
  const listenersRef = useRef<{
    move: (event: PointerEvent) => void
    up: (event: PointerEvent) => void
    cancel: (event: PointerEvent) => void
  } | null>(null)
  const timersRef = useRef<Set<number>>(new Set())
  const floaterId = useRef(0)
  const bubbleId = useRef(0)
  const prevRainbow = useRef(state.rainbow)
  // Sync shadow of the count, used to detect the 88,888 crossing without
  // relying on the async state snapshot (and to know the crossing gain).
  const countRef = useRef(state.count)
  const lastStrikeAt = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  // Keep the full color/reset panel reachable near every viewport edge.
  useLayoutEffect(() => {
    if (!settingsOpen) return
    const placePopover = (): void => {
      const popover = popoverRef.current
      if (popover === null) return
      popover.style.top = ''
      popover.style.bottom = ''
      popover.style.transform = ''
      if (popover.getBoundingClientRect().bottom > window.innerHeight - 8) {
        popover.style.top = 'auto'
        popover.style.bottom = 'calc(100% + 6px)'
      }
      const rect = popover.getBoundingClientRect()
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8))
      const top = Math.min(Math.max(8, rect.top), Math.max(8, window.innerHeight - rect.height - 8))
      popover.style.transform = `translate(${left - rect.left}px, ${top - rect.top}px)`
    }
    placePopover()
    window.addEventListener('resize', placePopover)
    return () => { window.removeEventListener('resize', placePopover) }
  }, [settingsOpen, state.x, state.y, t])

  // Persist every change (position, count, color, rainbow) to localStorage.
  useEffect(() => {
    saveState(safeStorage(), state)
  }, [state])

  // Detach window listeners if the widget unmounts mid-drag (HMR safety).
  useEffect(() => () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current)
    if (speedIdleTimer.current !== null) window.clearTimeout(speedIdleTimer.current)
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current.clear()
    const listeners = listenersRef.current
    if (listeners === null) return
    window.removeEventListener('pointermove', listeners.move)
    window.removeEventListener('pointerup', listeners.up)
    window.removeEventListener('pointercancel', listeners.cancel)
  }, [])

  // Re-clamp the anchor when the window shrinks, so the fish never strands
  // outside the viewport after a resize.
  useEffect(() => {
    const onResize = (): void => {
      setState((prev) => {
        const clamped = clampPosition(prev.x, prev.y, viewport())
        return clamped.x === prev.x && clamped.y === prev.y ? prev : { ...prev, ...clamped }
      })
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize) }
  }, [])

  // Close the settings popover on any press outside the panel.
  useEffect(() => {
    if (!settingsOpen) return
    const onPress = (event: PointerEvent): void => {
      // The panel is always mounted while the popover is open, so a null ref
      // is unreachable — the check exists only for the type system.
      /* v8 ignore next 2 -- panelRef is bound whenever the popover is open */
      if (panelRef.current === null) return
      // document sees the shadow host as event.target. Inspect the composed
      // path so pressing a color/reset button doesn't close it before click.
      if (event.composedPath().includes(panelRef.current)) return
      setSettingsOpen(false)
    }
    document.addEventListener('pointerdown', onPress)
    return () => { document.removeEventListener('pointerdown', onPress) }
  }, [settingsOpen])

  /** Reveal the hover chrome immediately and cancel any pending hide. */
  const enterHover = (): void => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
    setHovered(true)
  }

  /** Hide the hover chrome after a grace period, so a pointer moving toward the
      settings button (beyond the root's edge) can still reach it. */
  const leaveHover = (): void => {
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null
      setHovered(false)
    }, HOVER_LEAVE_MS)
  }

  /** Add a floating label that removes itself after its lifetime. */
  const scheduleTimeout = (callback: () => void, delay: number): number => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      callback()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  const pushFloater = (label: string, rainbow: boolean, ms: number = FLOATER_MS): void => {
    const id = ++floaterId.current
    setFloaters(current => [...current, { id, label, rainbow }])
    scheduleTimeout(() => {
      setFloaters(current => current.filter(floater => floater.id !== id))
    }, ms)
  }

  /** Add a complaint bubble that removes itself after its lifetime. */
  const pushBubble = (text: string): void => {
    const id = ++bubbleId.current
    setBubbles(current => [...current, { id, text }])
    scheduleTimeout(() => {
      setBubbles(current => current.filter(bubble => bubble.id !== id))
    }, BUBBLE_MS)
  }

  const enterFish = (): void => { setFishHovered(true) }
  const leaveFish = (): void => { setFishHovered(false) }

  /**
   * One strike: gain merit (1, or a crit of 2..9 at the stated odds), swing
   * the mallet, float the gain in gold, roll the rainbow, and complain when
   * strikes arrive faster than the fish can absorb.
   */
  const strike = (): void => {
    const now = Date.now()
    const previousStrikeAt = lastStrikeAt.current
    const fast = previousStrikeAt !== null && now - previousStrikeAt < FAST_STRIKE_MS
    lastStrikeAt.current = now
    const intervalMs = previousStrikeAt === null ? 0 : Math.max(1, now - previousStrikeAt)
    if (previousStrikeAt === null) bestStrikeMs.current = 0
    if (intervalMs > 0 && (bestStrikeMs.current === 0 || intervalMs < bestStrikeMs.current)) {
      bestStrikeMs.current = intervalMs
    }
    if (speedIdleTimer.current !== null) window.clearTimeout(speedIdleTimer.current)
    setSpeed(prev => ({
      currentMs: intervalMs,
      bestMs: bestStrikeMs.current,
      active: true,
    }))
    speedIdleTimer.current = window.setTimeout(() => {
      speedIdleTimer.current = null
      lastStrikeAt.current = null
      setSpeed(prev => ({ ...prev, currentMs: 0, bestMs: bestStrikeMs.current, active: false }))
    }, SPEED_IDLE_MS)
    const gain = rollGain(Math.random)
    const shift = rollColorShift(Math.random)
    const shiftColor = shift ? randomColor(Math.random) : null
    const before = countRef.current
    countRef.current = before + gain
    if (crossesFortune(before, countRef.current)) pushFloater(t('fortune', { gain }), false, FORTUNE_MS)
    setState((prev) => {
      const nextCount = prev.count + gain
      return {
        ...prev,
        count: nextCount,
        color: shiftColor ?? prev.color,
        rainbow: prev.rainbow || rollRainbow(nextCount, Math.random),
      }
    })
    setStriking(true)
    pushFloater(gain > 1 ? t('strike.crit', { gain }) : t('strike.plus'), false)
    if (shift) pushFloater(t('color.shift'), false)
    if (fast) {
      // The pool and its size come from the same derived list, so the index
      // is always in range — no silent fallback.
      pushBubble(t(BUBBLE_KEYS[pickFastStrikeMessage(Math.random, BUBBLE_KEYS.length)]))
    }
    scheduleTimeout(() => { setStriking(false) }, SWING_MS)
  }

  // Celebrate the false→true rainbow transition exactly once per activation.
  useEffect(() => {
    const became = state.rainbow && !prevRainbow.current
    prevRainbow.current = state.rainbow
    if (!became) return
    pushFloater(t('rainbow.burst'), true)
  }, [state.rainbow])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0 || dragRef.current !== null) return
    // Pointer events are the reliable boundary signal in the Shadow Root.
    // Restore the retained interval before processing a click that brought
    // the pointer back to the fish.
    setFishHovered(true)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: state.x,
      originY: state.y,
      moved: false,
    }
    const move = (moveEvent: PointerEvent): void => {
      const session = dragRef.current
      // The listeners are installed only while a session exists and removed
      // before it clears, so a null session is unreachable — defensive only.
      /* v8 ignore next 2 -- unreachable: listener lifetime mirrors the session */
      if (session === null) return
      if (moveEvent.pointerId !== session.pointerId) return
      const dx = moveEvent.clientX - session.startX
      const dy = moveEvent.clientY - session.startY
      if (!session.moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD_PX) return
      session.moved = true
      setDragging(true)
      const clamped = clampPosition(session.originX + dx, session.originY + dy, viewport())
      setState(prev => ({ ...prev, x: clamped.x, y: clamped.y }))
    }
    const finish = (cancelled: boolean, pointerId: number): void => {
      const session = dragRef.current
      if (session === null || session.pointerId !== pointerId) return
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      listenersRef.current = null
      dragRef.current = null
      if (!cancelled && session !== null && !session.moved) strike()
      setDragging(false)
    }
    const up = (upEvent: PointerEvent): void => { finish(false, upEvent.pointerId) }
    const cancel = (cancelEvent: PointerEvent): void => { finish(true, cancelEvent.pointerId) }
    listenersRef.current = { move, up, cancel }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    strike()
  }

  const setColor = (color: string): void => {
    setState(prev => ({ ...prev, color }))
  }

  const randomizeColor = (): void => {
    setState(prev => ({ ...prev, color: randomColor(Math.random) }))
  }

  const reset = (): void => {
    countRef.current = 0
    setState(prev => ({ ...prev, count: 0, rainbow: false }))
  }

  // Shape, border width and shading are local CSS; only the selected body
  // color is dynamic. No host rule can override these shadow-tree elements.
  const fishStyle: CSSProperties | undefined = state.rainbow ? undefined : {
    background: `linear-gradient(145deg, ${shade(state.color, 1.18)} 0%, ${state.color} 45%, ${shade(state.color, 0.72)} 100%)`,
    borderColor: shade(state.color, 0.6),
  }

  // Merit text turns gold once strikes have landed.
  const golden = state.count > 0
  const displayedSpeedMs = speed.active ? speed.currentMs : speed.bestMs

  return (
    <div
      className={clsx(css.root, dragging && css.dragging)}
      style={{ left: state.x, top: state.y }}
      onMouseEnter={enterHover}
      onMouseLeave={leaveHover}
    >
      <div className={clsx(css.fishRow, striking && css.struck)}>
        <div
          role="button"
          tabIndex={0}
          aria-label={t('fish.aria')}
          className={clsx(css.fish, state.rainbow && css.rainbow)}
          style={fishStyle}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          onPointerEnter={enterFish}
          onPointerLeave={leaveFish}
          onMouseEnter={enterFish}
          onMouseLeave={leaveFish}
        >
          <span className={css.eye} />
          <span className={css.slot} />
        </div>
        <MalletIcon color={state.color} rainbow={state.rainbow} />
        {fishHovered && displayedSpeedMs > 0
          ? <span className={css.speed} aria-live="polite">{displayedSpeedMs}ms</span>
          : null}
        <span className={css.floaters}>
          {floaters.map(floater => (
            <span key={floater.id} className={clsx(css.floater, floater.rainbow && css.floaterRainbow)}>
              {floater.label}
            </span>
          ))}
        </span>
        <span className={css.bubbles} aria-live="polite">
          {bubbles.map(bubble => (
            <span key={bubble.id} className={css.bubble}>{bubble.text}</span>
          ))}
        </span>
      </div>
      <div ref={panelRef} className={css.panel}>
        <span
          className={css.count}
          style={golden ? { color: 'var(--muyu-gold)', textShadow: '0 0 6px var(--muyu-gold-glow)' } : undefined}
        >
          {t('count', { count: state.count })}
        </span>
        <button
          type="button"
          aria-label={t('settings.title')}
          aria-expanded={settingsOpen}
          title={t('settings.title')}
          className={clsx(css.settings, (hovered || settingsOpen) && css.settingsVisible)}
          onClick={() => { setSettingsOpen(open => !open) }}
        >
          ···
        </button>
        {settingsOpen
          ? (
            <div ref={popoverRef} className={css.popover}>
              <div className={css.tools}>
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={t('color.custom')}
                    aria-pressed={state.color === color}
                    className={css.swatch}
                    style={{ background: color }}
                    onClick={() => { setColor(color) }}
                  />
                ))}
                <input
                  type="color"
                  aria-label={t('color.custom')}
                  className={css.colorInput}
                  value={state.color}
                  onChange={(event) => { setColor(event.target.value) }}
                />
                <button type="button" className={css.action} onClick={randomizeColor}>{t('color.random')}</button>
              </div>
              <button type="button" className={css.actionReset} onClick={reset}>{t('reset')}</button>
            </div>
          )
          : null}
      </div>
    </div>
  )
}
