const sh = require('shelljs')

const directory = 'dist1'

if(!sh.test('-e', directory)) {
  sh.mkdir(directory)
}
sh.cp('public/index.html', directory)
sh.cp('node_modules/esbuild-wasm/esbuild.wasm', `${directory}/compile.wasm`)
sh.sed('-i', /(<\/head>)/, '  <link rel="stylesheet" href="./js/main.css">\n$1', `${directory}/index.html`)
sh.sed('-i', /(<\/body>)/, '  <script src="./js/main.mjs" type="module"></script>\n$1', `${directory}/index.html`)