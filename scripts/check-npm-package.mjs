import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const packagePath = fileURLToPath(new URL('../package.json', import.meta.url))

// 读取包清单，确保检查使用的是当前工作树的发布配置。
async function readPackageManifest() {
  return JSON.parse(await readFile(packagePath, 'utf8'))
}

// 调用 npm 的 dry-run 打包接口，读取最终会进入 tarball 的文件清单。
function readPackedFiles() {
  const output = execFileSync(
    'npm',
    ['pack', '--dry-run', '--json', '--ignore-scripts'],
    { cwd: root, encoding: 'utf8' },
  )
  const result = JSON.parse(output)
  if (!Array.isArray(result) || result.length !== 1) {
    throw new Error('npm pack returned an unexpected result.')
  }
  return result[0]
}

// 验证 DSH Bundle 必需文件存在，同时阻止开发目录进入发布包。
function validatePackage(manifest, packed) {
  const files = new Set(packed.files.map((file) => file.path))
  const requiredFiles = ['package.json', 'lib/index.js', 'lib/client.js', 'cordis.patch.yml']
  const missingFiles = requiredFiles.filter((file) => !files.has(file))
  if (missingFiles.length > 0) {
    throw new Error(`npm package is missing required files: ${missingFiles.join(', ')}`)
  }

  const forbiddenPrefix = ['node_modules/', '.git/', 'tasks/']
  const leakedFiles = [...files].filter((file) => forbiddenPrefix.some((prefix) => file.startsWith(prefix)))
  if (leakedFiles.length > 0) {
    throw new Error(`npm package contains forbidden files: ${leakedFiles.join(', ')}`)
  }

  if (manifest.publishConfig?.access !== 'public') {
    throw new Error('publishConfig.access must be public for the public package.')
  }

  // 验证 npm 包仍然声明 DSH Bundle 和 Web client，避免出现“能安装但不能加载”的包。
  if (typeof manifest.dsh?.bundle?.patch !== 'string') {
    throw new Error('dsh.bundle.patch must be a package-relative string.')
  }
  if (manifest.dsh?.client?.platform !== 'web' || typeof manifest.exports?.['./client'] === 'undefined') {
    throw new Error('dsh.client.platform must be web and exports["./client"] must exist.')
  }

  // npm tarball 文件名由包名和版本组成，兼容 scoped 与 unscoped 包名。
  const expectedFilename = `${manifest.name.replace(/^@/, '').replace('/', '-')}-${manifest.version}.tgz`
  if (packed.filename !== expectedFilename) {
    throw new Error(`npm pack filename must be ${expectedFilename}, got ${packed.filename}`)
  }
}

const manifest = await readPackageManifest()
const packed = readPackedFiles()
validatePackage(manifest, packed)
console.log(`npm package contents are valid for ${manifest.name}@${manifest.version}.`)
