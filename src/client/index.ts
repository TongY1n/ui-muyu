/**
 * Cyber wooden fish (muyu) plugin, browser half: registers the `muyu`
 * dictionaries and contributes the widget as one entry of the frame-owned
 * `shell.overlay` list slot (the additive seat for frame-wide floating
 * surfaces). The contribution waits on ui-layout's declaration through
 * `slots.inject`, so apply order never matters and a layout redeclaration
 * re-installs it.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls ui-layout's SlotMap merge (the 'shell.overlay' key).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { Muyu } from './Muyu.tsx'
import { en, NS, zh, type MuyuKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The wooden-fish widget's copy. */
    'muyu': MuyuKey
  }
}

export type { MuyuProps } from './Muyu.tsx'

/** Required services: the slot registry and the widget's copy. */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the dictionaries and the overlay entry.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-muyu: dictionaries')
  ctx.slots.inject(
    'shell.overlay',
    () => ctx.slots.register({
      name: 'shell.overlay',
      id: 'dsh-muyu',
      locale: NS,
    }, Muyu),
  )
}
