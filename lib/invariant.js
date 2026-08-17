//#region src/invariant.ts
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-muyu";
/** Cordis companion plugin name. */
const name = "client-ui-muyu-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the slot registration is an effect owned and observed
* by the slot registry itself.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns The installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
