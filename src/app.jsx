import React from 'react'
import { Switch, Route } from 'react-router-dom'
import routes from './router/routes'
import Layout from './components/ui/Layout'

const App = () => {
  return (
    <div className="wrap">
      <Layout>
        <Switch>
          {routes.map(route => {
            return (
              <Route exact={route.path === '/' ? true : false} key={route.key} path={route.path} component={route.component}></Route>
            )
          })}
        </Switch>
      </Layout>
    </div>
  )
}

export default App