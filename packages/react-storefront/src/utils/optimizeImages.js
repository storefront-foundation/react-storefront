/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import cheerio from 'cheerio'
import qs from 'qs'

/**
 * Transforms image source to come from the Moovweb Image Optimizer
 * @param {String} img         Image source URL
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized image URL
 */
function transformSource(img, options = { quality: 75 }) {
  const query = qs.stringify({ ...options, img })
  return `https://opt.moovweb.net/?${query}`
}

/**
 * Transforms images within the given HTML to come from the Moovweb Image Optimizer
 * @param {String} html        Input HTML
 * @param {Object} options     Transformation options
 * @returns {String}           Optimized HTML
 */
export default function optimizeImages(html, options) {
  const $ = cheerio.load(html)

  $('img').each(function() {
    const $img = $(this)
    $img.attr('src', transformSource($img.attr('src'), options))
  })

  return $.html({ decodeEntities: false })
}
