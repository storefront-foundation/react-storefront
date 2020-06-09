import React, { Component } from 'react'
import { mount } from 'enzyme'

describe('NextScriptDeferred', () => {
  let NextScript

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.doMock('next/document', () => ({
        NextScript: class OriginalNextScript extends Component {
          getScripts() {
            return [<script src="foo.js" async />]
          }

          render() {
            return <>{this.getScripts()}</>
          }
        },
      }))

      NextScript = require('react-storefront/NextScript').default
    })
  })

  it('should remove async and add defer to all script tags returned from super.getScripts', () => {
    const wrapper = mount(<NextScript mode="defer" />)
    const scriptProps = wrapper.find('script').props()
    expect(scriptProps.async).toBe(undefined)
    expect(scriptProps.defer).toBe(true)
  })

  it('should use async by default', () => {
    const wrapper = mount(<NextScript />)
    const scriptProps = wrapper.find('script').props()
    expect(scriptProps.async).toBe(true)
    expect(scriptProps.defer).toBe(undefined)
  })
})
