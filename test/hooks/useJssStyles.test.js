import React from 'react'
import useJssStyles from 'react-storefront/hooks/useJssStyles'
import { mount } from 'enzyme'

describe('useJssStyles', () => {
  it('should remove the ssr style element', () => {
    const styles = document.createElement('style')
    styles.setAttribute('id', 'jss-server-side')
    document.body.appendChild(styles)

    const Test = () => {
      useJssStyles()
      return null
    }

    const wrapper = mount(<Test />)
    expect(wrapper.find('#jss-server-side')).toHaveLength(0)
  })

  it('should do nothing if no ssr styles are present', () => {
    const Test = () => {
      useJssStyles()
      return null
    }
    expect(() => mount(<Test />)).not.toThrowError()
  })
})
