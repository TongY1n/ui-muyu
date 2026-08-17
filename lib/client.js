window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-muyu",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:/Users/xst/Dsh/ui-muyu/src/client/Muyu.module.css.mjs
		const css = ".zL9bQa_root{--muyu-gold:gold;--muyu-gold-glow:#ffd70059;--muyu-rainbow-conic:conic-gradient(red, #ff8000, #ff0, #0f0, #0af, #80f, #f0f, red);--muyu-rainbow-linear:linear-gradient(90deg, red, #ff8000, #ff0, #0f0, #0af, #80f, #f0f);--muyu-face:#1e1208d9;--muyu-slot:#1e120880;--muyu-slot-highlight:#ffffff47;--muyu-fish-inset:#00000029;--muyu-glow-from:0 0 8px 2px #ff00508c, 0 0 20px 6px #8000ff59;--muyu-glow-to:0 0 14px 4px #00ffc899, 0 0 30px 10px #ff800073;z-index:20;-webkit-user-select:none;user-select:none;touch-action:none;pointer-events:none;flex-direction:column;align-items:center;gap:6px;width:148px;display:flex;position:fixed}.zL9bQa_dragging{cursor:grabbing}.zL9bQa_fishRow{pointer-events:auto;position:relative}.zL9bQa_fish{width:64px;height:64px;box-shadow:var(--dsw-shadow-lv2), inset 0 0 14px var(--muyu-fish-inset);cursor:default;border:3px solid;border-radius:46% 54% 54% 46%/52% 50% 50% 48%;outline:none;position:relative}.zL9bQa_fish:focus-visible{box-shadow:var(--dsw-shadow-lv3), 0 0 0 2px var(--dsw-alias-border-l3)}.zL9bQa_struck .zL9bQa_fish{animation:.24s zL9bQa_fishShake}@keyframes zL9bQa_fishShake{0%{transform:translateY(0)rotate(0)}35%{transform:translateY(2px)rotate(-5deg)}to{transform:translateY(0)rotate(0)}}.zL9bQa_eye{background:var(--muyu-face);border-radius:50%;width:8px;height:8px;position:absolute;top:17px;right:15px}.zL9bQa_slot{background:var(--muyu-slot);height:5px;box-shadow:0 1px 0 var(--muyu-slot-highlight);border-radius:3px;position:absolute;top:30px;left:11px;right:11px}.zL9bQa_rainbow{background:var(--muyu-rainbow-conic);border-color:#0000;animation:2.4s linear infinite zL9bQa_rainbowHue,1.1s ease-in-out infinite alternate zL9bQa_rainbowGlow}@keyframes zL9bQa_rainbowHue{0%{filter:hue-rotate()}to{filter:hue-rotate(360deg)}}@keyframes zL9bQa_rainbowGlow{0%{box-shadow:var(--muyu-glow-from)}to{box-shadow:var(--muyu-glow-to)}}.zL9bQa_mallet{transform-origin:65% 95%;opacity:0;pointer-events:none;transition:opacity .14s;position:absolute;top:-34px;left:50%;transform:translate(-50%)rotate(30deg)}.zL9bQa_hovered .zL9bQa_mallet{opacity:1}.zL9bQa_struck .zL9bQa_mallet{animation:.24s zL9bQa_malletSwing}.zL9bQa_malletRainbow{animation:2.4s linear infinite zL9bQa_rainbowHue}.zL9bQa_struck .zL9bQa_malletRainbow{animation:.24s zL9bQa_malletSwing,2.4s linear infinite zL9bQa_rainbowHue}@keyframes zL9bQa_malletSwing{0%{transform:translate(-50%)rotate(30deg)}40%{transform:translate(-50%)rotate(-35deg)}to{transform:translate(-50%)rotate(30deg)}}.zL9bQa_floaters{pointer-events:none;z-index:3;position:absolute;top:-14px;left:50%}.zL9bQa_floater{color:var(--muyu-gold);white-space:nowrap;text-shadow:0 0 6px var(--muyu-gold-glow);font-size:15px;font-weight:600;line-height:1;animation:.7s forwards zL9bQa_floatUp;position:absolute;transform:translate(-50%)}.zL9bQa_floaterRainbow{background:var(--muyu-rainbow-linear);color:#0000;text-shadow:none;-webkit-background-clip:text;background-clip:text}@keyframes zL9bQa_floatUp{0%{opacity:0;transform:translate(-50%,8px)scale(.7)}18%{opacity:1;transform:translate(-50%)scale(1.15)}to{opacity:0;transform:translate(-50%,-36px)scale(1)}}.zL9bQa_bubbles{pointer-events:none;z-index:1;flex-direction:column;align-items:flex-end;gap:4px;display:flex;position:absolute;bottom:calc(100% + 8px);right:-10px}.zL9bQa_bubble{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:8px;padding:4px 8px;font-size:11px;line-height:15px;animation:.18s zL9bQa_bubblePop}@keyframes zL9bQa_bubblePop{0%{opacity:0;transform:translateY(4px)scale(.9)}to{opacity:1;transform:translateY(0)scale(1)}}.zL9bQa_panel{pointer-events:auto;justify-content:center;align-items:center;display:flex;position:relative}.zL9bQa_count{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv2);color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;border-radius:10px;padding:4px 10px;font-size:12px;line-height:16px}.zL9bQa_settings{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-menu);width:28px;height:28px;box-shadow:var(--dsw-shadow-lv2);color:var(--dsw-alias-label-tertiary);letter-spacing:1px;cursor:pointer;opacity:0;visibility:hidden;pointer-events:none;border-radius:10px;justify-content:center;align-items:center;padding:0;font-size:12px;line-height:1;transition:opacity .14s,visibility .14s;display:flex;position:absolute;top:50%;left:calc(100% + 6px);transform:translateY(-50%)}.zL9bQa_settingsVisible{opacity:1;visibility:visible;pointer-events:auto}.zL9bQa_settings:hover,.zL9bQa_settings[aria-expanded=true]{background:var(--dsw-alias-fill-l2);color:var(--dsw-alias-label-primary)}.zL9bQa_popover{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-menu);width:max-content;box-shadow:var(--dsw-shadow-lv3);z-index:1;border-radius:10px;flex-direction:column;align-items:center;gap:6px;padding:6px 8px;display:flex;position:absolute;top:calc(100% + 6px);right:-34px}.zL9bQa_tools{align-items:center;gap:4px;display:flex}.zL9bQa_swatch{border:1px solid var(--dsw-alias-border-l2);cursor:pointer;border-radius:50%;width:16px;height:16px;padding:0}.zL9bQa_swatch[aria-pressed=true]{outline:2px solid var(--dsw-alias-border-l3);outline-offset:1px}.zL9bQa_colorInput{cursor:pointer;background:0 0;border:0;width:22px;height:22px;padding:0}.zL9bQa_action{background:var(--dsw-alias-fill-l2);color:var(--dsw-alias-label-secondary);cursor:pointer;border:0;border-radius:6px;padding:2px 6px;font-size:11px;line-height:16px}.zL9bQa_action:hover{background:var(--dsw-alias-fill-l3);color:var(--dsw-alias-label-primary)}.zL9bQa_actionReset{width:100%;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:0;border-radius:6px;padding:3px 0;font-size:11px;line-height:16px}.zL9bQa_actionReset:hover{background:var(--dsw-alias-fill-l3);color:var(--dsw-alias-label-primary)}@media (prefers-reduced-motion:reduce){.zL9bQa_rainbow,.zL9bQa_malletRainbow,.zL9bQa_struck .zL9bQa_malletRainbow{animation:none}}";
		const tagId = "@deepseek-ai/dsh-client-ui-muyu/Muyu.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-muyu";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var Muyu_module_css_default = {
			"action": "zL9bQa_action",
			"actionReset": "zL9bQa_actionReset",
			"bubble": "zL9bQa_bubble",
			"bubblePop": "zL9bQa_bubblePop",
			"bubbles": "zL9bQa_bubbles",
			"colorInput": "zL9bQa_colorInput",
			"count": "zL9bQa_count",
			"dragging": "zL9bQa_dragging",
			"eye": "zL9bQa_eye",
			"fish": "zL9bQa_fish",
			"fishRow": "zL9bQa_fishRow",
			"fishShake": "zL9bQa_fishShake",
			"floatUp": "zL9bQa_floatUp",
			"floater": "zL9bQa_floater",
			"floaterRainbow": "zL9bQa_floaterRainbow",
			"floaters": "zL9bQa_floaters",
			"hovered": "zL9bQa_hovered",
			"mallet": "zL9bQa_mallet",
			"malletRainbow": "zL9bQa_malletRainbow",
			"malletSwing": "zL9bQa_malletSwing",
			"panel": "zL9bQa_panel",
			"popover": "zL9bQa_popover",
			"rainbow": "zL9bQa_rainbow",
			"rainbowGlow": "zL9bQa_rainbowGlow",
			"rainbowHue": "zL9bQa_rainbowHue",
			"root": "zL9bQa_root",
			"settings": "zL9bQa_settings",
			"settingsVisible": "zL9bQa_settingsVisible",
			"slot": "zL9bQa_slot",
			"struck": "zL9bQa_struck",
			"swatch": "zL9bQa_swatch",
			"tools": "zL9bQa_tools"
		};
		//#endregion
		//#region src/client/logic.ts
		/** Default lacquered-wood body color. */
		const DEFAULT_COLOR = "#a35c2f";
		/** Fast-strike bubble lifetime in ms. */
		const BUBBLE_MS = 5e3;
		/** Per-strike probability of a surprise color shift. */
		const COLOR_SHIFT_ODDS = 1 / 3e3;
		/** Fortune easter-egg label lifetime in ms. */
		const FORTUNE_MS = 88e3;
		/** localStorage key holding the persisted widget state. */
		const STORAGE_KEY = "dsh-muyu.state.v1";
		/** Pleasant hex palette the random button draws from (hex keeps the native color input valid). */
		const RANDOM_PALETTE = [
			"#c0392b",
			"#e67e22",
			"#d4ac0d",
			"#27ae60",
			"#16a085",
			"#2980b9",
			"#8e44ad",
			"#d35400",
			"#7f8c8d",
			"#2c3e50"
		];
		/** Fresh-state placement: bottom-right corner, clear of the app chrome. */
		function defaultState(viewport) {
			return {
				x: Math.max(0, viewport.width - 148 - 24),
				y: Math.max(0, viewport.height - 96 - 24),
				count: 0,
				color: DEFAULT_COLOR,
				rainbow: false
			};
		}
		/**
		* Easter-egg roll for one strike landing on `count` cumulative strikes:
		* guaranteed once the total since the last reset passes the guarantee line,
		* otherwise the stated per-strike odds.
		* @param count - the new cumulative count after this strike.
		* @param rand - uniform [0, 1) source (injectable for tests).
		* @returns whether the fish enters rainbow mode on this strike.
		*/
		function rollRainbow(count, rand) {
			return count >= 1e5 || rand() < 1e-5;
		}
		/**
		* Whether one strike triggers a surprise color shift, at the stated odds.
		* @param rand - uniform [0, 1) source (injectable for tests).
		* @returns whether the fish shifts to a random color on this strike.
		*/
		function rollColorShift(rand) {
			return rand() < COLOR_SHIFT_ODDS;
		}
		/**
		* Whether a strike's count crossed the fortune threshold (88,888): strictly
		* below before and at or past it after, so a crit that overshoots the exact
		* number still fires the fortune easter egg exactly once.
		* @param previous - the count before the strike.
		* @param next - the count after the strike.
		* @returns whether this strike crossed the fortune line.
		*/
		function crossesFortune(previous, next) {
			return previous < 88888 && next >= 88888;
		}
		/**
		* Merit gained by one strike: 1 normally, or a crit of 2..9 at the stated
		* odds. A crit always beats a plain strike, so it is always labelled as one.
		* @param rand - uniform [0, 1) source (injectable for tests).
		* @returns the merit gained by this strike.
		*/
		function rollGain(rand) {
			if (rand() >= .05) return 1;
			return 2 + Math.floor(rand() * 8);
		}
		/** Pick the item at a uniformly random index, clamped into [0, length). */
		function pickOne(items, rand) {
			return items[Math.min(items.length - 1, Math.floor(rand() * items.length))];
		}
		/** Pick a fast-strike message index uniformly; the min() guard keeps a mocked rand() === 1 in range. */
		function pickFastStrikeMessage(rand) {
			return Math.min(4, Math.floor(rand() * 5));
		}
		/** Clamp an anchor into the viewport, tolerating viewports smaller than the widget. */
		function clampPosition(x, y, viewport) {
			return {
				x: Math.min(Math.max(0, x), Math.max(0, viewport.width - 148)),
				y: Math.min(Math.max(0, y), Math.max(0, viewport.height - 96))
			};
		}
		/** Pick a palette color uniformly; the min() guard keeps a mocked rand() === 1 in range. */
		function randomColor(rand) {
			return pickOne(RANDOM_PALETTE, rand);
		}
		/**
		* Scale a 6-digit hex color's channels by `factor` (< 1 darkens, > 1
		* lightens). Malformed input falls back to the default wood color so a
		* corrupt persisted value can never produce an invalid CSS gradient.
		* @param hex - `#rrggbb` color.
		* @param factor - channel multiplier.
		* @returns the scaled color as `#rrggbb`.
		*/
		function shade(hex, factor) {
			if (!/^#[0-9a-f]{6}$/i.test(hex)) return DEFAULT_COLOR;
			const value = Number.parseInt(hex.slice(1), 16);
			const channel = (shift) => {
				return Math.min(255, Math.round((value >> shift & 255) * factor)).toString(16).padStart(2, "0");
			};
			return `#${channel(16)}${channel(8)}${channel(0)}`;
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
		function loadState(storage, viewport) {
			const fallback = defaultState(viewport);
			if (storage === void 0) return fallback;
			let raw;
			try {
				raw = storage.getItem(STORAGE_KEY);
			} catch {
				return fallback;
			}
			if (raw === null) return fallback;
			let parsed;
			try {
				parsed = JSON.parse(raw);
			} catch {
				return fallback;
			}
			const { x, y } = clampPosition(typeof parsed.x === "number" ? parsed.x : fallback.x, typeof parsed.y === "number" ? parsed.y : fallback.y, viewport);
			return {
				x,
				y,
				count: typeof parsed.count === "number" && parsed.count >= 0 ? Math.floor(parsed.count) : 0,
				color: typeof parsed.color === "string" && /^#[0-9a-f]{6}$/i.test(parsed.color) ? parsed.color : DEFAULT_COLOR,
				rainbow: parsed.rainbow === true
			};
		}
		/**
		* Persist the widget state. Failures (quota, privacy mode) are swallowed:
		* the widget keeps working in-memory for the session.
		* @param storage - a storage facade (or none).
		* @param state - the state to persist.
		*/
		function saveState(storage, state) {
			if (storage === void 0) return;
			try {
				storage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch {}
		}
		/**
		* Resolve a storage facade from a window-like object. Browsers expose
		* localStorage; an inaccessible or absent one yields undefined so callers
		* degrade to in-memory behavior.
		* @param win - the global object (defaults to the actual global).
		* @returns a storage facade, or undefined when unavailable.
		*/
		function safeStorage(win = globalThis) {
			if (win === null || typeof win !== "object") return void 0;
			try {
				const storage = win.localStorage;
				if (storage === void 0 || storage === null) return void 0;
				return storage;
			} catch {
				return;
			}
		}
		//#endregion
		//#region src/client/Muyu.tsx
		/** Pointer movement below this distance counts as a strike, not a drag. */
		const DRAG_THRESHOLD_PX = 4;
		/** Mallet swing / fish shake duration. */
		const SWING_MS = 240;
		/** Floating label lifetime. */
		const FLOATER_MS = 700;
		/** Quick-pick body colors shown in the settings popover. */
		const PRESET_COLORS = [
			"#a35c2f",
			"#c0392b",
			"#2980b9",
			"#27ae60",
			"#8e44ad",
			"#e67e22"
		];
		/** Fast-strike complaint dictionary keys, indexed by pickFastStrikeMessage. */
		const BUBBLE_KEYS = [
			"bubble.0",
			"bubble.1",
			"bubble.2",
			"bubble.3",
			"bubble.4"
		];
		/** The current viewport (the widget clamps itself inside it). */
		function viewport() {
			return {
				width: window.innerWidth,
				height: window.innerHeight
			};
		}
		/**
		* A wooden-fish mallet (hammer) icon hovering above the fish. Its wood tones
		* derive from the current fish color, so recoloring the fish recolors the
		* mallet together; while the rainbow easter egg is active the mallet wears the
		* same rainbow gradient as the fish.
		* @param props - the fish's current base color and rainbow flag.
		* @returns the mallet svg.
		*/
		function MalletIcon({ color, rainbow }) {
			const gradientId = (0, react.useId)();
			const paint = rainbow ? `url(#${gradientId})` : color;
			const stroke = rainbow ? `url(#${gradientId})` : shade(color, .55);
			const handle = rainbow ? `url(#${gradientId})` : shade(color, .72);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				className: clsx(Muyu_module_css_default.mallet, rainbow && Muyu_module_css_default.malletRainbow),
				viewBox: "0 0 24 24",
				width: "30",
				height: "30",
				"aria-hidden": "true",
				children: [rainbow ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
					id: gradientId,
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#f00"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
							offset: "20%",
							stopColor: "#ff0"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
							offset: "40%",
							stopColor: "#0f0"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
							offset: "60%",
							stopColor: "#0af"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
							offset: "80%",
							stopColor: "#80f"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#f0f"
						})
					]
				}) }) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					transform: "rotate(-45 12 12)",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "10.8",
						y: "3",
						width: "2.4",
						height: "15",
						rx: "1.2",
						fill: handle
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "4.5",
						r: "5",
						fill: paint,
						stroke,
						strokeWidth: "1"
					})]
				})]
			});
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
		function Muyu({ t }) {
			const [state, setState] = (0, react.useState)(() => loadState(safeStorage(), viewport()));
			const [hovered, setHovered] = (0, react.useState)(false);
			const [dragging, setDragging] = (0, react.useState)(false);
			const [striking, setStriking] = (0, react.useState)(false);
			const [floaters, setFloaters] = (0, react.useState)([]);
			const [bubbles, setBubbles] = (0, react.useState)([]);
			const [settingsOpen, setSettingsOpen] = (0, react.useState)(false);
			const dragRef = (0, react.useRef)(null);
			const listenersRef = (0, react.useRef)(null);
			const floaterId = (0, react.useRef)(0);
			const bubbleId = (0, react.useRef)(0);
			const prevRainbow = (0, react.useRef)(state.rainbow);
			const countRef = (0, react.useRef)(state.count);
			const lastStrikeAt = (0, react.useRef)(null);
			const panelRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				saveState(safeStorage(), state);
			}, [state]);
			(0, react.useEffect)(() => () => {
				const listeners = listenersRef.current;
				if (listeners === null) return;
				window.removeEventListener("pointermove", listeners.move);
				window.removeEventListener("pointerup", listeners.up);
				window.removeEventListener("pointercancel", listeners.up);
			}, []);
			(0, react.useEffect)(() => {
				const onResize = () => {
					setState((prev) => {
						const clamped = clampPosition(prev.x, prev.y, viewport());
						return clamped.x === prev.x && clamped.y === prev.y ? prev : {
							...prev,
							...clamped
						};
					});
				};
				window.addEventListener("resize", onResize);
				return () => {
					window.removeEventListener("resize", onResize);
				};
			}, []);
			(0, react.useEffect)(() => {
				if (!settingsOpen) return;
				const onPress = (event) => {
					/* v8 ignore next 2 -- panelRef is bound whenever the popover is open */
					if (panelRef.current === null) return;
					if (event.target instanceof Node && panelRef.current.contains(event.target)) return;
					setSettingsOpen(false);
				};
				document.addEventListener("pointerdown", onPress);
				return () => {
					document.removeEventListener("pointerdown", onPress);
				};
			}, [settingsOpen]);
			/** Add a floating label that removes itself after its lifetime. */
			const pushFloater = (label, rainbow, ms = FLOATER_MS) => {
				const id = ++floaterId.current;
				setFloaters((current) => [...current, {
					id,
					label,
					rainbow
				}]);
				window.setTimeout(() => {
					setFloaters((current) => current.filter((floater) => floater.id !== id));
				}, ms);
			};
			/** Add a complaint bubble that removes itself after its lifetime. */
			const pushBubble = (text) => {
				const id = ++bubbleId.current;
				setBubbles((current) => [...current, {
					id,
					text
				}]);
				window.setTimeout(() => {
					setBubbles((current) => current.filter((bubble) => bubble.id !== id));
				}, BUBBLE_MS);
			};
			/**
			* One strike: gain merit (1, or a crit of 1..9 at the stated odds), swing
			* the mallet, float the gain in gold, roll the rainbow, and complain when
			* strikes arrive faster than the fish can absorb.
			*/
			const strike = () => {
				const now = Date.now();
				const fast = lastStrikeAt.current !== null && now - lastStrikeAt.current < 100;
				lastStrikeAt.current = now;
				const gain = rollGain(Math.random);
				const shift = rollColorShift(Math.random);
				const shiftColor = shift ? randomColor(Math.random) : null;
				const before = countRef.current;
				countRef.current = before + gain;
				if (crossesFortune(before, countRef.current)) pushFloater(t("fortune", { gain }), false, FORTUNE_MS);
				setState((prev) => {
					const nextCount = prev.count + gain;
					return {
						...prev,
						count: nextCount,
						color: shiftColor ?? prev.color,
						rainbow: prev.rainbow || rollRainbow(nextCount, Math.random)
					};
				});
				setStriking(true);
				pushFloater(gain > 1 ? t("strike.crit", { gain }) : t("strike.plus"), false);
				if (shift) pushFloater(t("color.shift"), false);
				if (fast)
 /* v8 ignore next 1 -- pickFastStrikeMessage clamps the index */
				pushBubble(t(BUBBLE_KEYS[pickFastStrikeMessage(Math.random)] ?? "bubble.0"));
				window.setTimeout(() => {
					setStriking(false);
				}, SWING_MS);
			};
			(0, react.useEffect)(() => {
				const became = state.rainbow && !prevRainbow.current;
				prevRainbow.current = state.rainbow;
				if (!became) return;
				pushFloater(t("rainbow.burst"), true);
			}, [state.rainbow]);
			const onPointerDown = (event) => {
				if (event.button !== 0 || dragRef.current !== null) return;
				dragRef.current = {
					startX: event.clientX,
					startY: event.clientY,
					originX: state.x,
					originY: state.y,
					moved: false
				};
				const move = (moveEvent) => {
					const session = dragRef.current;
					/* v8 ignore next 2 -- unreachable: listener lifetime mirrors the session */
					if (session === null) return;
					const dx = moveEvent.clientX - session.startX;
					const dy = moveEvent.clientY - session.startY;
					if (!session.moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD_PX) return;
					session.moved = true;
					setDragging(true);
					const clamped = clampPosition(session.originX + dx, session.originY + dy, viewport());
					setState((prev) => ({
						...prev,
						x: clamped.x,
						y: clamped.y
					}));
				};
				const up = () => {
					window.removeEventListener("pointermove", move);
					window.removeEventListener("pointerup", up);
					window.removeEventListener("pointercancel", up);
					listenersRef.current = null;
					const session = dragRef.current;
					dragRef.current = null;
					if (session !== null && !session.moved) strike();
					setDragging(false);
				};
				listenersRef.current = {
					move,
					up
				};
				window.addEventListener("pointermove", move);
				window.addEventListener("pointerup", up);
				window.addEventListener("pointercancel", up);
			};
			const onKeyDown = (event) => {
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				strike();
			};
			const setColor = (color) => {
				setState((prev) => ({
					...prev,
					color
				}));
			};
			const randomizeColor = () => {
				setState((prev) => ({
					...prev,
					color: randomColor(Math.random)
				}));
			};
			const reset = () => {
				countRef.current = 0;
				setState((prev) => ({
					...prev,
					count: 0,
					rainbow: false
				}));
			};
			const fishStyle = state.rainbow ? void 0 : {
				background: `linear-gradient(145deg, ${shade(state.color, 1.18)} 0%, ${state.color} 45%, ${shade(state.color, .72)} 100%)`,
				borderColor: shade(state.color, .6)
			};
			const golden = state.count > 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: clsx(Muyu_module_css_default.root, hovered && Muyu_module_css_default.hovered, dragging && Muyu_module_css_default.dragging),
				style: {
					left: state.x,
					top: state.y
				},
				onMouseEnter: () => {
					setHovered(true);
				},
				onMouseLeave: () => {
					setHovered(false);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: clsx(Muyu_module_css_default.fishRow, striking && Muyu_module_css_default.struck),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							role: "button",
							tabIndex: 0,
							"aria-label": t("fish.aria"),
							className: clsx(Muyu_module_css_default.fish, state.rainbow && Muyu_module_css_default.rainbow),
							style: fishStyle,
							onPointerDown,
							onKeyDown,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: Muyu_module_css_default.eye }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: Muyu_module_css_default.slot })]
						}),
						hovered ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MalletIcon, {
							color: state.color,
							rainbow: state.rainbow
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: Muyu_module_css_default.floaters,
							children: floaters.map((floater) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: clsx(Muyu_module_css_default.floater, floater.rainbow && Muyu_module_css_default.floaterRainbow),
								children: floater.label
							}, floater.id))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: Muyu_module_css_default.bubbles,
							"aria-live": "polite",
							children: bubbles.map((bubble) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: Muyu_module_css_default.bubble,
								children: bubble.text
							}, bubble.id))
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: panelRef,
					className: Muyu_module_css_default.panel,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: Muyu_module_css_default.count,
							style: golden ? {
								color: "var(--muyu-gold)",
								textShadow: "0 0 6px var(--muyu-gold-glow)"
							} : void 0,
							children: t("count", { count: state.count })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": t("settings.title"),
							"aria-expanded": settingsOpen,
							title: t("settings.title"),
							className: clsx(Muyu_module_css_default.settings, (hovered || settingsOpen) && Muyu_module_css_default.settingsVisible),
							onClick: () => {
								setSettingsOpen((open) => !open);
							},
							children: "···"
						}),
						settingsOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: Muyu_module_css_default.popover,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: Muyu_module_css_default.tools,
								children: [
									PRESET_COLORS.map((color) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": t("color.custom"),
										"aria-pressed": state.color === color,
										className: Muyu_module_css_default.swatch,
										style: { background: color },
										onClick: () => {
											setColor(color);
										}
									}, color)),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "color",
										"aria-label": t("color.custom"),
										className: Muyu_module_css_default.colorInput,
										value: state.color,
										onChange: (event) => {
											setColor(event.target.value);
										}
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: Muyu_module_css_default.action,
										onClick: randomizeColor,
										children: t("color.random")
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: Muyu_module_css_default.actionReset,
								onClick: reset,
								children: t("reset")
							})]
						}) : null
					]
				})]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** `muyu` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "muyu";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"fish.aria": "赛博木鱼：点击敲击，可拖拽",
			"count": "功德 + {count}",
			"settings.title": "设置",
			"color.custom": "自定义颜色",
			"color.random": "随机颜色",
			"reset": "重置计数",
			"rainbow.burst": "七彩！",
			"color.shift": "变色！",
			"strike.plus": "+1",
			"strike.crit": "+{gain} 暴击！",
			"fortune": "+{gain} 暴富！",
			"bubble.0": "慢一点嘛，木鱼都要冒烟啦~",
			"bubble.1": "这么快，功德没跟上呢_(´ཀ`」 ∠)_",
			"bubble.2": "手速过快，功德溢出……",
			"bubble.3": "再快它就要唱rap了，冷静！",
			"bubble.4": "您的手速已超越全国99%的人，请减速慢敲～"
		};
		/** English dictionary, key-identical to the Chinese source of truth. */
		const en = {
			"fish.aria": "Cyber wooden fish: click to strike, draggable",
			"count": "Merit + {count}",
			"settings.title": "Settings",
			"color.custom": "Custom color",
			"color.random": "Random color",
			"reset": "Reset count",
			"rainbow.burst": "Rainbow!",
			"color.shift": "Color shift!",
			"strike.plus": "+1",
			"strike.crit": "+{gain} crit!",
			"fortune": "+{gain} Fortune!",
			"bubble.0": "Take it easy, the fish is about to smoke~",
			"bubble.1": "So fast the merit can't keep up_(´ཀ`」 ∠)_",
			"bubble.2": "Too fast, merit is overflowing...",
			"bubble.3": "Any faster and it'll start rapping, chill!",
			"bubble.4": "Your APM beats 99% of the country, slow down~"
		};
		//#endregion
		//#region src/client/index.ts
		/** Required services: the slot registry and the widget's copy. */
		const inject = ["slots", "locale"];
		/**
		* Client plugin body: register the dictionaries and the overlay entry.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-muyu: dictionaries");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-muyu",
				locale: NS
			}, Muyu));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map