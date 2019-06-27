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
 * Transforms image sources within the given elements to come from the Moovweb Image Optimizer
 * @param {Array} elements     Cheerio elements
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized HTML
 */
export default async function optimizeImages(elements, options = defaultOptions) {
  const { preventLayoutInstability, ...transformationOptions } = options
  elements.each(async function(index, el) {
    const $img = $(el)
    const src = $img.attr('src')
    $img.attr('src', transformSource(src, transformationOptions))
    if (preventLayoutInstability) {
      const url = `https://${imageService}/size?url=${encodeURIComponent(src)}`
      try {
        console.log('Fetching', url)
        const { width, height } = await fetch(url).then(res => res.json())
        console.log(width, height)
        $img.attr('width', width)
        $img.attr('height', height)
      } catch (e) {
        console.log('Could not preventLayoutInstability', e)
      }
    }
  })
}
