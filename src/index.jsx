import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './app'
import 'antd/dist/antd.css'
import './assets/less/main.less'



ReactDOM.render (
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
