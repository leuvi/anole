const pkg = require('../package.json')

export let __process = {
  author: pkg.author,
  version: pkg.version,
  time: new Date().toLocaleString()
}