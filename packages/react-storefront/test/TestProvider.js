/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { createMemoryHistory } from 'history'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'

export default function TestProvider({ app, children }) {
  app = AppModelBase.create({
    location: {
      pathname: '/',
      search: '',
      hostname: 'localhost'
    },
    ...app
  })

  return (
    <Provider 
      router={{}} 
      app={app}
      history={createMemoryHistory({ initialEntries: [app.location.pathname + app.location.search] })}
    >
      {children}
    </Provider>
  )
}