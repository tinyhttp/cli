import { writeFile, mkdir } from 'node:fs/promises'
import ora from 'ora'
import editPkgJson from 'edit-json-file'
import * as colorette from 'colorette'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

export const runCmd = promisify(exec)

export const install = async (pkg: string, pkgs: string[], dev = true) =>
  await runCmd(`${pkg} ${pkg === 'yarn' ? 'add' : 'i'} ${dev ? '-D' : '-S'} ${pkgs.join(' ')}`)

export const httpHeaders: RequestInit = {
  headers: { 'user-agent': 'node.js' }
}

export type GithubFile = { name: string; download_url: string; type: string; url: string }

export const fileFetcher = async (data: GithubFile[], statusCode: number, dir?: string) => {
  const spinner = ora()

  spinner.start(colorette.blue(`Fetching ${data.length} files...`))

  if (statusCode !== 200) console.warn(`Bad status code: ${statusCode}`)

  // Download files
  for (const { name, download_url, type, url } of data) {
    if (type === 'file') {
      spinner.text = `Fetching ${name} file`

      const res = await fetch(download_url, httpHeaders)
      const data = (await res.text()) as string

      try {
        await writeFile(dir ? `${dir}/${name}` : name, data)
      } catch {
        throw new Error('Failed to create a project file')
      }
    } else if (type === 'dir') {
      spinner.text = `Scanning ${name} directory`
      try {
        await mkdir(name)
      } catch {
        throw new Error('Failed to create a project subdirectory')
      }
      
      const res = await fetch(url, httpHeaders)
      const data = (await res.json()) as GithubFile[]
      await fileFetcher(data, res.status, name)
    }
  }

  spinner.stop()
}

export const installPackages = async (pkg: string) => {
  // Edit package.json

  const file = editPkgJson('package.json')

  const allDeps = Object.keys(file.get('dependencies'))

  // Replace "workspace:*" with "latest"

  const thDeps = allDeps.filter((x) => x.startsWith('@tinyhttp'))

  const newDeps: Record<string, string> = {}

  for (const dep of thDeps) newDeps[dep] = 'latest'

  file
    .set('dependencies', {
      ...file.get('dependencies'),
      ...newDeps
    })
    .save()

  const depCount =
    (Object.keys(file.get('dependencies')) || []).length + (Object.keys(file.get('devDependencies') || {}) || []).length

  const spinner = ora()

  spinner.start(colorette.cyan(`Installing ${depCount} package${depCount > 1 ? 's' : ''} with ${pkg} 📦`))

  try {
    await runCmd(`${pkg} ${pkg === 'yarn' ? 'add' : 'i'}`)
  } catch {
    throw new Error('Failed to install packages')
  }

  spinner.stop()
}

export const setPackageJsonName = (name: string) => {
  const file = editPkgJson('package.json')
  file.set('name', name).save()
}
