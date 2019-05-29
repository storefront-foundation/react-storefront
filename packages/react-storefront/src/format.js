/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Formats a price for display
 * @param {Number} price
 * @param {Object} options
 * @return {String}
 */
export function price(price, { currency = 'USD', decimals = 2, locale = 'en-US' } = {}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals
  }).format(price)
}
