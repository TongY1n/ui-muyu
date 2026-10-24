import { defineConfig } from 'tsdown'

/** 打包浏览器 harness：react/react-dom 全部内联，产物为独立 ESM。 */
export default defineConfig({
  name: 'muyu-e2e-harness',
  entry: { harness: './harness.tsx' },
  outDir: 'dist',
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  dts: false,
  sourcemap: false,
  clean: true,
  deps: { alwaysBundle: [/.*/] },
  define: { 'process.env.NODE_ENV': '"production"' },
})
