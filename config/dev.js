const esbuild = require('esbuild')
const { createServer, request } = require('http')
const { exec } = require('child_process')
const chalk = require('chalk')
const path = require('path')
const ip = require('ip')
const sh = require('shelljs')
const lessPlugin = require('../plugins/less')

const clients = []
const port = 8050
const directory = 'public'

sh.cp('node_modules/esbuild-wasm/esbuild.wasm', `${directory}/compile.wasm`)

esbuild.build({
  entryPoints: {
    app: 'src/index.jsx'
  },
  bundle: true,
  outdir: directory,
  banner: {
    //js脚本顶部增加sse推送自动刷新
    js: `(() => {
      new EventSource("/event.sse").onmessage = (e) => {
        window.location.reload()
      }
    })();`
  },
  loader: {
    '.png': 'dataurl',
    '.jpg': 'dataurl',
  },
  define: {
    'process.env.NODE_ENV': '"dev"'
  },
  plugins: [
    lessPlugin({
      //window系统注意路径转换
      rootpath: path.join(process.cwd(), 'src/assets/images').replace(/\\/g, '\/'),
      globalVars: {
        '@bgcolor': '#191919',
        '@maincolor': '#ffcf00'
      }
    })
  ],
  watch: {
    onRebuild(error, result) {
      clients.forEach(res => {
        res.write('data: update\n\n')
      })
      clients.length = 0
      //暂时还拿不到依赖更改的文件
      //未来可能会重构build api https://github.com/evanw/esbuild/issues/1268
      console.log(error ? error : `\n文件更改了 ${new Date().toTimeString()}`)
    }
  }
}).catch(() => process.exit(1))


esbuild.serve({
  servedir: 'public'
}, {}).then(result => {
  createServer((req, res) => {
    const { url, method, headers } = req
    if (req.url === '/event.sse') {
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        })
      )
    }
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html`
    req.pipe(
      request({ hostname: '0.0.0.0', port: result.port, path, method, headers }, prxRes => {
        res.writeHead(prxRes.statusCode, prxRes.headers)
        prxRes.pipe(res, { end: true })
      }), { end: true }
    )
  }).listen(port)

  console.log(`
  服务已启动：
  - ${chalk.green(`http://localhost:${port}`)}
  - ${chalk.green(`http://${ip.address()}:${port}`)}
  `)

  if (process.platform === 'win32') {
    exec(`cmd /c start http://localhost:${port}`)
  }
})