import React, { useEffect, useState, useContext, useRef } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { Input } from 'antd'
import debounce from 'lodash/debounce'
import clsx from 'clsx'
import waveEffect from './module/wave'
import './index.less'

const { TextArea } = Input

const Home = () => {
  const { wasm, build } = useContext(MobXProviderContext)
  const [targetCode, setTargetCode] = useState('')
  const [catchError, setCatchError] = useState(false)
  const textAreaElem = useRef(null)

  const textareaChange = debounce((event) => {
    if(!event.target.value) {
      setTargetCode('')
      setCatchError(false)
      return
    }
    wasm.then(() => {
      build.transform(`${event.target.value}`, {
        loader: 'js',
        format: 'esm',
        target: 'chrome58'
      }).then(res => {
        setTargetCode(res.code)
        setCatchError(false)
      }).catch(e => {
        setTargetCode(JSON.stringify(e.errors[0]?.text))
        setCatchError(true)
      })
    })
  }, 500)

  const textareaHandle = (event) => {
    
  }

  useEffect(() => {
    textAreaElem.current.focus()
    waveEffect('.wave')
  }, [])
  
  return (
    <div className="home">
      <div className="banner">
        <div className="bannermask">
          <h2>在线 JavaScript 编译器</h2>
          <h3>开始吧！</h3>
          <div className="compiler">
            <div className="input">
              <div className="hd">
                <h4>输入</h4>
              </div>
              <div className="bd">
                <TextArea 
                  ref={textAreaElem}
                  bordered={false}
                  autoSize={{ minRows: 8 }}
                  onChange={textareaChange}
                >  
                </TextArea>
              </div>
            </div>
            <div className="output">
              <div className="hd">
                <h4>输出</h4>
              </div>
              <div className={clsx('bd', catchError ? 'error' : '')}>
                {targetCode}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="wave">
          <canvas className="flip"></canvas>
        </div>
      </div>
    </div>
  )
}

export default observer(Home)
