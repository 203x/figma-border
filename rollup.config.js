import resolve from '@rollup/plugin-node-resolve'

import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import html from '@rollup/plugin-html'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH

const code = {
  input: 'src/code/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    name: 'code',
    sourcemap: !production,
  },
  plugins: [typescript({ removeComments: production })],
}

const ui = {
  input: 'src/ui/main.js',
  output: {
    file: 'dist/ui.bundle.js',
    format: 'esm',
    name: 'ui',
    sourcemap: !production,
  },
  plugins: [
    svelte({
      include: 'src/ui/**/*.svelte',
      emitCss: true,
    }),
    postcss({ extract: true, minimize: production }),
    resolve({
      moduleDirectories: ['node_modules'],
    }),
    commonjs(),
    html({
      fileName: 'ui.html',
      // eslint-disable-next-line no-unused-vars
      template: ({ attributes, bundle, files, publicPath, title }) => {
        let css = []
        let js = []
        for (const key in files) {
          const typeFile = files[key]
          if (key === 'css') {
            typeFile.forEach((file) => {
              // if (file.isAsset) {
              if (file.type === 'asset') {
                css.push(file.source)
              }
            })
          } else if (key === 'js') {
            typeFile.forEach((file) => {
              if (file.isEntry) {
                js.push(file.code)
              }
            })
          }
        }
        // console.log('css: ', css.length)
        // console.log('js: ', js.length)

        return `<div id="app"></div>\n<script>${js.join(
          '\n;'
        )}</script>\n<style>${css.join('\n')}</style>`
      },
    }),
    production &&
      del({
        targets: ['dist/*.bundle.js', 'dist/*.bundle.css', 'dist/*.map'],
        hook: 'writeBundle',
      }),
  ],
}

export default [code, ui]
