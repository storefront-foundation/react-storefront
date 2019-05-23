import sanitizer from '../sanitizer'

/**
 * Validate a card using the Luhn algorithm.
 * https://en.wikipedia.org/wiki/Payment_card_number
 * https://en.wikipedia.org/wiki/Luhn_algorithm
 * @param  {String} card
 * @return {Boolean}
 */
function validateCard(card) {
  // Adapted from
  // https://gist.github.com/DiegoSalazar/4075533
  let nCheck = 0
  let nDigit = 0
  let bEven = false
  const value = sanitizer.numeralsOnly(card)

  for (let n = value.length - 1; n >= 0; n--) {
    const cDigit = value.charAt(n)
    nDigit = parseInt(cDigit)

    if (bEven) {
      nDigit *= 2
      if (nDigit > 9) {
        nDigit -= 9
      }
    }

    nCheck += nDigit
    bEven = !bEven
  }
  return nCheck % 10 === 0
}
export default validateCard
