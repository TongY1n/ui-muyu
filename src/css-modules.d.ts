declare module '*.module.css' {
  export const cssText: string
  const classes: Readonly<Record<string, string>>
  export default classes
}
