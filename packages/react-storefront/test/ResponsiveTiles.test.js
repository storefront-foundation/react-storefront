/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import ResponsiveTiles from '../src/ResponsiveTiles'
import { mount } from 'enzyme'

describe('ResponsiveTiles', () => {
  it('should render', () => {
    expect(mount(
      <ResponsiveTiles>
        <div>Tile 1</div>
        <div>Tile 2</div>
        <div>Tile 3</div>
        <div>Tile 4</div>
      </ResponsiveTiles>
    )).toMatchSnapshot()
  })
  it('should skip invalid elements', () => {
    expect(mount(
      <ResponsiveTiles>
        <div>Tile 1</div>
        Foo
        <div>Tile 3</div>
        <div>Tile 4</div>
      </ResponsiveTiles>
    )).toMatchSnapshot()
  })
})