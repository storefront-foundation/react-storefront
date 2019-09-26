/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { createMemoryHistory } from 'history'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'
import createTheme from '../src/createTheme'
import { MuiThemeProvider } from '@material-ui/core'
import { Router } from '../src/router'

let id = 0
const nextId = () => id++

export default function TestProvider({ app, history, children, ...stores }) {
  if (app == null || !app.applyState) {
    app = AppModelBase.create({
      location: {
        pathname: '/',
        search: '',
        hostname: 'localhost'
      },
      ...app
    })
  }

  const initialEntries = []

  if (app.location) {
    initialEntries.push(app.location.pathname + app.location.search)
  } else {
    initialEntries.push('/')
  }

  history = history || createMemoryHistory({ initialEntries })

  const theme = createTheme({
    typography: {
      useNextVariants: true
    }
  })

  return (
    <Provider router={new Router()} app={app} history={history} nextId={nextId} {...stores}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </Provider>
  )
}
