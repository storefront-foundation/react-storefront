import React, { Component } from 'react'
import { mount } from 'enzyme'

describe('NextScriptDeferred', () => {
  let NextScriptDeferred

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.doMock('next/document', () => ({
        NextScript: class NextScript extends Component {
          getScripts() {
            return [<script src="foo.js" async />]
          }

          render() {
            return <>{this.getScripts()}</>
          }
        },
      }))

      NextScriptDeferred = require('react-storefront/NextScriptDeferred').default
    })
  })

  it('should remove async and add defer to all script tags returned from super.getScripts', () => {
    const wrapper = mount(<NextScriptDeferred />)
    const scriptProps = wrapper.find('script').props()
    expect(scriptProps.async).not.toBeDefined()
    expect(scriptProps.defer).toBe(true)
  })
})
