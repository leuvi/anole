import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import store from './store'
import App from './app'
import 'antd/dist/antd.css'
import './assets/less/main.less'



ReactDOM.render (
  <Provider {...store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
