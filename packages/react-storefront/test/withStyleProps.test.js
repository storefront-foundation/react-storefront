/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyleProps from '../src/withStyleProps'
import { mount } from 'enzyme'

describe('withStyleProps', () => {

  @withStyleProps(({ height, theme }) => ({
    root: {
      height: `${height}px`
    }
  }))
  class Test extends Component {
    render() {
      const { classes } = this.props
      return <div className={classes.root}>test</div>
    }
  }

  it('should provide props to withStyles', () => {
    const wrapper = mount(
      <Test height={50}/>
    )

    expect(document.documentElement.innerHTML.replace(/\s/g, '').includes(`
      <style type="text/css" data-jss="" data-meta="Test">
        .Test-root-1 {
          height: 50px;
        }
      </style>
    `.replace(/\s/g, ''))).toBe(true)

    expect(wrapper).toMatchSnapshot()
  })

})