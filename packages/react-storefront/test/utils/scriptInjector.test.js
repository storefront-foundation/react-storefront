/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { injectScriptInHead, injectCodeInHead, removeScriptInHead, removeCodeInHead } from '../../src/utils/scriptInjector'

describe('injectScriptInHead', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  })

  it('should inject script', () => {
    const src = 'https://test.com/script.js'
    injectScriptInHead(src)
    expect(document.head.innerHTML).toEqual(`<script src="${src}"></script>`)
  })

  it('should inject script with given props', () => {
    const src = 'https://test.com/props.js'
    injectScriptInHead(src, {
      attrs: { 'data-type': 'test' }
    })
    expect(document.head.innerHTML).toEqual(`<script src="${src}" data-type="test"></script>`)
  })

  it('should inject script only once', () => {
    const src = 'https://test.com/once.js'
    injectScriptInHead(src)
    injectScriptInHead(src)
    expect(document.head.innerHTML).toEqual(`<script src="${src}"></script>`)
  })

  it('should inject script twice', () => {
    const src = 'https://test.com/once.js'
    injectScriptInHead(src, { once: false })
    injectScriptInHead(src, { once: false })
    expect(document.head.innerHTML).toEqual(`<script src="${src}"></script><script src="${src}"></script>`)
  })

  it('should inject script with promise result', done => {
    const src = 'https://test.com/promise.js'

    injectScriptInHead(src)
      .then(() => {
        expect(document.head.innerHTML).toEqual(`<script src="${src}"></script>`)
        done()
      })
    document.head.querySelector(`script[src^='${src}']`).onload()
  })

  it('should inject script with promise result only once', done => {
    const src = 'https://test.com/promise-once.js'

    injectScriptInHead(src)

    injectScriptInHead(src)
      .then(() => {
        expect(document.head.innerHTML).toEqual(`<script src="${src}"></script>`)
        done()
      })
  })
})

describe('injectCodeInHead', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('should inject script', () => {
    const script = 'var a = "script";'
    injectCodeInHead(script)
    expect(document.head.innerHTML).toEqual(`<script>${script}</script>`)
  })

  it('should inject script only once', () => {
    const script = 'var a = "once";'
    injectCodeInHead(script)
    injectCodeInHead(script)
    expect(document.head.innerHTML).toEqual(`<script>${script}</script>`)
  })

  it('should inject script twice', () => {
    const script = 'var a = "once";'
    injectCodeInHead(script, { once: false })
    injectCodeInHead(script, { once: false })
    expect(document.head.innerHTML).toEqual(`<script>${script}</script><script>${script}</script>`)
  })
})

describe('removeScriptInHead', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  })

  it('should insert and remove script', () => {
    const src = 'https://test.com/script.js'
    injectScriptInHead(src)
    expect(document.head.innerHTML).toEqual(`<script src="${src}"></script>`)
    removeScriptInHead(src)
    expect(document.head.innerHTML).toEqual('')
  })
})

describe('removeCodeInHead', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('should inject and remove script', () => {
    const script = 'var a = "script";'
    injectCodeInHead(script)
    expect(document.head.innerHTML).toEqual(`<script>${script}</script>`)
    removeCodeInHead(script)
    expect(document.head.innerHTML).toEqual('')
  })
})