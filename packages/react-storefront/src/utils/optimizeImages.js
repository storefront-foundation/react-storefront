/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import $ from 'cheerio'
import qs from 'qs'

/**
 * Transforms source to come from the Moovweb Image Optimizer
 * @param {String} img         Image source URL
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized image URL
 */
function transformSource(img, options = { quality: 75 }) {
  const query = qs.stringify({ ...options, img })
  return `https://opt.moovweb.net/?${query}`
}

/**
 * Transforms image sources within the given elements to come from the Moovweb Image Optimizer
 * @param {Array} elements     Cheerio elements
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized HTML
 */
export default function optimizeImages(elements, options) {
  elements.each(function() {
    const $img = $(this)
    $img.attr('src', transformSource($img.attr('src'), options))
  })
}
