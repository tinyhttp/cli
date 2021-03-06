import ts from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { dependencies } from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm'
    }
  ],
  plugins: [ts(), json()],
  external: [...Object.keys(dependencies)]
}
