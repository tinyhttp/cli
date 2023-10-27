import { describe, it, before, after } from 'node:test'
import * as path from 'node:path'
import { strictEqual } from 'node:assert/strict'
import { rm, mkdir, readFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import { runCmd, setPackageJsonName } from '../src/utils.js'

const FIXTURES_PATH = path.join(process.cwd(), 'tests/fixtures')

const MOD_PATH = path.join(FIXTURES_PATH, 'test')

describe('runCmd(cmd)', () => {
  it('should work the same as child_process.exec(cmd)', async () => {
    const { stdout } = await runCmd('pwd')

    let syncStdout = ''

    exec('pwd', (_, stdout) => (syncStdout += stdout)).on('close', () => {
      strictEqual(stdout, syncStdout)
    })
  })
})

describe('setPackageJsonName(name)', () => {
  const cwd = process.cwd()

  before(async () => {
    await mkdir(MOD_PATH)
    process.chdir(MOD_PATH)
  })

  after(async () => {
    process.chdir(cwd)
    await rm(MOD_PATH, { recursive: true, force: true })
  })

  it('sets name correctly', async () => {
    const name = 'aTestName'

    await runCmd('pnpm init')

    setPackageJsonName(name)
    const pkgJSON = await readFile('package.json')
    const { name: packageName } = JSON.parse(pkgJSON.toString())
    strictEqual(packageName, name)
  })
})

/* describe('install(pkgManager, ...pkgs)', () => {
  let cwd: string
  beforeEach(async () => {
    cwd = process.cwd()
    await mkdir(MOD_PATH)
    process.chdir(MOD_PATH)
  })
  afterEach(async () => {
    process.chdir(cwd)
    await rm(MOD_PATH, { recursive: true, force: true })
  })
  it('installs a dependency with pnpm', async () => {
    await runCmd('pnpm init -y')

    await install('pnpm', ['milliparsec'], false)

    const dir = await readdir('.')

    expect(dir.sort()).toEqual(['node_modules', 'package.json'].sort())

    const pkgJSON = await readFile('package.json')

    const { dependencies } = JSON.parse(pkgJSON.toString())

    expect(Object.keys(dependencies)).toContain('milliparsec')
  })
  it('installs a dependency with npm', async () => {
    await runCmd('npm init -y')

    await install('npm', ['milliparsec'], false)

    const dir = await readdir('.')

    expect(dir.sort()).toEqual(['node_modules', 'package.json', 'package-lock.json'].sort())

    const pkgJSON = await readFile('package.json')

    const { dependencies } = JSON.parse(pkgJSON.toString())

    expect(Object.keys(dependencies)).toContain('milliparsec')
  })
}) */
