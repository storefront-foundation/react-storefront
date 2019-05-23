/**
 * NumberPattern for formatting numbers
 */
class NumberPattern {
  /**
   * @param  {String} formatStr pound signs (#) represent numbers and anything else is considered formatting
   */
  constructor(formatStr) {
    this.maxLength = formatStr.length
    this.formatCharacters = this.constructor.getFormatCharacters(formatStr)
  }

  /**
   * Creates a dictionary mapping string position to format character.
   * @param  {String} formatStr   Format string like (###) ###-####
   * @return {Object}             Example: { '0': '(', '4': ')', '5': ' ', '9': '-' }
   */
  static getFormatCharacters(formatStr) {
    const formatChars = {}
    for (let index = 0; index < formatStr.length; index++) {
      const character = formatStr[index]
      if (character !== '#') {
        formatChars[index] = character
      }
    }
    return formatChars
  }

  /**
   * Standard credit card pattern for Discover, Mastercard, and Visa
   * @return {NumberPattern}
   */
  static creditCardPattern() {
    return new NumberPattern('#### #### #### #### ###')
  }

  /**
   * American express has a different pattern than the other main credit cards
   * @return {NumberPattern}
   */
  static americanExpressCardPattern() {
    return new NumberPattern('#### ###### #####')
  }

  static dinersClubCardPattern() {
    return new NumberPattern('#### ###### ####')
  }

  /**
   * Get the number pattern for the card of the given type.
   * @param {String} typeName String containing the card type name
   * @return {NumberPattern}
   */
  static patternForCard(typeName) {
    if (typeName === 'americanexpress') {
      return this.americanExpressCardPattern()
    }
    if (['dinersclub', 'carteblanche'].includes(typeName)) {
      return this.dinersClubCardPattern()
    }
    return this.creditCardPattern()
  }

  /**
   * Given a formatted value, return a value that contains only raw data
   *
   * @param  {String} value   Value containing data, like (510) 555-4444
   * @return {String}         Cleaned value, like 5105554444
   */
  static removeNonNumbers(value) {
    if (!value) {
      return ''
    }
    return value.replace(/[^0-9]/g, '')
  }

  static containsRestrictedCharacters(value) {
    return /[^\s0-9]/.test(value)
  }

  // Given a string that is just data - like 5104443222
  // returns a formatted version like (510) 444-3222
  // Final format characters are not added. So
  // 510 -> (510 but 5105 -> (510) 5
  formatClean(cleanValue) {
    let str = ''
    let index = 0
    while (index < cleanValue.length) {
      const formatChar = this.formatCharacters[str.length]
      if (formatChar) {
        str += formatChar
      } else {
        str += cleanValue[index]
        index++
      }
      // When pattern ends, append the remainder of the string
      if (str.length === this.maxLength) {
        str += cleanValue.slice(index)
        break
      }
    }
    return str
  }

  format(str) {
    const clean = this.constructor.removeNonNumbers(str)
    return this.formatClean(clean)
  }
}
export default NumberPattern
