import React, { useEffect, useState, useContext, useRef } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { Input } from 'antd'
import './index.less'

const { TextArea } = Input

const Home = () => {
  const { wasm, build } = useContext(MobXProviderContext)
  const [targetCode, setTargetCode] = useState('')
  const textAreaElem = useRef(null)

  const textareaChange = (event) => {
    if(!event.target.value) {
      setTargetCode('')
    }
  }

  const textareaHandle = (event) => {
    wasm.then(() => {
      build.transform(`${event.target.value}`, {
        loader: 'js',
        format: 'esm',
        target: 'chrome58'
      }).then(res => {
        setTargetCode(res.code)
      }).catch(e => {
        setTargetCode(JSON.stringify(e.errors[0]?.text))
      })
    })
  }

  useEffect(() => {
    textAreaElem.current.focus()
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
                  onPressEnter={textareaHandle}
                  onChange={textareaChange}
                >  
                </TextArea>
              </div>
            </div>
            <div className="output">
              <div className="hd">
                <h4>输出</h4>
              </div>
              <div className="bd">
                {targetCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(Home)
