import Home from '../views/home'
import Compile from '../views/compile'
import About from '../views/about'
import D3 from '../views/d3'
import ErrorComponent from '../views/404'

const routers = [
  {
    title: '首页',
    key: 'home',
    path: '/',
    component: Home
  },
  {
    title: '试一试',
    key: 'compile',
    path: '/compile',
    component: Compile
  },
  {
    title: '关于',
    key: 'about',
    path: '/about',
    component: About
  },
  {
    title: 'D3',
    key: 'd3',
    path: '/d3',
    component: D3
  },
  {
    title: '404',
    key: 'error',
    path: '*',
    component: ErrorComponent
  }
]

export default routers