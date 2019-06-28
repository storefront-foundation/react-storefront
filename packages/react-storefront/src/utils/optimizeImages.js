/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import $ from 'cheerio'
import fetch from 'cross-fetch'
import qs from 'qs'

const imageService = 'image.moovweb.net'
const defaultOptions = { quality: 75, preventLayoutInstability: false }

/**
 * Transforms source to come from the Moovweb Image Optimizer
 * @param {String} img         Image source URL
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized image URL
 */
function transformSource(img, options) {
  const query = qs.stringify({ ...options, img })
  return `https://opt.moovweb.net/?${query}`
}

/**
 * Creates a promise which fetches the image size as json
 * @param {String} src URL to image
 */
function getSize(src) {
  const url = `https://${imageService}/size?url=${encodeURIComponent(src)}`
  return fetch(url).then(res => res.json())
}

/**
 * Transforms image sources within the given elements to come from the Moovweb Image Optimizer
 * @param {Array} elements     Cheerio elements
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized HTML
 */
export default async function optimizeImages(elements, options = defaultOptions) {
  const { preventLayoutInstability, ...transformationOptions } = options

  const sources = []
  let sizes

  elements.each(function() {
    sources.push($(this).attr('src'))
  })

  if (preventLayoutInstability) {
    sizes = await Promise.all(sources.map(getSize))
  }

  elements.each(function(index, el) {
    const $img = $(el)
    const src = $img.attr('src')
    $img.attr('src', transformSource(src, transformationOptions))
    if (preventLayoutInstability) {
      const { width, height } = sizes[index]
      $img.attr('width', width)
      $img.attr('height', height)
    }
  })
}
