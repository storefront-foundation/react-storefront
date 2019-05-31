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

  it('should report errors throw by event handlers', done => {
    const wrapper = mount(
      <TestProvider app={app}>
        <ErrorBoundary onError={errorReporter}>
          <button
            onClick={() => {
              throw error
            }}
          >
            Test
          </button>
        </ErrorBoundary>
      </TestProvider>
    )

    expect(() => {
      setImmediate(() => {
        expect(errorReporter).toHaveBeenCalledWith({ error, history: expect.anything(), app })
        done()
      })
      wrapper.find('button').simulate('click')
    }).toThrowError()
  })

  it('should report errors throw by event handlers', () => {
    const wrapper = mount(
      <TestProvider app={app}>
        <ErrorBoundary onError={errorReporter}>
          <button
            onClick={() => {
              // sadly we can't just Promise.reject(error) here because jest/enzyme/JSDOM won't dispatch a unhandledrejection event on the window automatically
              const event = new CustomEvent('unhandledrejection')
              event.reason = error
              window.dispatchEvent(event)
            }}
          >
            Test
          </button>
        </ErrorBoundary>
      </TestProvider>
    )

    wrapper.find('button').simulate('click')

    expect(errorReporter).toHaveBeenCalledWith({ error, history: expect.anything(), app })
  })
})
