import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="inner">
      <Header></Header>
      <div className="content">
        {children}
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Layout
