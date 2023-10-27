#!/usr/bin/env node

import { cac } from 'cac'
import pm from 'which-pm-runs'
import { mkdir } from 'node:fs/promises'
import editPkgJson from 'edit-json-file'
import { installPackages, fileFetcher, setPackageJsonName, httpHeaders, GithubFile } from './utils.js'
import { blue, cyan, green } from 'colorette'

const cli = cac('tinyhttp')

let pkg: 'pnpm' | 'npm' | 'yarn' = 'pnpm'

const { options } = cli.parse()

const info = pm()

if (info?.name) pkg = info.name as typeof pkg

if (options.pkg) pkg = options.pkg

const file = editPkgJson('../package.json')

cli
  .version(file.get('version'))
  .help()
  .command('new <project> [folder]', 'Create new tinyhttp project from template')
  .option('--pkg [pkg]', 'Choose package manager')
  .action(async (name, folder) => {
    const dir = folder || name

    cyan(`Creating a new tinyhttp project from ${name} template in ${dir} folder ⚡`)

    green('Fetching template contents ⌛')

    try {
      await mkdir(dir)
    } catch {
      throw new Error('Failed to create project directory')
    }

    process.chdir(dir)

    const res = await fetch(
      `https://api.github.com/repos/talentlessguy/tinyhttp/contents/examples/${name}`,
      httpHeaders
    )

    const data = (await res.json()) as GithubFile[]

    if (res.status === 404) return console.error(`Template ${name} not found`)

    await fileFetcher(data, res.status)

    setPackageJsonName(dir)
    await installPackages(pkg)

    // Finish

    blue(
      `Done! You can now launch your project with running these commands:
    
    cd ${dir}  

    ${pkg} run start
    `
    )
  })
cli.parse()
