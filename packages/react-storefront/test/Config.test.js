/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Config from '../src/Config'

describe('Config', () => {
  it('should load a json blob', () => {
    Config.load(
      JSON.stringify({
        foo: 'bar'
      })
    )
    expect(Config.get('foo')).toEqual('bar')
  })

  it('should load an object', () => {
    Config.load({ foo: 'bar' })
    expect(Config.get('foo')).toEqual('bar')
  })

  it('should overwrite all existing values', () => {
    Config.load({ foo: 'bar' })
    Config.load({ beep: 'boop' })
    expect(Config.get('beep')).toEqual('boop')
    expect(Config.get('foo')).not.toBeDefined()
  })
})