/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import TestProvider from './TestProvider'
import ErrorBoundary from '../src/ErrorBoundary'
import AppModelBase from '../src/model/AppModelBase'

describe('ErrorBoundary', () => {
  let errorReporter, error, app

  beforeEach(() => {
    app = AppModelBase.create({})
    errorReporter = jest.fn()
    error = new Error()
  })

  it('should report errors during rendering', () => {
    let thrown = false

    const ThrowError = () => {
      if (thrown) {
        return <div />
      } else {
        thrown = true
        throw error
      }
    }

    mount(
      <TestProvider app={app}>
        <ErrorBoundary onError={errorReporter}>
          <ThrowError />
        </ErrorBoundary>
      </TestProvider>
    )

    expect(app.page).toBe('Error')
    expect(app.error).toBe(error.message)
    expect(app.stack).not.toBeNull()
    expect(errorReporter).toHaveBeenCalledWith({ error, history: expect.anything(), app })
  })
})
