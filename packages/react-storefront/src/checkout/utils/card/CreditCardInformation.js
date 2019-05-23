import { isArray, uniq } from 'lodash'
import NumberPattern from './NumberPattern'
import assert from 'assert'
import sanitizer from '../sanitizer'
import validateCard from './validateCard'

/**
 * An enumeration of results returnable by CreditCardInformation.validateCard
 */
export const ValidationResult = {
  VALID: Symbol('VALID'),
  TOO_SHORT: Symbol('TOO_SHORT'),
  TOO_LONG: Symbol('TOO_LONG'),
  INVALID: Symbol('INVALID'), // invalid means it fails the Luhn algorithm
  UNSUPPORTED_TYPE: Symbol('UNSUPPORTED_TYPE')
}

/**
 * A set of human-readable error messages
 * TODO: These messages need usability review
 */
export const ErrorMessages = {
  INVALID: 'is invalid - please double-check the card number.',
  TOO_LONG: 'is invalid - wrong number of digits entered.',
  TOO_SHORT: 'is too short - please finish entering your card number.',
  UNSUPPORTED_TYPE: 'is for {TYPE}, which is not accepted.'
}

// TODO: Some store cards might not have an expiration date
/**
 * A class to encapsulate information about validating credit card information.
 */
class CreditCardInformation {
  /**
   * Constructs a CreditCardInformation object.
   *
   * If the `data` parameter is a string, the object is populated with information about the
   * predefined standard card type with that type name.
   *
   * If the `data` parameter is an object, that object must contain the following keys:
   *    typeName: {String} A unique identifier for the type. This is also used as a CSS class name
   *            applied to .credit-card-information for rendering the card's logo
   *    friendlyName: {String} The name to be displayed, e.g. in the list of supported types
   *    cvvLength: {Number} The number of required CVV digits, or 0 for no CVV expected
   *    numberLength: {Number[]|Number} Either the required card number length, or an array of
   *            acceptable card number lengths
   *    numberMatcher: {RegExp|Function} A regular expression that matches the prefix of a credit
   *            number of this type, or a function that returns true when passed the prefix of a
   *            credit card number of this type
   *
   * The `data` object may also contain the following keys but will select defaults if omitted:
   *    numberPattern: {String|NumberPattern} A formatting mask (default "#### #### #### ####")
   *    supersedes: {String=} If set, and if the form accepts both this type and the specified type,
   *            a credit card number that matches both of these types will be considered this type
   *    noExpiration: {Boolean=} If set to true, credit cards of this type do not bear expiration
   *            dates.
   *    noCheckDigit: {Boolean=} If set to true, credit cards of this type do not use the Luhn
   *            algorithm to calculate a check digit.
   *    internal: {Boolean=} If set to true, this credit card type is for internal use only and will
   *            not appear in the displayed list of supported types.
   *
   * @param {Object|string} data Information about the card type, or the name of an existing type
   */
  constructor(data) {
    let source = data

    /**
     * @property typeName {String} A unique identifier for the type.
     *
     * This is also used as a CSS class name applied to .credit-card-information for rendering the
     * card's logo.
     */
    if (typeof data === 'string') {
      source = CreditCardInformation.standardCards[data]
      assert(source, `CreditCardInformation: unknown standard card type "${data}"`)
      this.typeName = data
    } else {
      this.typeName = data.typeName
    }

    /**
     * @property {String} The name to be displayed, e.g. in the list of supported types
     */
    this.friendlyName = source.friendlyName
    /**
     * @property {Number} The number of required CVV digits, or 0 for no CVV expected
     */
    this.cvvLength = source.cvvLength
    /**
     * @property {String} Physical location of the CVV digits on the card
     */
    this.cvvPosition = source.cvvPosition || 'back'
    /**
     * @property {Number[]} A list of acceptable card number lengths
     */
    this.numberLength = isArray(source.numberLength) ? source.numberLength : [source.numberLength]
    /**
     * @property {?String} Take precedence over a type with this typeName
     */
    this.supersedes = source.supersedes
    /**
     * @property {RegExp|Function} A regular expression that matches the prefix of a credit number
     * of this type, or a function that returns true when passed the prefix of a credit card number
     * of this type
     */
    this.numberMatcher = source.numberMatcher

    /**
     * @property numberPattern {NumberPattern} The formatting mask for the card number
     */
    if (typeof source.numberPattern === 'string') {
      this.numberPattern = new NumberPattern(source.numberPattern)
    } else if (source.numberPattern) {
      this.numberPattern = source.numberPattern
    } else {
      this.numberPattern = NumberPattern.patternForCard(this.typeName)
    }

    /**
     * @property {Boolean} If true, cards of this type have no expiration date.
     */
    this.noExpiration = !!source.noExpiration

    /**
     * @property {Boolean} If true, cards of this type have no check digit.
     */
    this.noCheckDigit = !!source.noCheckDigit

    /**
     * @property {Boolean} If true, this type will not appear in the displayed list of supported types.
     */
    this.internal = !!source.internal

    assert(this.friendlyName, 'CreditCardInformation: friendlyName is required')
    assert(typeof this.cvvLength === 'number', 'CreditCardInformation: cvvLength must be a number')
    assert(
      typeof source.numberLength === 'number' || isArray(source.numberLength),
      'CreditCardInformation: numberLength must be a number or array of numbers'
    )
    assert(
      this.numberPattern instanceof NumberPattern,
      'CreditCardInformation: numberPattern must be valid'
    )
    assert(
      this.numberMatcher instanceof RegExp || this.numberMatcher instanceof Function,
      'CreditCardInformation: numberMatcher must be function or regexp'
    )
    assert(
      this.typeName,
      'CreditCardInformation: typeName must be specified and refer to a CSS class name'
    )
  }

  /**
   * Validates a credit card number, returning a set of applicable errors.
   * @param {String} cardNumber The credit card number to validate
   * @param {CreditCardInformation[]} supportedCardTypes The allowed card types
   * @return {Symbol} An error code from ValidationResult
   */
  static validateCard(cardNumber, supportedCardTypes = CreditCardInformation.standardCardOrder) {
    const number = sanitizer.numeralsOnly(cardNumber)
    if (number.length === 0) {
      // An empty card number doesn't need to be validated; it will just fail the required check
      return ValidationResult.VALID
    }

    const type = CreditCardInformation.determineCardType(number, supportedCardTypes)
    if (!type) {
      // The card number doesn't go with any of the supported card types
      return ValidationResult.UNSUPPORTED_TYPE
    }

    // Check the card's length
    const lengthResult = type.validateLength(number)
    if (lengthResult !== ValidationResult.VALID) {
      return lengthResult
    }

    // Check the Luhn algorithm
    if (!type.noCheckDigit && !validateCard(number)) {
      return ValidationResult.INVALID
    }

    // No reason to reject it
    return ValidationResult.VALID
  }

  /**
   * Translates a set of error codes into human-readable messages.
   * @param {String} cardNumber The card number being validated
   * @param {Symbol} errorCode An error code from ValidationResult
   * @param {Boolean} inProgress True if the user is still typing
   * @return {String=} A human-readable error message, or null
   */
  static getErrorMessage(cardNumber, errorCode, inProgress) {
    if (errorCode === ValidationResult.VALID) {
      return null
    }
    const number = sanitizer.numeralsOnly(cardNumber)
    if (errorCode === ValidationResult.UNSUPPORTED_TYPE) {
      const guessedType = CreditCardInformation.determineCardType(number)
      if (guessedType) {
        return ErrorMessages.UNSUPPORTED_TYPE.replace('{TYPE}', guessedType.friendlyName)
      }
      return ErrorMessages.INVALID
    } else if (errorCode === ValidationResult.TOO_SHORT) {
      return inProgress ? null : ErrorMessages.TOO_SHORT
    } else if (errorCode === ValidationResult.TOO_LONG) {
      return inProgress ? null : ErrorMessages.TOO_LONG
    }
    return ErrorMessages.INVALID
  }

  /**
   * Adds a standard card type to the information registry.
   * @internal
   * @param {String} typeName The unique identifier for the card type
   * @param {Object} data See the `data` parameter of `constructor`
   */
  static addStandardCard(typeName, data) {
    data.typeName = typeName
    data.numberPattern = NumberPattern.patternForCard(typeName)
    if (data.numberLength.length === undefined) {
      data.numberLength = [data.numberLength]
    }
    CreditCardInformation.standardCards[typeName] = new CreditCardInformation(data)
    CreditCardInformation.standardCardOrder.push(CreditCardInformation.standardCards[typeName])
  }

  /**
   * Generates a function that matches credit card prefixes that fall into a set of numeric ranges.
   * @param {...(Number|Number[])} ranges A set of numeric prefixes, or arrays of [min, max]
   * @return {Function}
   */
  static rangeMatcher(...ranges) {
    const checkFunctions = ranges.map(range => {
      if (typeof range === 'number') {
        // If it's a single number, just treat it as a prefix
        return number => number.startsWith(range)
      }
      // Otherwise, treat it as an array where 0=min 1=max
      const digits = `${range[0]}`.length
      return number => {
        const prefix = parseInt(number.substr(0, digits), 10)
        return range[0] <= prefix && prefix <= range[1]
      }
    })
    return number => checkFunctions.some(fn => fn(number))
  }

  /**
   * Returns the card type information for a (possibly partial) credit card number.
   * This does not validate the card number against the returned type.
   * @param {String} numberStr The credit card number to inspect
   * @param {CreditCardInformation[]=} typeObjects An array of supported types
   * @return {CreditCardInformation} The best guess for the card type
   */
  static determineCardType(numberStr, typeObjects = CreditCardInformation.standardCardOrder) {
    if (!numberStr) {
      return null
    }
    const number = sanitizer.numeralsOnly(numberStr)
    const possibleTypes = typeObjects.filter(type => type.matchesCardNumber(number))
    // Match failure and unique match are easy.
    if (possibleTypes.length === 0) {
      return null
    }
    if (possibleTypes.length === 1) {
      return possibleTypes[0]
    }

    // Otherwise, pull off the first type from the list and see if anything later is more important
    let selectedType = possibleTypes.shift()
    const predicate = otherType => otherType.supersedes === selectedType.typeName
    for (;;) {
      const supersedingType = possibleTypes.find(predicate)
      if (supersedingType) {
        selectedType = supersedingType
      } else {
        return selectedType
      }
    }
  }

  /**
   * Retrieves the CreditCardInformation object corresponding to a type name.
   *
   * For convenience, you may call this method with (card.cardType || card.cardNumber) to retrieve
   * the type information for a card if the type is already known, or automatically guess at the
   * card type if it is not.
   *
   * @param {String} typeNameOrCardNumber The name of the type, or a credit card number
   * @param {CreditCardInformation[]=} typeObjects An array of supported types
   * @return {CreditCardInformation} The matching object, or null
   */
  static typeInfo(typeNameOrCardNumber, typeObjects = []) {
    // we'll check the site's allowed card (including custom cards), but also all the other
    // standard cards since this function just gives info, without caring if the type is valid:
    const searchResult = uniq([...typeObjects, ...CreditCardInformation.standardCardOrder]).find(
      cardType => cardType.typeName === typeNameOrCardNumber
    )
    if (searchResult) {
      return searchResult
    }
    return CreditCardInformation.determineCardType(typeNameOrCardNumber)
  }

  /**
   * Determine whether the given (possibly partial) card number might belong to this card type.
   * @param {String} number The credit card number to inspect
   * @return {Boolean}
   */
  matchesCardNumber(number) {
    if (this.numberMatcher instanceof RegExp) {
      return !!number.match(this.numberMatcher)
    }
    return !!this.numberMatcher(number)
  }

  /**
   * Determines if a credit card number is a valid length for this type.
   * @param {String} numberStr The credit card number to inspect
   * @return {Symbol} A member of ValidationResult
   */
  validateLength(numberStr) {
    const number = sanitizer.numeralsOnly(numberStr)
    if (this.numberLength.includes(number.length)) {
      return ValidationResult.VALID
    }
    // Right now, we assume that the minimum supported card length is preferred.
    // Keep an eye on this as the market evolves in the face of 19-digit Visa numbers.
    if (number.length > Math.min(...this.numberLength)) {
      return ValidationResult.TOO_LONG
    }
    return ValidationResult.TOO_SHORT
  }

  /**
   * Formats a credit card number according to the type's number pattern, optionally
   * masking all but the last four digits.
   * @param {String} numberStr The credit card number to format
   * @param {Object=} options
   *    mask: Set to true to mask the number
   *    partial: Set to true to allow partial credit card numbers
   * @return {String} The formatted credit card number
   */
  formatNumber(numberStr, { mask = false, partial = false }) {
    if (!numberStr) {
      return ''
    }
    const minLength = Math.min(...this.numberLength)
    const numberLength = Math.max(minLength, numberStr.replace(/\s/g, '').length)
    const number = sanitizer.numeralsOnly(numberStr)
    const shouldMask = (!partial && number.length < numberLength) || mask
    if (shouldMask) {
      const lastFour = number.substr(-4)
      const maskedNumber = `********************${lastFour}`.substr(-numberLength)
      return this.numberPattern.formatClean(maskedNumber)
    }
    return this.numberPattern.formatClean(number)
  }

  /**
   * Determines the proper help text string for CVV input, based on the given card type.
   * @param {String=} cardType Type of card, which should match the typeName from an instance
   *  of this class. If omitted, or if it does not match an existing instance, the default
   *  help string will be returned.
   * @param {CreditCardInformation[]=} typeObjects An array of supported types
   * @returns {String} Help string for CVV input field.
   */
  static cvvHelpForCardType(cardType, typeObjects = CreditCardInformation.standardCardOrder) {
    let length = '3-4'
    let position = 'back'
    if (cardType) {
      const typeInfo = CreditCardInformation.typeInfo(cardType, typeObjects)
      if (typeInfo) {
        length = typeInfo.cvvLength
        position = typeInfo.cvvPosition
      }
    }
    return `Your card security code: a ${length} digit code found on the ${position} of your card.`
  }
}

/**
 * A collection of common credit card types, indexed by typeName
 */
CreditCardInformation.standardCards = {}

/**
 * The standard credit card types, ordered by precedence
 * @internal
 */
CreditCardInformation.standardCardOrder = []

CreditCardInformation.addStandardCard('visa', {
  friendlyName: 'Visa',
  cvvLength: 3,
  numberLength: [16, 19],
  numberMatcher: /^4/
})

CreditCardInformation.addStandardCard('mastercard', {
  friendlyName: 'MasterCard',
  cvvLength: 3,
  numberLength: 16,
  numberMatcher: /^(5[1-5]|2[2-7])/
})

CreditCardInformation.addStandardCard('americanexpress', {
  friendlyName: 'American Express',
  cvvLength: 4,
  cvvPosition: 'front',
  numberLength: 15,
  numberMatcher: /^3[47]/
})

CreditCardInformation.addStandardCard('carteblanche', {
  friendlyName: 'Carte Blanche',
  cvvLength: 3,
  numberLength: 14,
  numberMatcher: /^30[0-5]/,
  supersedes: 'dinersclub'
})

CreditCardInformation.addStandardCard('dinersclub', {
  friendlyName: 'Diners Club',
  cvvLength: 3,
  numberLength: 14,
  numberMatcher: /^(30[0-59]|3[689])/
})

CreditCardInformation.addStandardCard('discover', {
  friendlyName: 'Discover',
  cvvLength: 3,
  numberLength: [16, 19],
  numberMatcher: CreditCardInformation.rangeMatcher(6011, [622126, 622925], [644, 649], 65),
  supersedes: 'unionpay'
})

CreditCardInformation.addStandardCard('jcb', {
  friendlyName: 'JCB',
  cvvLength: 3,
  numberLength: 16,
  numberMatcher: CreditCardInformation.rangeMatcher([3528, 3589])
})

CreditCardInformation.addStandardCard('unionpay', {
  friendlyName: 'UnionPay',
  cvvLength: 3,
  numberLength: [16, 17, 18, 19],
  numberMatcher: /^62\d{4}/
})

CreditCardInformation.addStandardCard('maestro', {
  friendlyName: 'Maestro',
  cvvLength: 0,
  numberLength: [16, 17, 18, 19],
  numberMatcher: CreditCardInformation.rangeMatcher(50, [56, 61], [63, 69])
})

// sites won't have this as an allowed type, but a saved PP Credit account could be a
// part of a logged-in user's saved payment methods. we won't have to worry about the
// number matcher since it will never be a number entered into the CC num input form
CreditCardInformation.addStandardCard('paypalcredit', {
  friendlyName: 'PayPal Credit',
  cvvLength: 0,
  numberLength: 16,
  numberMatcher: () => false
})

export default CreditCardInformation
