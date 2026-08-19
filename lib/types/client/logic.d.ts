/**
 * Pure wooden-fish state logic: persistence shape, rainbow roll, crit and
 * fast-strike rules, position clamping, color helpers, and storage guards.
 * Kept framework-free so the widget's rules are unit-testable without render
 * machinery.
 */
/** Viewport dimensions used to clamp the floating widget. */
export interface Viewport {
    width: number;
    height: number;
}
/** Durable widget state (persisted to localStorage). */
export interface MuyuState {
    /** Widget anchor position in viewport px (top-left of the widget box). */
    x: number;
    y: number;
    /** Merit gained since the last reset. */
    count: number;
    /** Fish base color (hex); the rainbow glow is an overlay, never a stored color. */
    color: string;
    /** Rainbow-glow easter egg active. */
    rainbow: boolean;
}
/** Default lacquered-wood body color. */
export declare const DEFAULT_COLOR = "#a35c2f";
/** Per-strike probability of rolling the rainbow easter egg. */
export declare const RAINBOW_ODDS: number;
/** Cumulative strikes after which the rainbow easter egg is guaranteed. */
export declare const RAINBOW_GUARANTEE_COUNT = 100000;
/** Per-strike crit odds: a crit adds 1..9 merit instead of 1. */
export declare const CRIT_ODDS = 0.05;
/** Minimum strike interval in ms; below this the widget complains. */
export declare const FAST_STRIKE_MS = 100;
/** Fast-strike bubble lifetime in ms. */
export declare const BUBBLE_MS = 5000;
/** Per-strike probability of a surprise color shift. */
export declare const COLOR_SHIFT_ODDS: number;
/** Cumulative merit that triggers the "fortune" easter egg. */
export declare const FORTUNE_COUNT = 88888;
/** Fortune easter-egg label lifetime in ms. */
export declare const FORTUNE_MS = 88000;
/** localStorage key holding the persisted widget state. */
export declare const STORAGE_KEY = "dsh-muyu.state.v1";
/** Widget box width, used to clamp the anchor inside the viewport. */
export declare const WIDGET_WIDTH = 148;
/** Widget box height (fish + counter panel), used to clamp the anchor. */
export declare const WIDGET_HEIGHT = 96;
/** Number of fast-strike complaint messages (indexed in the `muyu` dictionary). */
export declare const FAST_STRIKE_MESSAGE_COUNT = 12;
/** Fresh-state placement: bottom-right corner, clear of the app chrome. */
export declare function defaultState(viewport: Viewport): MuyuState;
/**
 * Easter-egg roll for one strike landing on `count` cumulative strikes:
 * guaranteed once the total since the last reset passes the guarantee line,
 * otherwise the stated per-strike odds.
 * @param count - the new cumulative count after this strike.
 * @param rand - uniform [0, 1) source (injectable for tests).
 * @returns whether the fish enters rainbow mode on this strike.
 */
export declare function rollRainbow(count: number, rand: () => number): boolean;
/**
 * Whether one strike triggers a surprise color shift, at the stated odds.
 * @param rand - uniform [0, 1) source (injectable for tests).
 * @returns whether the fish shifts to a random color on this strike.
 */
export declare function rollColorShift(rand: () => number): boolean;
/**
 * Whether a strike's count crossed the fortune threshold (88,888): strictly
 * below before and at or past it after, so a crit that overshoots the exact
 * number still fires the fortune easter egg exactly once.
 * @param previous - the count before the strike.
 * @param next - the count after the strike.
 * @returns whether this strike crossed the fortune line.
 */
export declare function crossesFortune(previous: number, next: number): boolean;
/**
 * Merit gained by one strike: 1 normally, or a crit of 2..9 at the stated
 * odds. A crit always beats a plain strike, so it is always labelled as one.
 * @param rand - uniform [0, 1) source (injectable for tests).
 * @returns the merit gained by this strike.
 */
export declare function rollGain(rand: () => number): number;
/** Pick a fast-strike message index uniformly; the min() guard keeps a mocked rand() === 1 in range. */
export declare function pickFastStrikeMessage(rand: () => number): number;
/** Clamp an anchor into the viewport, tolerating viewports smaller than the widget. */
export declare function clampPosition(x: number, y: number, viewport: Viewport): {
    x: number;
    y: number;
};
/** Pick a palette color uniformly; the min() guard keeps a mocked rand() === 1 in range. */
export declare function randomColor(rand: () => number): string;
/**
 * Scale a 6-digit hex color's channels by `factor` (< 1 darkens, > 1
 * lightens). Malformed input falls back to the default wood color so a
 * corrupt persisted value can never produce an invalid CSS gradient.
 * @param hex - `#rrggbb` color.
 * @param factor - channel multiplier.
 * @returns the scaled color as `#rrggbb`.
 */
export declare function shade(hex: string, factor: number): string;
/**
 * Read the persisted widget state, merging it over a fresh default and
 * re-clamping the anchor against the current viewport. Every failure path —
 * absent storage, absent/unparseable record, malformed fields — degrades to
 * the default state.
 * @param storage - a storage facade (or none, e.g. privacy mode).
 * @param viewport - the current viewport.
 * @returns the merged, valid state.
 */
export declare function loadState(storage: Pick<Storage, 'getItem'> | undefined, viewport: Viewport): MuyuState;
/**
 * Persist the widget state. Failures (quota, privacy mode) are swallowed:
 * the widget keeps working in-memory for the session.
 * @param storage - a storage facade (or none).
 * @param state - the state to persist.
 */
export declare function saveState(storage: Pick<Storage, 'setItem'> | undefined, state: MuyuState): void;
/**
 * Resolve a storage facade from a window-like object. Browsers expose
 * localStorage; an inaccessible or absent one yields undefined so callers
 * degrade to in-memory behavior.
 * @param win - the global object (defaults to the actual global).
 * @returns a storage facade, or undefined when unavailable.
 */
export declare function safeStorage(win?: unknown): Pick<Storage, 'getItem' | 'setItem'> | undefined;
