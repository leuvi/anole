import React from 'react'
import logo from '../assets/images/biglogo.png'
import dayjs from 'dayjs'
//import * as esbuild from 'esbuild-wasm/esm/browser.min.js'

const Header = () => {
  // esbuild.initialize({
  //   wasmURL: './esbuild.wasm'
  // }).then(() => {
  //   esbuild.transform(`
  //     const Hello = ({ version }) => {
  //       return (
  //         <div className="hello">{version}</div>
  //       )
  //     }

  //     const App = () => {
  //       return (
  //         <div className="wrap">
  //           <Hello version="1.0.0"></Hello>
  //         </div>
  //       )
  //     }

  //     ReactDOM.render(<App />, document.getElementById('root'));

  //   `, {
  //     loader: 'jsx',
  //     format: 'esm',
  //     //minify: true,
  //     target: 'chrome58'
  //   }).then(res => {
  //     console.log(res.code)
  //   }).catch(e => {
  //     console.log(e)
  //   })
  // })

  return (
    <div className="header">
      <img src={logo}></img>
      <div>aaaa</div>
      {dayjs().format('YYYY-MM-DD HH:mm:ss')}
    </div>
  )
}

export default Header