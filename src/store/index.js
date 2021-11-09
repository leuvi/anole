import { observable } from 'mobx'
import * as esbuild from 'esbuild-wasm/esm/browser.min.js'

const store = observable({
  wasm: esbuild.initialize({ wasmURL: './compile.wasm' }),
  build: esbuild
})

export default store