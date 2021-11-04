import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <div className="header">
      <div className="bd">
        <div className="logo"></div>
        <div className="nav">
          <ul>
            <li>
              <NavLink exact to="/">首页</NavLink>
            </li>
            <li>
              <NavLink to="/about">关于</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header