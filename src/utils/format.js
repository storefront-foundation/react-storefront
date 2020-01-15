/**
 * Formats a price for display.
 * @param {Number} price The price as a floating point number
 * @param {Object} options
 * @param {String} options.currency The currency code
 * @param {Number} options.decimals The number of decimal places to display
 * @param {String} options.locale The locale code
 * @return {String}
 */
export function price(price, { currency = 'USD', decimals = 2, locale = 'en-US' } = {}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
  }).format(price)
}
