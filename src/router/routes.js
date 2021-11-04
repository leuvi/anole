import Home from '../views/home'
import About from '../views/about'

const routers = [
  {
    title: '首页',
    key: 'home',
    path: '/',
    component: Home
  },
  {
    title: '关于',
    key: 'about',
    path: '/about',
    component: About
  }
]

export default routers