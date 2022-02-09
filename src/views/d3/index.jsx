import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import './index.less'

const D3Page = () => {
  const init = () => {
    const width = 600, height = 400
    const svg = d3.select('#d3box').append('svg')
    svg.attr('width', width).attr('height', height).attr('viewbox', `0 0 ${width} ${height}`)
    const margin = {l: 60, t: 60, r: 60, b: 60}


    const dataset = [2.5, 1.1, 3.8, 0.4, 1.9]

  }

  
  useEffect(() => {
    init()
  }, [])
  return (
    <div className="dpage" style={{height: 600}}>
      <div id="d3box">
        
      </div>
    </div>
  )
}

export default D3Page