/**
 * Pure wooden-fish state logic: persistence shape, rainbow roll, crit and
 * fast-strike rules, position clamping, color helpers, and storage guards.
 * Kept framework-free so the widget's rules are unit-testable without render
 * machinery.
 */

/** Viewport dimensions used to clamp the floating widget. */
export interface Viewport {
  width: number
  height: number
}

/** Durable widget state (persisted to localStorage). */
export interface MuyuState {
  /** Widget anchor position in viewport px (top-left of the widget box). */
  x: number
  y: number
  /** Merit gained since the last reset. */
  count: number
  /** Fish base color (hex); the rainbow glow is an overlay, never a stored color. */
  color: string
  /** Rainbow-glow easter egg active. */
  rainbow: boolean
}

/** Default lacquered-wood body color. */
export const DEFAULT_COLOR = '#a35c2f'

/** Per-strike probability of rolling the rainbow easter egg. */
export const RAINBOW_ODDS = 1 / 100_000

/** Cumulative strikes after which the rainbow easter egg is guaranteed. */
export const RAINBOW_GUARANTEE_COUNT = 100_000

/** Per-strike crit odds: a crit adds 1..9 merit instead of 1. */
export const CRIT_ODDS = 0.05

/** Minimum strike interval in ms; below this the widget complains. */
export const FAST_STRIKE_MS = 100

/** Fast-strike bubble lifetime in ms. */
export const BUBBLE_MS = 5_000

/** Per-strike probability of a surprise color shift. */
export const COLOR_SHIFT_ODDS = 1 / 3_000

/** Cumulative merit that triggers the "fortune" easter egg. */
export const FORTUNE_COUNT = 88_888

/** Fortune easter-egg label lifetime in ms. */
export const FORTUNE_MS = 88_000

/** localStorage key holding the persisted widget state. */
export const STORAGE_KEY = 'dsh-muyu.state.v1'

/** Widget box width, used to clamp the anchor inside the viewport. */
export const WIDGET_WIDTH = 148
/** Widget box height (fish + counter panel), used to clamp the anchor. */
export const WIDGET_HEIGHT = 96

/** Pleasant hex palette the random button draws from (hex keeps the native color input valid). */
const RANDOM_PALETTE = [
  '#c0392b', '#e67e22', '#d4ac0d', '#27ae60', '#16a085',
  '#2980b9', '#8e44ad', '#d35400', '#7f8c8d', '#2c3e50',
] as const

/** Number of fast-strike complaint messages (indexed in the `muyu` dictionary). */
export const FAST_STRIKE_MESSAGE_COUNT = 5

/** Fresh-state placement: bottom-right corner, clear of the app chrome. */
export function defaultState(viewport: Viewport): MuyuState {
  return {
    x: Math.max(0, viewport.width - WIDGET_WIDTH - 24),
    y: Math.max(0, viewport.height - WIDGET_HEIGHT - 24),
    count: 0,
    color: DEFAULT_COLOR,
    rainbow: false,
  }
}

/**
 * Easter-egg roll for one strike landing on `count` cumulative strikes:
 * guaranteed once the total since the last reset passes the guarantee line,
 * otherwise the stated per-strike odds.
 * @param count - the new cumulative count after this strike.
 * @param rand - uniform [0, 1) source (injectable for tests).
 * @returns whether the fish enters rainbow mode on this strike.
 */
export function rollRainbow(count: number, rand: () => number): boolean {
  return count >= RAINBOW_GUARANTEE_COUNT || rand() < RAINBOW_ODDS
}

/**
 * Whether one strike triggers a surprise color shift, at the stated odds.
 * @param rand - uniform [0, 1) source (injectable for tests).
 * @returns whether the fish shifts to a random color on this strike.
 */
export function rollColorShift(rand: () => number): boolean {
  return rand() < COLOR_SHIFT_ODDS
}

/**
 * Whether a strike's count crossed the fortune threshold (88,888): strictly
 * below before and at or past it after, so a crit that overshoots the exact
 * number still fires the fortune easter egg exactly once.
 * @param previous - the count before the strike.
 * @param next - the count after the strike.
 * @returns whether this strike crossed the fortune line.
 */
export function crossesFortune(previous: number, next: number): boolean {
  return previous < FORTUNE_COUNT && next >= FORTUNE_COUNT
}

/**
 * Merit gained by one strike: 1 normally, or a crit of 2..9 at the stated
 * odds. A crit always beats a plain strike, so it is always labelled as one.
 * @param rand - uniform [0, 1) source (injectable for tests).
 * @returns the merit gained by this strike.
 */
export function rollGain(rand: () => number): number {
  if (rand() >= CRIT_ODDS) return 1
  return 2 + Math.floor(rand() * 8)
}

/** Pick the item at a uniformly random index, clamped into [0, length). */
function pickOne<T>(items: readonly T[], rand: () => number): T {
  const index = Math.min(items.length - 1, Math.floor(rand() * items.length))
  // The clamp above keeps index inside the tuple; the assertion satisfies the
  // noUncheckedIndexedAccess view of the const tuple.
  return items[index] as T
}

/** Pick a fast-strike message index uniformly; the min() guard keeps a mocked rand() === 1 in range. */
export function pickFastStrikeMessage(rand: () => number): number {
  return Math.min(FAST_STRIKE_MESSAGE_COUNT - 1, Math.floor(rand() * FAST_STRIKE_MESSAGE_COUNT))
}

/** Clamp an anchor into the viewport, tolerating viewports smaller than the widget. */
export function clampPosition(x: number, y: number, viewport: Viewport): { x: number; y: number } {
  return {
    x: Math.min(Math.max(0, x), Math.max(0, viewport.width - WIDGET_WIDTH)),
    y: Math.min(Math.max(0, y), Math.max(0, viewport.height - WIDGET_HEIGHT)),
  }
}

/** Pick a palette color uniformly; the min() guard keeps a mocked rand() === 1 in range. */
export function randomColor(rand: () => number): string {
  return pickOne(RANDOM_PALETTE, rand)
}

/**
 * Scale a 6-digit hex color's channels by `factor` (< 1 darkens, > 1
 * lightens). Malformed input falls back to the default wood color so a
 * corrupt persisted value can never produce an invalid CSS gradient.
 * @param hex - `#rrggbb` color.
 * @param factor - channel multiplier.
 * @returns the scaled color as `#rrggbb`.
 */
export function shade(hex: string, factor: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return DEFAULT_COLOR
  const value = Number.parseInt(hex.slice(1), 16)
  const channel = (shift: number): string => {
    const scaled = Math.min(255, Math.round(((value >> shift) & 0xff) * factor))
    return scaled.toString(16).padStart(2, '0')
  }
  return `#${channel(16)}${channel(8)}${channel(0)}`
}

/**
 * Read the persisted widget state, merging it over a fresh default and
 * re-clamping the anchor against the current viewport. Every failure path —
 * absent storage, absent/unparseable record, malformed fields — degrades to
 * the default state.
 * @param storage - a storage facade (or none, e.g. privacy mode).
 * @param viewport - the current viewport.
 * @returns the merged, valid state.
 */
export function loadState(
  storage: Pick<Storage, 'getItem'> | undefined,
  viewport: Viewport,
): MuyuState {
  const fallback = defaultState(viewport)
  if (storage === undefined) return fallback
  let raw: string | null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return fallback
  }
  if (raw === null) return fallback
  let parsed: Partial<MuyuState>
  try {
    parsed = JSON.parse(raw) as Partial<MuyuState>
  } catch {
    return fallback
  }
  const { x, y } = clampPosition(
    typeof parsed.x === 'number' ? parsed.x : fallback.x,
    typeof parsed.y === 'number' ? parsed.y : fallback.y,
    viewport,
  )
  return {
    x,
    y,
    count: typeof parsed.count === 'number' && parsed.count >= 0 ? Math.floor(parsed.count) : 0,
    color: typeof parsed.color === 'string' && /^#[0-9a-f]{6}$/i.test(parsed.color) ? parsed.color : DEFAULT_COLOR,
    rainbow: parsed.rainbow === true,
  }
}

/**
 * Persist the widget state. Failures (quota, privacy mode) are swallowed:
 * the widget keeps working in-memory for the session.
 * @param storage - a storage facade (or none).
 * @param state - the state to persist.
 */
export function saveState(storage: Pick<Storage, 'setItem'> | undefined, state: MuyuState): void {
  if (storage === undefined) return
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota or privacy mode: nothing useful to do; the widget stays live.
  }
}

/**
 * Resolve a storage facade from a window-like object. Browsers expose
 * localStorage; an inaccessible or absent one yields undefined so callers
 * degrade to in-memory behavior.
 * @param win - the global object (defaults to the actual global).
 * @returns a storage facade, or undefined when unavailable.
 */
export function safeStorage(win: unknown = globalThis): Pick<Storage, 'getItem' | 'setItem'> | undefined {
  if (win === null || typeof win !== 'object') return undefined
  try {
    const storage = (win as Window).localStorage
    if (storage === undefined || storage === null) return undefined
    return storage
  } catch {
    return undefined
  }
}
