import { type ReactNode } from 'react';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Full props for the frame-overlay wooden fish entry. */
export type MuyuProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS>;
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
export declare function Muyu({ t }: MuyuProps): ReactNode;
