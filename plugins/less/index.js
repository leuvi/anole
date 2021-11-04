const path = require('path')
const fs = require('fs')
const less = require('less')

//匹配@import css规则
const importRegexp = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/
const globalImportRegexp = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/g
//注释
const importCommentRegexp = /(?:\/\*(?:[\s\S]*?)\*\/)|(\/\/(?:.*)$)/gm

//获取@import方式导入的less文件路径
function getLessImports(filePath) {
  try {
    const dir = path.dirname(filePath)
    const content = fs.readFileSync(filePath).toString('utf-8')
    const clearContent = content.replace(importCommentRegexp, '')
    const matchs = clearContent.match(globalImportRegexp) || []

    const fileImports = matchs
      .map(item => item.match(importRegexp)[2])
      .filter(item => !!item)
      .map(item => path.resolve(dir, path.extname(item) ? item : `${item}.less`))

    const recursiveImports = fileImports.reduce((result, item) => {
      return [...result, ...getLessImports(item)]
    }, fileImports)

    const result = recursiveImports.filter(item => ['.css', '.less'].includes(path.extname(item).toLowerCase()))
    return result
  } catch (e) {
    return []
  }
}

//把less错误抛给esbuild
function convertLessError(err) {
  const sourceLine = err.extract.filter(line => line)
  const lineText = sourceLine.length === 3 ? sourceLine[1] : sourceLine[0]

  return {
    text: err.message,
    location: {
      namespace: 'file',
      file: err.filename,
      line: err.line,
      column: err.column,
      lineText
    }
  }
}

//less-plugin插件
const lessPlugin = (options = {}) => {
  return {
    name: 'less-plugin',
    setup: (build) => {
      //less文件命名空间
      build.onResolve({ filter: /\.less$/, namespace: 'file' }, args => {
        const filePath = path.resolve(process.cwd(), path.relative(process.cwd(), args.resolveDir), args.path)
        return {
          path: filePath,
          watchFiles: !!build.initialOptions.watch ? [filePath, ...getLessImports(filePath)] : undefined
        }
      })

      //构建less文件
      build.onLoad({ filter: /\.less$/, namespace: 'file' }, async (args) => {
        const content = await fs.promises.readFile(args.path, 'utf-8')
        const rootpath = path.dirname(args.path)
        const filename = path.basename(args.path)

        try {
          //less文件转成普通css文件
          const result = await less.render(content, {
            filename,
            rootpath,
            ...options,
            paths: [...(options.paths || []), rootpath]
          })

          //路径转换
          // const css = result.css.replace(/url\(([^\(]+)\)/, (v1, v2) => {
          //   //console.log(`url(${decodeURI(`${options.rootpath + '\\' + v2.replace(/\//g, '\\')}`)})`)
          //   return `url(${decodeURI(`${options.rootpath.replace(/\\/g, '\/')}`) + '\/' + v2})`
          // })
      
          return {
            contents: result.css,
            loader: 'css',
            resolveDir: rootpath
          }
        } catch (error) {
          return {
            errors: [convertLessError(error)],
            resolveDir: rootpath
          }
        }
      })
    }
  }
}

module.exports = lessPlugin