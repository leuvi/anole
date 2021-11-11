import React from 'react'
import { Collapse } from 'antd'
import './index.less'

const { Panel } = Collapse

const CompileBox = () => {
  return (
    <div className="compilebox">
      <div className="aside">
        <Collapse defaultActiveKey={['1', '2', '3']} ghost>
          <Panel header="ECMAScript版本" key="1">
            <p>1</p>
          </Panel>
          <Panel header="This is panel header 2" key="2">
            <p>2</p>
          </Panel>
          <Panel header="This is panel header 3" key="3">
            <p>3</p>
          </Panel>
        </Collapse>
      </div>
      <div className="inputbox">
        2
      </div>
      <div className="outputbox">
        3
      </div>
    </div>
  )
}

export default CompileBox