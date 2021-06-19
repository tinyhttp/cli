import { suite } from 'uvu'
import path from 'path'
import { expect } from 'earljs'
import { rm, readdir, mkdir, readFile } from 'fs/promises'
import { exec } from 'child_process'
import { runCmd, setPackageJsonName, setupEslint } from '../src/utils'

const FIXTURES_PATH = path.join(process.cwd(), 'tests/fixtures')

const MOD_PATH = path.join(FIXTURES_PATH, 'test')

function describe(name: string, fn: (...args: any[]) => any) {
  const x = suite(name)
  fn(x)
  x.run()
}

describe('runCmd(cmd)', (it) => {
  it('should work the same as child_process.exec(cmd)', async () => {
    const { stdout } = await runCmd('pwd')

    let syncStdout = ''

    exec('pwd', (_, stdout) => (syncStdout += stdout)).on('close', () => {
      expect(stdout).toEqual(syncStdout)
    })
  })
})

describe('setPackageJsonName(name)', (it) => {
  let cwd: string
  it('sets name correctly', async () => {
    const name = 'aTestName'
    cwd = process.cwd()

    await mkdir(MOD_PATH)
    process.chdir(MOD_PATH)

    await runCmd('pnpm init -y')

    setPackageJsonName(name)
    const pkgJSON = await readFile('package.json')
    const { name: packageName } = JSON.parse(pkgJSON.toString())
    expect(packageName).toEqual(name)

    // Cleanup
    process.chdir(cwd)
    await rm(MOD_PATH, { recursive: true, force: true })
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
