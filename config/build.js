const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')
const glob = require('glob')

glob('src/**/*.jsx', (err, files) => {
  if(err) {
    console.log(err)
    process.exit(1)
  }
  console.log(files)
})

const testPlugin = {
  name: 'testa',
  setup(build) {
    build.onResolve({ filter: /components\// }, args => {
      //console.log(args)
      //return { path: path.join(args.resolveDir, 'public', args.path) }
    })
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      let text = await fs.promises.readFile(args.path, 'utf8')
      text += 'h1{color:green}';
      return {
        contents: text,
        loader: 'css'
      }
    })
  }
}

let examplePlugin = {
  name: 'auto-node-env',
  setup(build) {
    const options = build.initialOptions
    options.define = options.define || {}
    options.define['process.env.NODE_ENV'] =
      options.minify ? '"生产环境"' : '"开发环境"'
  },
}

const run = async () => {
  let result = await esbuild.build({
    entryPoints: {
      main: 'src/index.jsx'
    },
    entryNames: 'js/[name]',
    chunkNames: 'chunks/[name]-[hash]',
    outdir: 'dist',
    outExtension: {
      '.js': '.mjs'
    },
    bundle: true,
    minify: true,
    inject: ['utils/inject.js'],
    format: 'esm',
    assetNames: 'static/[name]',
    loader: {
      '.png': 'file',
    },
    banner: {
      js: `//version: ${pkg.version}, author: ${pkg.author}, time: ${new Date().toLocaleString()}`,
      css: `/*version: ${pkg.version}, author: ${pkg.author}, time: ${new Date().toLocaleString()}*/`
    },
    metafile: true,
    legalComments: 'none',
    plugins: [testPlugin, examplePlugin]
    // pure: ['console.log']
  })

  if (result) {

  } else {

  }

  // let text = await esbuild.analyzeMetafile(result.metafile, {
  //   verbose: false
  // })
  // console.log(text)

}

run()