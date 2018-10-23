/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import { configureAnalytics } from '../src/analytics'
import waitForAnalytics from './helpers/waitForAnalytics'
import Track, { renderAmpAnalyticsTags, resetId } from '../src/Track'
import TestProvider from './TestProvider'

describe('Track', () => {

  beforeEach(() => {
    resetId()
  })

  it('should fire the configured event when clicked', () => {
    const testEvent = jest.fn()

    configureAnalytics({ testEvent })

    mount(
      <TestProvider>
        <Track event="testEvent" foo="bar">
          <button>Click Me</button>
        </Track>
      </TestProvider>
    )
      .find('button')
      .simulate('click')

    return waitForAnalytics(() => {
      expect(testEvent).toHaveBeenCalledWith({ foo: 'bar' })
    })
  })

  it('should call the onSuccess prop after the event has been sent', (done) => {
    const testEvent = jest.fn()
    const onSuccess = jest.fn()

    configureAnalytics({ testEvent })

    mount(
      <TestProvider>
        <Track event="testEvent" foo="bar" onSuccess={onSuccess}>
          <button>Click Me</button>
        </Track>
      </TestProvider>
    )
      .find('button')
      .simulate('click')

    setTimeout(() => {
      expect(onSuccess).toHaveBeenCalled()
      done()
    }, 200)
  })
  
  it('calls the original handler prop', () => {
    const testEvent = jest.fn(), onClick = jest.fn()

    configureAnalytics({ testEvent })

    mount(
      <TestProvider>
        <Track event="testEvent" foo="bar">
          <button onClick={onClick}>Click Me</button>
        </Track>
      </TestProvider>
    )
      .find('button')
      .simulate('click')

    expect(onClick).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should create AMP triggers', () => {
    configureAnalytics({
      testEvent() {},
      getAmpAnalyticsType() {
        return "test"
      },
      getPropsForAmpAnalytics() {
        return {
          request: 'event',
          vars: {
            eventCategory: 'search',
            eventAction: 'click'
          }
        }
      }
    })

    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <Track event="testEvent" foo="bar">
          <button>Click Me</button>
        </Track>
      </TestProvider>
    )

    // check the amp trigger
    expect(renderAmpAnalyticsTags()).toEqual(
      '<amp-analytics type="test">' +
        '<script type="application/json">' +
          '{"triggers":[{"on":"click","selector":"[data-amp-id=\\"0\\"]","request":"event","vars":{"eventCategory":"search","eventAction":"click"}}]}' +
        '</script>' +
      '</amp-analytics>'
    )

    // make sure it adds the data-amp-id to the wrapped element
    expect(wrapper.find('button[data-amp-id="0"]').length).toBe(1)
  })
})