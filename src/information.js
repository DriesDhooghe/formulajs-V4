import * as utils from './utils/common.js'
import * as error from './utils/error.js'

export const ERROR = {}

ERROR.TYPE = (error_val) => {
  switch (error_val) {
    case error.nil:
      return 1
    case error.div0:
      return 2
    case error.value:
      return 3
    case error.ref:
      return 4
    case error.name:
      return 5
    case error.num:
      return 6
    case error.na:
      return 7
    case error.data:
      return 8
  }

  return error.na
}

/**
 * Returns TRUE if the value is any error value except #N/A.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISERR(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISERR(item))
  }

  if (value === error.na) {
    return false
  }

  return Object.values(error).includes(value) || (typeof value === 'number' && (isNaN(value) || !isFinite(value)))
}

/**
 * Returns TRUE if the value is any error value.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISERROR(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISERROR(item))
  }

  return ISERR(value) || value === error.na
}

/**
 * Returns TRUE if the number is even.
 *
 * Category: Information
 *
 * @param {*} number The value to test. If number is not an integer, it is truncated.
 * @returns
 */
export function ISEVEN(number) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(number)) {
    return error.value
  }

  if (number instanceof Error) {
    return number
  }

  if (typeof number === 'boolean') {
    return error.value
  }

  number = utils.getNumber(number)

  if (typeof number !== 'number') {
    return error.value
  }

  return !(Math.floor(Math.abs(number)) & 1)
}

/**
 * Returns TRUE if the value is a logical value.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISLOGICAL(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISLOGICAL(item))
  }

  return typeof value === 'boolean'
}

/**
 * Returns TRUE if the value is the #N/A error value.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISNA(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISNA(item))
  }

  return value === error.na
}

/**
 * Returns TRUE if the value is not text.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISNONTEXT(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISNONTEXT(item))
  }

  return typeof value !== 'string'
}

/**
 * Returns TRUE if the value is a number.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISNUMBER(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISNUMBER(item))
  }

  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Returns TRUE if the number is odd.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISODD(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return error.value
  }

  if (value instanceof Error) {
    return value
  }

  value = utils.getNumber(value)

  if (typeof value === 'string') {
    return error.value
  }

  return !!(Math.floor(Math.abs(value)) & 1)
}

/**
 * Returns TRUE if the value is text.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
export function ISTEXT(value) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(value)) {
    return value.map((item) => ISTEXT(item))
  }

  return typeof value === 'string'
}

/**
 * Returns a value converted to a number.
 *
 * Category: Information
 *
 * @param {*} value The value you want converted. N converts values listed in the following table.
 * @returns
 */
export function N(value) {
  if (Array.isArray(value)) {
    return N(value[0])
  }

  if (ISNUMBER(value)) {
    return value
  }

  if (value === true) {
    return 1
  }

  if (value === false) {
    return 0
  }

  if (ISERROR(value)) {
    return value
  }

  return 0
}

/**
 * Returns the error value #N/A.
 *
 * Category: Information
 *
 * @returns
 */
export function NA() {
  return error.na
}

/**
 * Returns a number indicating the data type of a value.
 *
 * Category: Information
 *
 * @param {*} value Can be any Microsoft Excel value, such as a number, text, logical value, and so on.
 * @returns
 */
export function TYPE(value) {
  if (Array.isArray(value)) {
    return 64
  }

  if (ISNUMBER(value)) {
    return 1
  }

  if (ISTEXT(value)) {
    return 2
  }

  if (ISLOGICAL(value)) {
    return 4
  }

  if (ISERROR(value)) {
    return 16
  }
}
