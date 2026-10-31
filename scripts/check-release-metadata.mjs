import { readFile } from 'node:fs/promises'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const registry = JSON.parse(await readFile(new URL('../registry/curated/plugin.json', import.meta.url), 'utf8'))

const version = packageJson.version
const tag = `v${version}`
const expectedTarball = `${packageJson.name}-${version}.tgz`
const expectedSpecSuffix = `/releases/download/${tag}/${expectedTarball}`
const errors = []

if (registry.id !== 'ui-muyu') errors.push(`registry id must be ui-muyu, got ${registry.id}`)
if (registry.version !== tag) errors.push(`registry version must be ${tag}, got ${registry.version}`)
if (typeof registry.spec !== 'string' || !registry.spec.endsWith(expectedSpecSuffix)) {
  errors.push(`registry spec must end with ${expectedSpecSuffix}, got ${registry.spec}`)
}

if (errors.length > 0) {
  console.error('Release metadata check failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Release metadata is consistent for ${packageJson.name}@${version}.`)
}
