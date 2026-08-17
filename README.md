# @deepseek-ai/dsh-client-ui-muyu

English | [中文](README.zh.md)

<div align="center">
  <img src="docs/images/preview.png" width="220" alt="Cyber wooden fish preview" />
</div>

A cyber wooden fish — a small floating widget in the web window. Tap it during work breaks to rack up some "merit".

Click the fish to strike it; press and drag to move it anywhere. Progress survives page reloads — the rest is yours to discover!

## Install

```sh
dsh plugin --profile web add github:TongY1n/ui-muyu
```

Bundle plugins take effect after restarting the app.

## Usage note

The fish first appears in the bottom-right corner of the window. If you don't see it after opening the app, it may be covered by another floating panel or plugin.

Temporarily close the covering panel, drag the fish somewhere unobstructed, then reopen the panel.

If it vanishes after a drag-and-release, it may have been dropped behind something — time to hunt down your missing fish (´▽｀)

## Known Limitations and Deferred Work

- **No sounds** — a real wooden fish goes *tok*; this one is deliberately silent.
- **Merit, position, and color are per-browser** — stored in `localStorage` rather than the session log, so a new machine or browser starts fresh.

## Privacy & Permissions

A purely decorative browser widget — nothing more:

- **No network access** — it never makes a request.
- **No API keys, credentials, or shell** — none are read, stored, or requested.
- **No file, session, or conversation access** — DSH sessions and logs are left alone.
- **`localStorage` only** — merit, position, and color live in the browser's `localStorage`, per-browser, and are cleared along with site data.

## License

[MIT](LICENSE)

## Acknowledgements

Shepherded by TongY1n — lively development by DeepSeek-V4-Flash+Pro, serious review by GLM5.3, all on DeepSeek-Harness.
