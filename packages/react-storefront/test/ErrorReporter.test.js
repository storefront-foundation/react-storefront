/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'
import ErrorReporter from '../src/ErrorReporter'


describe('ErrorReporter', () => {
  let app
  const error = new Error('test error')

  const onError = jest.fn((params) => {
    expect(params.error).toEqual(error.message)
    expect(params.stack).toEqual(error.stack)
  })

  beforeEach(() => {
    app = AppModelBase.create({ amp: false, loading: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle app state changes', () => {
    mount(
      <Provider app={app}>
        <ErrorReporter onError={onError} />
      </Provider>
    )

    app.onError(error)

    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should ignore the error if it\'s the same as previous', () => {
    mount(
      <Provider app={app}>
        <ErrorReporter onError={onError} />
      </Provider>
    )

    for (let i = 0; i < 5; i++) {
      app.onError(error)
    }

    expect(onError).toHaveBeenCalledTimes(1)
  })
})
