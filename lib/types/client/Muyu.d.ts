import { type ReactNode } from 'react';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Full props for the frame-overlay wooden fish entry. */
export type MuyuProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS>;
/** Keep the complete widget and stylesheet behind one CSS boundary. A portal
 * preserves the DSH locale/context while React owns mounting and cleanup. */
export declare function Muyu(props: MuyuProps): ReactNode;
