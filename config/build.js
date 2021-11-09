const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')
const chalk = require('chalk')
const sh = require('shelljs')
const lessPlugin = require('../plugins/less')

const start = Date.now()

const versionInfo = `version: ${pkg.version}, author: ${pkg.author}, time: ${new Date().toLocaleString()}`
const directory = 'dist'

if(sh.test('-e', directory)) {
  sh.rm('-rf', directory)
}
sh.mkdir(directory)
sh.cp('public/index.html', directory)
sh.cp('node_modules/esbuild-wasm/esbuild.wasm', `${directory}/compile.wasm`)
sh.sed('-i', /app\.css/, './js/main.css', `${directory}/index.html`)
sh.sed('-i', /app\.js/, './js/main.mjs', `${directory}/index.html`)


let envPlugin = {
  name: 'auto-node-env',
  setup(build) {
    const options = build.initialOptions
    options.define = options.define || {}
    options.define['process.env.NODE_ENV'] =
      options.minify ? '"prod"' : '"dev"'
  },
}

const run = async () => {
  let result = await esbuild.build({
    entryPoints: {
      main: 'src/index.jsx'
    },
    entryNames: 'js/[name]',
    chunkNames: 'chunks/[name]-[hash]',
    outdir: directory,
    outExtension: {
      '.js': '.mjs'
    },
    bundle: true,
    minify: true,
    inject: ['utils/inject.js'],
    format: 'esm',
    assetNames: 'static/[name]-[hash]',
    loader: {
      '.png': 'file',
      '.jpg': 'file',
    },
    banner: {
      js: `//${versionInfo}`,
      css: `/*${versionInfo}*/`
    },
    metafile: true,
    legalComments: 'none',
    plugins: [
      envPlugin,
      lessPlugin({
        //window系统注意路径转换
        rootpath: path.join(process.cwd(), 'src/assets/images').replace(/\\/g, '\/'),
        globalVars: {
          '@bgcolor': '#191919',
          '@maincolor': '#ffcf00'
        }
      })],
    pure: ['console.log']
  })

  console.log(await esbuild.analyzeMetafile(result.metafile, { verbose: false }))

  console.log(`构建总耗时：${chalk.green((Date.now() - start) / 1000)} 秒`)
}

run()