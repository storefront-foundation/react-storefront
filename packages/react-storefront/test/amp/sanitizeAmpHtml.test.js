/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import sanitizeAmpHtml from '../../src/amp/sanitizeAmpHtml'
import $ from 'cheerio'

describe('sanitizeAmpHtml', () => {
  beforeEach(() => {
    global.fns = {
      init$: html => ({ $: $.load(html) })
    }
    
    global.$ = $
  })

  it('should replace attribute values of true with no value', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <amp-accordion expanded="true"></amp-accordion>
        </body>
      </html>
    `))

    expect($.html(html('amp-accordion'))).toEqual(
      '<amp-accordion expanded=""></amp-accordion>'
    )
  })

  it('should remove !important', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <head>
          <style>body { fontWeight: bold !important; }</style>
        </head>
        <body>
        </body>
      </html>
    `))

    expect(html('style').html()).toEqual(
      'body { fontWeight: bold; }'
    )
  })

  it('should replace all img tags with amp-img', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <img src="/foo.png" height="1024" width="768"/>
        </body>
      </html>
    `))

    expect($.html(html('amp-img'))).toEqual(
      '<amp-img layout="intrinsic" src="/foo.png" height="1024" width="768"></amp-img>'
    )
  })

  it('should apply data-amp-* attributes to amp-img', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <img src="/foo.png" data-amp-layout="responsive" data-amp-height="360" data-amp-width="128"/>
        </body>
      </html>
    `))

    expect($.html(html('amp-img'))).toEqual(
      '<amp-img layout="responsive" src="/foo.png" height="360" width="128"></amp-img>'
    )
  })

  it('should apply data-height and data-width to amp-img', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <img src="/foo.png" data-amp-layout="responsive" data-height="360" data-width="128"/>
        </body>
      </html>
    `))

    expect($.html(html('amp-img'))).toEqual(
      '<amp-img layout="responsive" src="/foo.png" height="360" width="128"></amp-img>'
    )
  })

  it('should remove focusable from svg elements', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <svg focusable/>
        </body>
      </html>
    `))

    expect($.html(html('svg'))).toEqual(
      '<svg/>'
    )
  })

  it('should move amp-sidebar into a direct child of the body', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body><div><amp-sidebar/></div></body>
      </html>
    `))

    expect($.html(html('body')).replace(/\s/g, '')).toEqual(
      '<body><div></div><amp-sidebar></amp-sidebar></body>'
    )
  })

  it('should move all inline styles to classes in the main style tag', () => {
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <head></head>
        <body><div style="color:red"></div></body>
      </html>
    `))

    expect($.html(html('div'))).toEqual('<div class="mi0"></div>')
    expect($.html(html('style'))).toEqual('<style amp-custom="">.mi0 {color:red}</style>')
  })

  it('replaces regular iframes to amp-iframe', function(){
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <iframe 
            src="/foo.html" 
            height="3" 
            width="4"
            frameborder="0"/>
        </body>
      </html>
    `))

    expect($.html(html('amp-iframe'))).toEqual(
      '<amp-iframe layout="responsive" src="/foo.html" frameborder="0" width="4" height="3"></amp-iframe>'
    )
  })

  it('loads amp-iframe component', function(){
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <iframe src="/foo.html" />
        </body>
      </html>
    `))

    expect(html('script').attr('src')).toEqual('https://cdn.ampproject.org/v0/amp-iframe-0.1.js')
  })

  it('loads amp-iframe component only once', function(){
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <iframe src="/foo.html" />
          <iframe src="/foo.html" />
        </body>
      </html>
    `))

    expect(html('script')).toHaveLength(1)
  })

  it('replaces Youtube video iframes to amp-youtube', function(){
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <iframe 
            src="https://www.youtube.com/embed/foo" 
            height="3" 
            width="4" />
        </body>
      </html>
    `))

    expect($.html(html('amp-youtube'))).toEqual(
      '<amp-youtube layout="responsive" width="16" height="9" data-videoid="foo"></amp-youtube>'
    )
  })

  it('loads amp-youtube component', function(){
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <iframe src="https://www.youtube.com/embed/foo" />
        </body>
      </html>
    `))

    expect(html('script').attr('src')).toEqual('https://cdn.ampproject.org/v0/amp-youtube-0.1.js')
  })

  it('loads amp-youtube component only once', function(){
    const html = $.load(sanitizeAmpHtml(`
      <html>
        <body>
          <iframe src="https://www.youtube.com/embed/foo" />
          <iframe src="https://www.youtube.com/embed/foo" />
        </body>
      </html>
    `))

    expect(html('script')).toHaveLength(1)
  })

  afterEach(() => {
    delete global.fns
    delete global.$
  })
})

