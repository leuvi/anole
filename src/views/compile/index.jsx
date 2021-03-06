import React, { useEffect, useState, useContext, useRef } from 'react'
import { Collapse, Radio, Switch, Button, Input, message } from 'antd'
import { observer, MobXProviderContext } from 'mobx-react'
import debounce from 'lodash/debounce'
import clsx from 'clsx'
import './index.less'

const { Panel } = Collapse
const { Group } = Radio
const { TextArea } = Input

const CompileBox = () => {
  const { wasm, build } = useContext(MobXProviderContext)
  const [format, setFormat] = useState('iife')
  const [target, setTarget] = useState('es2015')
  const [loader, setLoader] = useState('js')
  const [jsx, setJsx] = useState('preserve')
  const [minify, setMinify] = useState(false)
  const [targetCode, setTargetCode] = useState('')
  const [catchError, setCatchError] = useState(false)
  const [codes, setCodes] = useState('')
  const textAreaElem = useRef(null)

  const formatOptions = ['iife', 'cjs', 'esm'].map(e => ({ label: e, value: e }))
  const targetOptions = ['es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'esnext'].map(e => ({ label: e, value: e }))
  const loaderOptions = ['js', 'ts', 'jsx'].map(e => ({ label: e, value: e }))
  const jsxOptions = ['preserve', 'factory', 'fragment'].map(e => ({ label: e, value: e }))
  const jsxConfig = {
    preserve: {
      jsx: 'preserve'
    },
    factory: {
      jsxFactory: 'h'
    },
    fragment: {
      jsxFragment: 'Fragment'
    }
  }

  const formatHanlder = (e) => {
    setFormat(e.target.value)
  }

  const targetHanlder = (e) => {
    setTarget(e.target.value)
  }

  const loaderHanlder = (e) => {
    setLoader(e.target.value)
  }

  const jsxHanlder = (e) => {
    setJsx(e.target.value)
  }

  const minifyHandler = (checked) => {
    setMinify(checked)
  }

  const textareaChange = event => {
    if(!event.target.value) {
      setTargetCode('')
      setCatchError(false)
    }
    setCodes(event.target.value)
  }

  const compileHandler = debounce((event) => {
    if(!codes) {
      return message.warn('????????????????????????')
    }
    wasm.then(() => {
      build.transform(`${codes}`, Object.assign({}, {
        loader,
        format,
        target,
        minify,
      }, loader === 'jsx' ? jsxConfig[jsx]: {})).then(res => {
        setTargetCode(res.code)
        setCatchError(false)
      }).catch(e => {
        setTargetCode(JSON.stringify(e.errors[0]?.text))
        setCatchError(true)
      })
    })
  }, 500)

  useEffect(() => {
    textAreaElem.current.focus()
  }, [])

  return (
    <div className="compilebox">
      <div className="aside">
        <div className="hd">????????????</div>
        <Collapse defaultActiveKey={['format', 'target', 'loader', 'minify']} ghost>
          <Panel header="????????????" key="format">
            <Group
              options={formatOptions}
              onChange={formatHanlder}
              value={format}
              optionType="button"
            />
          </Panel>
          <Panel header="????????????" key="target">
            <Group
              options={targetOptions}
              onChange={targetHanlder}
              value={target}
              optionType="button"
            />
          </Panel>
          <Panel header="?????????" key="loader">
            <Group
              options={loaderOptions}
              onChange={loaderHanlder}
              value={loader}
              optionType="button"
            />
            {
              loader === 'jsx' 
              ? 
              <Group
                options={jsxOptions}
                onChange={jsxHanlder}
                value={jsx}
                optionType="button"
              /> : null
            }
          </Panel>
          <Panel header="????????????" key="minify">
            <Switch 
              checkedChildren="??????????????????" 
              unCheckedChildren="??????????????????" 
              defaultChecked={false}
              onChange={minifyHandler}
            />
          </Panel>
        </Collapse>
      </div>
      <div className="inputbox">
        <div className="hd">
          <Button onClick={compileHandler} size="small">??????</Button>
        </div>
        <div className="bd">
          <TextArea 
            ref={textAreaElem}
            bordered={false}
            autoSize={{ minRows: 30 }}
            onChange={textareaChange}
          >  
          </TextArea>
        </div>
      </div>
      <div className="outputbox">
        <div className="hd">
          ????????????
        </div>
        <div className={clsx('bd', catchError ? 'error' : '')}>
          {targetCode}
        </div>
      </div>
    </div>
  )
}

export default CompileBox