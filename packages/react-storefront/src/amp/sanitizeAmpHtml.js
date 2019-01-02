
import { once } from 'lodash'

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
export default function sanitizeAmpHtml(html) {
  let styleId = 0
  const styles = []
  const { fns } = global
  const dom = fns.init$(html)
  const { $ } = global // note this must be after fns.init$(), which ensures that $ is exported globally
  const includeYoutubeAmpComponent = once(function(){
    dom.$('head').append('<script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>')
  })
  const includeIframeAmpComponent = once(function(){
    dom.$('head').append('<script async custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>')
  })
  
  // Provide support for amp bind expressions on custom amp tags
  // React removes attributes like [selected]="selectedTab" and throws a warning, but allows attributes without brackets,
  // So we use amp-bind="selected:selectedTab" instead.
  // Example: <amp-selector amp-bind="selected:selectedTab,foo:bar"> => <amp-selector [selected]="selectedTab" [foo]="bar">
  dom.$('*[amp-bind]').each((i, el) => {
    const $el = $(el)
    const expressions = $el.attr("amp-bind").split(/,\s*/)

    for (let expression of expressions) {
      const [name, value] = expression.split('=>')
      $el.attr(`[${name}]`, value)
    }
    
    $el.removeAttr('amp-bind')
  })

  // replace attr="true" with attr
  dom.$('*').each((i, el) => {
    const $el = $(el)
    for (let name in el.attribs) {
      const value = el.attribs[name]
      if (value === "true") {
        $el.attr(name, '')
      }
    }
  })

  // consolidate all style tags in the header into one
  dom.$('style:not([amp-boilerplate])').each((i, style) => {
    const $style = $(style)
    styles.push($style.html().replace(/\s*!important\s*/g, '')) // amp doesn't allow !important
    $style.remove()
  })

  dom.$('img').each((i, img) => {
    const $img = $(img)
    const $ampImg = $('<amp-img layout="intrinsic"></amp-img>')

    if ($img.attr('src')) $ampImg.attr('src', $img.attr('src'))
    if ($img.attr('alt')) $ampImg.attr('alt', $img.attr('alt'))
    if ($img.attr('height')) $ampImg.attr('height', $img.attr('height'))
    if ($img.attr('width')) $ampImg.attr('width', $img.attr('width'))
    if ($img.attr('data-height')) $ampImg.attr('height', $img.attr('data-height'))
    if ($img.attr('data-width')) $ampImg.attr('width', $img.attr('data-width'))

    for (let name in img.attribs) {
      if (name.startsWith('data-amp-')) {
        $ampImg.attr(name.replace(/^data-amp-/, ''), img.attribs[name])
      }
    }

    $img.replaceWith($ampImg)
  })

  dom.$('iframe').each((index, iframe) => {
    const $iframe = $(iframe)
    const src = $iframe.attr('src')
    const height = $iframe.attr('height')
    const width = $iframe.attr('width')
    const frameborder = $iframe.attr('frameborder')
    let $ampIframe
    const fromYoutube = /\byoutube\b/.test(src)
    
    if (fromYoutube) {
      const videoId = src.substr(src.lastIndexOf('/') + 1)
      $ampIframe = $('<amp-youtube layout="responsive"></amp-youtube>')

      if (width) $ampIframe.attr('width', 16)
      if (height) $ampIframe.attr('height', 9)
      $ampIframe.attr('data-videoid', videoId)
      includeYoutubeAmpComponent()
    }
    else {
      $ampIframe = $('<amp-iframe layout="responsive"></amp-iframe>')

      if (src) $ampIframe.attr('src', src)
      if (frameborder) $ampIframe.attr('frameborder', frameborder)
      if (height) $ampIframe.attr('height', height)
      if (width) $ampIframe.attr('width', width)
      includeIframeAmpComponent()
    }

    $iframe.replaceWith($ampIframe)
  })

  // remove focusable attribute on all svg elements
  dom.$('svg[focusable]').removeAttr('focusable')
  dom.$('svg[xlink]').removeAttr('xlink')
  
  // material-ui puts this on tab underlines
  dom.$('div[direction]').removeAttr('direction')

  // move amp-sidebar into direct child of body
  const sidebar = dom.$('amp-sidebar').get()
  if (sidebar) {
    $(sidebar).remove()
    dom.$('body').append(sidebar)
  }
  
  // move all inline styles to classes in the main style tag
  dom.$('*[style]').each((i, el) => {
    const $el = $(el)
    const className = `mi${styleId++}`
    styles.push(`.${className} {${$el.attr('style')}}`)
    $el.removeAttr('style')
    $el.addClass(className)
  })

  // write the single style tag
  dom.$('head').append(`<style amp-custom>${styles.join('\n')}</style>`)

  return dom.$.html()
} 