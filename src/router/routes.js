import Home from '../views/home'
import Compile from '../views/compile'
import About from '../views/about'
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
    title: '404',
    key: 'error',
    path: '*',
    component: ErrorComponent
  }
]

export default routers