const gulp = require('gulp')
const sass = require('gulp-sass')

const rollup = require('rollup')
const rollupResolve = require('rollup-plugin-node-resolve')
const rollupCommonjs = require('rollup-plugin-commonjs')
const rollupTypescript = require('rollup-plugin-typescript')
const rollupSvelte = require('rollup-plugin-svelte')
const rollupSass = require('svelte-preprocess-sass').sass

const { inlineSource } = require('inline-source')
const fs = require('fs')
const path = require('path')


const code = async function() {
  const bundle = await rollup.rollup({
    input: './src/code/main.ts',
    plugins: [rollupTypescript({ target: 'es6' })]
  })

  await bundle.write({
    file: './dist/code.js',
    format: 'cjs',
    name: 'code',
    sourcemap: false
  })
}

const ui_svelte = async function() {
  const bundle = await rollup.rollup({
    input: './src/ui/main.js',
    plugins: [
      rollupSvelte({
        dev: false,
        // emitCss: true,
        preprocess: {
          style: rollupSass({}, { name: 'scss'}),
        },
        css: css => {
          css.write('./dist/ui.css', false)
        }
      }),
      rollupResolve(),
      rollupCommonjs()
    ]
  })

  await bundle.write({
    sourcemap: false, //true
    format: 'cjs',
    strict: false,
    file: './dist/ui.js'
  })
}

const inlineHtml = async function() {
  const htmlpath = path.resolve('./src/ui/index.html')
  let html
  try {
    html = await inlineSource(htmlpath, {
      attribute: false,
      compress: true,
    })

    await fs.writeFileSync('./dist/index.html', html)
    await fs.unlinkSync('./dist/ui.js')
    await fs.unlinkSync('./dist/ui.css')
    await fs.unlinkSync('./dist/style.css')
  } catch (err) {
    console.error(err)
  }
}

const scss = function () {
  return gulp.src('./src/ui/style/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'))
}

const ui = gulp.series( gulp.parallel(ui_svelte, scss), inlineHtml)

function watch() {
  gulp.watch(['./src/code/**/*.ts'], code)
  gulp.watch([
    './src/ui/**/*.js',
    './src/ui/**/*.svelte',
    './src/ui/index.html',
    './src/ui/style/**/*.scss'], ui)
}

exports.build = gulp.parallel(code, ui)
exports.watch = watch
exports.scss = scss
