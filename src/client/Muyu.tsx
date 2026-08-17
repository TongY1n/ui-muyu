import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import clsx from 'clsx'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls ui-layout's SlotMap merge (the 'shell.overlay' key) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import css from './Muyu.module.css'
import { NS } from './locales.ts'
import {
  BUBBLE_MS, clampPosition, crossesFortune, FAST_STRIKE_MS, FORTUNE_MS, loadState,
  pickFastStrikeMessage, randomColor, rollColorShift, rollGain, rollRainbow, safeStorage,
  saveState, shade,
  type MuyuState, type Viewport,
} from './logic.ts'

/** Full props for the frame-overlay wooden fish entry. */
export type MuyuProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS>

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

/** An in-flight drag session (null when idle). */
interface DragSession {
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

/** Quick-pick body colors shown in the settings popover. */
const PRESET_COLORS = ['#a35c2f', '#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#e67e22'] as const

/** Fast-strike complaint dictionary keys, indexed by pickFastStrikeMessage. */
const BUBBLE_KEYS = ['bubble.0', 'bubble.1', 'bubble.2', 'bubble.3', 'bubble.4'] as const

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
export function Muyu({ t }: MuyuProps): ReactNode {
  const [state, setState] = useState<MuyuState>(() => loadState(safeStorage(), viewport()))
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [striking, setStriking] = useState(false)
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dragRef = useRef<DragSession | null>(null)
  const listenersRef = useRef<{ move: (event: PointerEvent) => void; up: () => void } | null>(null)
  const floaterId = useRef(0)
  const bubbleId = useRef(0)
  const prevRainbow = useRef(state.rainbow)
  // Sync shadow of the count, used to detect the 88,888 crossing without
  // relying on the async state snapshot (and to know the crossing gain).
  const countRef = useRef(state.count)
  const lastStrikeAt = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // Persist every change (position, count, color, rainbow) to localStorage.
  useEffect(() => {
    saveState(safeStorage(), state)
  }, [state])

  // Detach window listeners if the widget unmounts mid-drag (HMR safety).
  useEffect(() => () => {
    const listeners = listenersRef.current
    if (listeners === null) return
    window.removeEventListener('pointermove', listeners.move)
    window.removeEventListener('pointerup', listeners.up)
    window.removeEventListener('pointercancel', listeners.up)
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
      if (event.target instanceof Node && panelRef.current.contains(event.target)) return
      setSettingsOpen(false)
    }
    document.addEventListener('pointerdown', onPress)
    return () => { document.removeEventListener('pointerdown', onPress) }
  }, [settingsOpen])

  /** Add a floating label that removes itself after its lifetime. */
  const pushFloater = (label: string, rainbow: boolean, ms: number = FLOATER_MS): void => {
    const id = ++floaterId.current
    setFloaters(current => [...current, { id, label, rainbow }])
    window.setTimeout(() => {
      setFloaters(current => current.filter(floater => floater.id !== id))
    }, ms)
  }

  /** Add a complaint bubble that removes itself after its lifetime. */
  const pushBubble = (text: string): void => {
    const id = ++bubbleId.current
    setBubbles(current => [...current, { id, text }])
    window.setTimeout(() => {
      setBubbles(current => current.filter(bubble => bubble.id !== id))
    }, BUBBLE_MS)
  }

  /**
   * One strike: gain merit (1, or a crit of 1..9 at the stated odds), swing
   * the mallet, float the gain in gold, roll the rainbow, and complain when
   * strikes arrive faster than the fish can absorb.
   */
  const strike = (): void => {
    const now = Date.now()
    const fast = lastStrikeAt.current !== null && now - lastStrikeAt.current < FAST_STRIKE_MS
    lastStrikeAt.current = now
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
      // The index is clamped to [0, FAST_STRIKE_MESSAGE_COUNT); the fallback
      // is unreachable and exists only for the noUncheckedIndexedAccess view.
      /* v8 ignore next 1 -- pickFastStrikeMessage clamps the index */
      pushBubble(t(BUBBLE_KEYS[pickFastStrikeMessage(Math.random)] ?? 'bubble.0'))
    }
    window.setTimeout(() => { setStriking(false) }, SWING_MS)
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
    dragRef.current = {
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
      const dx = moveEvent.clientX - session.startX
      const dy = moveEvent.clientY - session.startY
      if (!session.moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD_PX) return
      session.moved = true
      setDragging(true)
      const clamped = clampPosition(session.originX + dx, session.originY + dy, viewport())
      setState(prev => ({ ...prev, x: clamped.x, y: clamped.y }))
    }
    const up = (): void => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      listenersRef.current = null
      const session = dragRef.current
      dragRef.current = null
      if (session !== null && !session.moved) strike()
      setDragging(false)
    }
    listenersRef.current = { move, up }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
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

  // The body gradient adapts to the user color; rainbow mode replaces the
  // background entirely with the animated conic gradient, so no inline style.
  const fishStyle: CSSProperties | undefined = state.rainbow
    ? undefined
    : {
      background: `linear-gradient(145deg, ${shade(state.color, 1.18)} 0%, ${state.color} 45%, ${shade(state.color, 0.72)} 100%)`,
      borderColor: shade(state.color, 0.6),
    }

  // Merit text turns gold once strikes have landed.
  const golden = state.count > 0

  return (
    <div
      className={clsx(css.root, hovered && css.hovered, dragging && css.dragging)}
      style={{ left: state.x, top: state.y }}
      onMouseEnter={() => { setHovered(true) }}
      onMouseLeave={() => { setHovered(false) }}
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
        >
          <span className={css.eye} />
          <span className={css.slot} />
        </div>
        {hovered ? <MalletIcon color={state.color} rainbow={state.rainbow} /> : null}
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
            <div className={css.popover}>
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
