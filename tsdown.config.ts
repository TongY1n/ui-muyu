/**
 * Standalone build config for the ui-muyu plugin.
 *
 * Uses the shared client-bundle preset (shared/tsdown.client.ts): the node
 * half lib/ (inert apply) plus the browser bundle lib/client.js (closure-
 * factory artifact for the GUI's __ModuleLoader__). The client entry is
 * auto-detected at src/client/index.ts by the preset.
 */
import { clientBundle } from './shared/tsdown.client.ts'

export default clientBundle('@deepseek-ai/dsh-client-ui-muyu', ['src/index.ts', 'src/invariant.ts'])
