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
import AnalyticsProvider from '../src/AnalyticsProvider'

describe('Track', () => {
  beforeEach(() => {
    resetId()
  })

  it('should support no children', () => {
    expect(
      mount(
        <TestProvider>
          <Track event="testEvent" foo="bar" />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should fire the configured event when clicked', () => {
    const testEvent = jest.fn()

    mount(
      <TestProvider>
        <AnalyticsProvider targets={() => [{ testEvent }]}>
          <Track event="testEvent" foo="bar">
            <button>Click Me</button>
          </Track>
        </AnalyticsProvider>
      </TestProvider>
    )
      .find('button')
      .simulate('click')

    return waitForAnalytics(() => {
      expect(testEvent).toHaveBeenCalledWith({ foo: 'bar', metadata: expect.anything() })
    })
  })

  it('should call the onSuccess prop after the event has been sent', done => {
    const testEvent = jest.fn()
    const onSuccess = jest.fn()

    mount(
      <TestProvider>
        <AnalyticsProvider targets={() => [{ testEvent }]}>
          <Track event="testEvent" foo="bar" onSuccess={onSuccess}>
            <button>Click Me</button>
          </Track>
        </AnalyticsProvider>
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
    const testEvent = jest.fn(),
      onClick = jest.fn()

    mount(
      <TestProvider>
        <AnalyticsProvider targets={() => [{ testEvent }]}>
          <Track event="testEvent" foo="bar">
            <button onClick={onClick}>Click Me</button>
          </Track>
        </AnalyticsProvider>
      </TestProvider>
    )
      .find('button')
      .simulate('click')

    expect(onClick).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should create AMP triggers', () => {
    const targets = () => [
      {
        testEvent(data) {
          this.send(data)
        },
        send() {},
        getAmpAnalyticsType() {
          return 'test'
        }
      }
    ]

    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <AnalyticsProvider targets={targets}>
          <Track event="testEvent" foo="bar">
            <button>Click Me</button>
          </Track>
        </AnalyticsProvider>
      </TestProvider>
    )

    // check the amp trigger
    expect(renderAmpAnalyticsTags({})).toEqual(
      '<amp-analytics type="test">' +
        '<script type="application/json">' +
        '{"triggers":[{"on":"click","foo":"bar","ampData":{},"selector":"[data-amp-id=\\"0\\"]","request":"event"}]}' +
        '</script>' +
        '</amp-analytics>'
    )

    // make sure it adds the data-amp-id to the wrapped element
    expect(wrapper.find('button[data-amp-id="0"]').length).toBe(1)
  })

  it('should include the result of getAmpAnalyticsData()', () => {
    const targets = () => [
      {
        testEvent(data) {
          this.send(data)
        },
        send() {},
        getAmpAnalyticsType() {
          return 'test'
        },
        getAmpAnalyticsData() {
          return { title: 'React Storefront Home' }
        }
      }
    ]

    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <AnalyticsProvider targets={targets}>
          <Track event="testEvent" foo="bar">
            <button>Click Me</button>
          </Track>
        </AnalyticsProvider>
      </TestProvider>
    )

    // check the amp trigger
    expect(renderAmpAnalyticsTags({})).toEqual(
      '<amp-analytics type="test">' +
        '<script type="application/json">' +
        '{"triggers":[{"on":"click","foo":"bar","ampData":{},"selector":"[data-amp-id=\\"0\\"]","request":"event"}],"title":"React Storefront Home"}' +
        '</script>' +
        '</amp-analytics>'
    )
  })

  it('should support multiple triggers', () => {
    const click = jest.fn(),
      focus = jest.fn()

    const targets = () => [{ click, focus }]

    mount(
      <TestProvider>
        <AnalyticsProvider targets={targets}>
          <Track trigger={{ onClick: 'click', onFocus: 'focus' }} foo="bar">
            <button>Click Me</button>
          </Track>
        </AnalyticsProvider>
      </TestProvider>
    )
      .find('button')
      .simulate('click')
      .simulate('focus')

    return waitForAnalytics(() => {
      expect(click).toHaveBeenCalledWith(expect.any(Object))
      expect(focus).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  it('should add GTM attributes for AMP', () => {
    const targets = () => [
      {
        testEvent(data) {
          this.send(data)
        },
        send() {},
        apiKey: 'GTM-testme',
        getAmpAnalyticsType() {
          return 'gtm'
        },
        getAmpAnalyticsAttributes() {
          return {
            config: `https://www.googletagmanager.com/amp.json?id=${this.apiKey}`,
            'data-credentials': 'include',
            test: '<< escaping "html" >>'
          }
        }
      }
    ]

    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <AnalyticsProvider targets={targets}>
          <Track event="testEvent" foo="bar">
            <button>Click Me</button>
          </Track>
        </AnalyticsProvider>
      </TestProvider>
    )

    expect(renderAmpAnalyticsTags({})).toEqual(
      '<amp-analytics config="https://www.googletagmanager.com/amp.json?id=GTM-testme" data-credentials="include" test="&lt;&lt; escaping &quot;html&quot; &gt;&gt;">' +
        '<script type="application/json">' +
        '{"triggers":[{"on":"click","foo":"bar","ampData":{},"selector":"[data-amp-id=\\"0\\"]","request":"event"}]}' +
        '</script>' +
        '</amp-analytics>'
    )
  })
})
