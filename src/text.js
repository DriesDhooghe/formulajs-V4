import * as error from './utils/error.js'
import * as utils from './utils/common.js'
import { ROUND } from './math-trig.js'

// TODO
/**
 * -- Not implemented --
 *
 * Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters.
 *
 * Category: Text
 *
 * @param {*} text The text or a reference to a value that contains the text you want to change. If text does not contain any full-width letters, text is not changed.
 * @returns
 */
export function ASC() {
  throw new Error('ASC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Converts a number to text, using the ß (baht) currency format.
 *
 * Category: Text
 *
 * @param {*} number A number you want to convert to text, or a reference to a value containing a number, or a formula that evaluates to a number.
 * @returns
 */
export function BAHTTEXT() {
  throw new Error('BAHTTEXT is not implemented')
}

/**
 * Returns the character specified by the code number.
 *
 * Category: Text
 *
 * @param {*} number A number between 1 and 255 specifying which character you want. The character is from the character set used by your computer. Note: Excel for the web supports only CHAR(9), CHAR(10), CHAR(13), and CHAR(32) and above.
 * @returns
 */
export function CHAR(number) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(number)) {
    return number.map((item) => CHAR(item))
  }

  if (number === true) {
    number = 1
  }

  if (number === '') {
    return error.num
  }

  if (number < 1) {
    return error.value
  }

  number = utils.parseNumber(number)

  if (number === 0) {
    return error.value
  }

  if (number instanceof Error) {
    return number
  }

  return String.fromCharCode(number)
}

/**
 * Removes all nonprintable characters from text.
 *
 * Category: Text
 *
 * @param {*} text Any worksheet information from which you want to remove nonprintable characters.
 * @returns
 */
export function CLEAN(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (text === '') {
    return ''
  }

  if (Array.isArray(text)) {
    return text.map((item) => CLEAN(item))
  }

  text = utils.parseString(text)

  if (text instanceof Error) {
    return text
  }

  text = text || ''
  const re = /[\0-\x1F]/g

  return text.replace(re, '')
}

/**
 * Returns a numeric code for the first character in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text for which you want the code of the first character.
 * @returns
 */
export function CODE(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(text)) {
    return text.map((item) => CODE(item))
  }

  if (typeof text === 'boolean' || typeof text === 'number') {
    text = text.toString()
  }

  if (utils.anyIsError(text)) {
    return text
  }

  text = text || ''
  let result = text.charCodeAt(0)

  if (isNaN(result)) {
    result = error.value
  }

  return result
}

/**
 * Joins several text items into one text item.
 *
 * Category: Text
 *
 * @returns
 */
export function CONCATENATE() {
  const args = utils.flatten(arguments)
  const someError = utils.anyError.apply(undefined, args)

  if (arguments.length === 0) {
    return error.na
  }

  if (someError) {
    return someError
  }

  let trueFound = 0

  while ((trueFound = args.indexOf(true)) > -1) {
    args[trueFound] = 'TRUE'
  }

  let falseFound = 0

  while ((falseFound = args.indexOf(false)) > -1) {
    args[falseFound] = 'FALSE'
  }

  return args.join('')
}

export const CONCAT = CONCATENATE

// TODO
/**
 * -- Not implemented --
 *
 * Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters.
 *
 * Category: Text
 *
 * @param {*} text The text or a reference to a value that contains the text you want to change. If text does not contain any half-width English letters or katakana, text is not changed.
 * @returns
 */
export function DBCS() {
  throw new Error('DBCS is not implemented')
}

/**
 * Converts a number to text, using the $ (dollar) currency format.
 *
 * Category: Text
 *
 * @param {*} number A number, a reference to a value containing a number, or a formula that evaluates to a number.
 * @param {*} decimals Optional. The number of digits to the right of the decimal point. If this is negative, the number is rounded to the left of the decimal point. If you omit decimals, it is assumed to be 2.
 * @returns
 */
export function DOLLAR(number, decimals = 2) {
  number = utils.parseNumber(number)
  if (isNaN(number)) {
    return error.value
  }

  number = ROUND(number, decimals)

  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals >= 0 ? decimals : 0,
    maximumFractionDigits: decimals >= 0 ? decimals : 0
  }

  const formattedNumber = number.toLocaleString('en-US', options)

  if (number < 0) {
    return '$(' + formattedNumber.slice(2) + ')'
  }

  return formattedNumber
}

/**
 * Checks to see if two text values are identical.
 *
 * Category: Text
 *
 * @param {*} text1 The first text string.
 * @param {*} text2 The second text string.
 * @returns
 */
export function EXACT(text1, text2) {
  if (arguments.length !== 2) {
    return error.na
  }

  const someError = utils.anyError(text1, text2)

  if (someError) {
    return someError
  }

  text1 = utils.parseString(text1)
  text2 = utils.parseString(text2)

  return text1 === text2
}

/**
 * Locate one text string within a second text string, and return the number of the starting position of the first text string from the first character of the second text string.
 *
 * Category: Text
 *
 * @param {*} find_text The text you want to find.
 * @param {*} within_text The text containing the text you want to find.
 * @param {*} start_num Optional. Specifies the character at which to start the search. The first character in within_text is character number 1. If you omit start_num, it is assumed to be 1.
 * @returns
 */
export function FIND(find_text, within_text, start_num) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  if (Array.isArray(within_text)) {
    return within_text.map((item) => FIND(find_text, item, start_num))
  }

  if (find_text === null && within_text === null && typeof start_num === 'undefined') {
    return 1
  }

  find_text = utils.parseString(find_text)
  within_text = utils.parseString(within_text)

  const varPosition = parseInt(start_num)
  if (isNaN(varPosition) && typeof start_num !== 'undefined') {
    return error.value
  }

  start_num = start_num === undefined ? 0 : start_num
  const found_index = within_text.indexOf(find_text, start_num - 1)

  if (found_index === -1) {
    return error.value
  }

  return found_index + 1
}

export function FINDB() {
  throw new Error('FINDB is not implemented')
}

/**
 * Formats a number as text with a fixed number of decimals.
 *
 * Category: Text
 *
 * @param {*} number The number you want to round and convert to text.
 * @param {*} decimals Optional. The number of digits to the right of the decimal point.
 * @param {*} no_commas Optional. A logical value that, if TRUE, prevents FIXED from including commas in the returned text.
 * @returns
 */
export function FIXED(number, decimals = 2, no_commas = false) {
  number = utils.parseNumber(number)
  if (isNaN(number)) {
    return error.value
  }

  decimals = utils.parseNumber(decimals)
  if (isNaN(decimals)) {
    return error.value
  }

  if (decimals < 0) {
    const factor = Math.pow(10, -decimals)
    number = Math.round(number / factor) * factor
  } else {
    number = number.toFixed(decimals)
  }

  if (no_commas) {
    number = number.toString().replace(/,/g, '')
  } else {
    const parts = number.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+$)/g, ',')
    number = parts.join('.')
  }

  return number
}

/**
 * Returns the leftmost characters from a text value.
 *
 * Category: Text
 *
 * @param {*} text The text string that contains the characters you want to extract.
 * @param {*} num_chars Optional. Specifies the number of characters you want LEFT to extract.
 * @returns
 */
export function LEFT(text, num_chars) {
  const someError = utils.anyError(text, num_chars)

  if (arguments.length < 1 || arguments.length > 2) {
    return error.na
  }

  if (Array.isArray(text)) {
    return text.map((item) => LEFT(item, num_chars))
  }

  if (someError) {
    return someError
  }

  text = utils.parseString(text)
  num_chars = num_chars === undefined ? 1 : num_chars
  num_chars = utils.parseNumber(num_chars)

  if (num_chars instanceof Error || typeof text !== 'string') {
    return error.value
  }

  return text.substring(0, num_chars)
}

export function LEFTB() {
  throw new Error('LEFTB is not implemented')
}

/**
 * Returns the number of characters in a text string
 *
 * Category: Text
 *
 * @param {*} text The text whose length you want to find. Spaces count as characters.
 * @returns
 */
export function LEN(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(text)) {
    return text.map((item) => LEN(item))
  }

  if (text instanceof Error) {
    return text
  }

  if (Array.isArray(text)) {
    return error.value
  }

  const textAsString = utils.parseString(text)

  return textAsString.length
}

export function LENB() {
  throw new Error('LENB is not implemented')
}

/**
 * Converts text to lowercase.
 *
 * Category: Text
 *
 * @param {*} text The text you want to convert to lowercase. LOWER does not change characters in text that are not letters.
 * @returns
 */
export function LOWER(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(text)) {
    return text.map((item) => LOWER(item))
  }

  text = utils.parseString(text)

  if (utils.anyIsError(text)) {
    return text
  }

  return text.toLowerCase()
}

/**
 * Returns a specific number of characters from a text string starting at the position you specify
 *
 * Category: Text
 *
 * @param {*} text The text string containing the characters you want to extract.
 * @param {*} start_num The position of the first character you want to extract in text. The first character in text has start_num 1, and so on.
 * @param {*} num_chars Specifies the number of characters you want MID to return from text.
 * @returns
 */
export function MID(text, start_num, num_chars) {
  if (arguments.length !== 3) {
    return error.na
  }

  const someError = utils.anyError(text, start_num, num_chars)
  if (someError) {
    return someError
  }

  if (start_num == null) {
    return error.value
  }

  start_num = utils.getNumber(start_num)
  num_chars = utils.getNumber(num_chars)

  if (typeof start_num === 'string' || typeof num_chars === 'string') {
    return error.value
  }

  if (Array.isArray(text)) {
    return text.map((item) => MID(item, start_num, num_chars))
  }

  if (text === null) {
    return ''
  }

  const textType = typeof text
  if (textType === 'boolean') {
    text = text.toString().toUpperCase()
  } else if (textType === 'number') {
    text = text.toString()
  }

  const begin = start_num - 1
  const end = begin + num_chars

  return text.substring(begin, end)
}

export function MIDB() {
  throw new Error('MIDB is not implemented')
}

// TODO
/**
 * Converts text to number in a locale-independent manner.
 *
 * Category: Text
 *
 * @param {*} text The text to convert to a number.
 * @param {*} decimal_separator Optional. The character used to separate the integer and fractional part of the result.
 * @param {*} group_separator Optional. The character used to separate groupings of numbers, such as thousands from hundreds and millions from thousands.
 * @returns
 */
export function NUMBERVALUE(text, decimal_separator, group_separator) {
  text = utils.isDefined(text) ? text : ''

  if (typeof text === 'number') {
    return text
  }

  if (typeof text !== 'string') {
    return error.na
  }

  decimal_separator = typeof decimal_separator === 'undefined' ? '.' : decimal_separator
  group_separator = typeof group_separator === 'undefined' ? ',' : group_separator

  return Number(text.replace(decimal_separator, '.').replace(group_separator, ''))
}

// TODO
/**
 * -- Not implemented --
 */
export function PRONETIC() {
  throw new Error('PRONETIC is not implemented')
}

/**
 * Capitalizes the first letter in each word of a text value.
 *
 * Category: Text
 *
 * @param {*} text Text enclosed in quotation marks, a formula that returns text, or a reference to a value containing the text you want to partially capitalize.
 * @returns
 */
export function PROPER(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (utils.anyIsError(text)) {
    return text
  }

  if (isNaN(text) && typeof text === 'number') {
    return error.value
  }

  if (Array.isArray(text)) {
    return text.map((item) => PROPER(item))
  }

  text = utils.parseString(text)

  return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export function REGEXEXTRACT(text, regular_expression) {
  if (arguments.length < 2) {
    return error.na
  }

  const match = text.match(new RegExp(regular_expression))

  return match ? match[match.length > 1 ? match.length - 1 : 0] : null
}

export function REGEXREPLACE(text, regular_expression, replacement) {
  if (arguments.length < 3) {
    return error.na
  }

  return text.replace(new RegExp(regular_expression), replacement)
}

export function REGEXMATCH(text, regular_expression, full) {
  if (arguments.length < 2) {
    return error.na
  }

  const match = text.match(new RegExp(regular_expression))

  return full ? match : !!match
}

/**
 * Replaces characters within text
 *
 * Category: Text
 *
 * @param {*} old_text Text in which you want to replace some characters.
 * @param {*} num_chars The number of characters in old_text that you want REPLACE to replace with new_text.
 * @param {*} length he number of characters in old_text that you want REPLACEB to replace with new_text.
 * @param {*} new_text he text that will replace characters in old_text.
 * @returns
 */
export function REPLACE(old_text, num_chars, length, new_text) {
  if (arguments.length !== 4) {
    return error.na
  }

  const someError = utils.anyError(old_text, num_chars, length, new_text)
  if (someError) {
    return someError
  }

  if (Array.isArray(old_text)) {
    return old_text.map((item) => REPLACE(item, num_chars, length, new_text))
  }

  if (num_chars === '' || num_chars === null || num_chars === 0 || length === '' || length === null) {
    return error.value
  }

  num_chars = utils.parseNumber(num_chars)
  length = utils.parseNumber(length)

  if (typeof old_text === 'boolean') {
    old_text = old_text.toString().toUpperCase()
  }

  if (typeof new_text === 'boolean') {
    new_text = new_text.toString().toUpperCase()
  }

  old_text = old_text.toString()
  new_text = new_text.toString()

  if (utils.anyIsError(num_chars, length) || typeof old_text !== 'string' || typeof new_text !== 'string') {
    return error.value
  }

  return old_text.substr(0, num_chars - 1) + new_text + old_text.substr(num_chars - 1 + length)
}

export function REPLACEB() {
  throw new Error('REPLACEB is not implemented')
}

/**
 * Repeats text a given number of times.
 *
 * Category: Text
 *
 * @param {*} text The text you want to repeat.
 * @param {*} number_times A positive number specifying the number of times to repeat text.
 * @returns
 */
export function REPT(text, number_times) {
  const someError = utils.anyError(text, number_times)

  if (someError) {
    return someError
  }

  text = utils.parseString(text)
  number_times = utils.parseNumber(number_times)

  if (number_times instanceof Error) {
    return number_times
  }

  return new Array(number_times + 1).join(text)
}

/**
 * Returns the rightmost characters from a text value
 *
 * Category: Text
 *
 * @param {*} text The text string containing the characters you want to extract.
 * @param {*} num_chars Optional. Specifies the number of characters you want RIGHT to extract.
 * @returns
 */
export function RIGHT(text, num_chars) {
  const someError = utils.anyError(text, num_chars)

  if (arguments.length < 1 || arguments.length > 2) {
    return error.na
  }

  if (Array.isArray(text)) {
    return text.map((item) => RIGHT(item, num_chars))
  }

  if (someError) {
    return someError
  }

  text = utils.parseString(text)
  num_chars = num_chars === undefined ? 1 : num_chars
  num_chars = utils.parseNumber(num_chars)

  if (num_chars instanceof Error) {
    return num_chars
  }

  return text.substring(text.length - num_chars)
}

export function RIGHTB() {
  throw new Error('RIGHTB is not implemented')
}

/**
 * Finds one text value within another (not case-sensitive)
 *
 * Category: Text
 *
 * @param {*} find_text The text that you want to find.
 * @param {*} within_text The text in which you want to search for the value of the find_text argument.
 * @param {*} start_num Optional. The character number in the within_text argument at which you want to start searching.
 * @returns
 */
export function SEARCH(find_text, within_text, start_num) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  if (Array.isArray(within_text)) {
    return within_text.map((item) => SEARCH(find_text, item, start_num))
  }

  if (find_text instanceof Error) {
    return find_text
  }

  if (within_text instanceof Error) {
    return within_text
  }

  if (start_num instanceof Error) {
    return start_num
  }

  if (start_num === undefined) {
    start_num = 0
  } else {
    start_num = utils.getNumber(start_num)

    if (typeof start_num !== 'number' || start_num < 1) {
      return error.value
    }

    start_num--
  }

  find_text = find_text !== null ? find_text.toString() : ''

  within_text = within_text !== null ? within_text.toString() : ''

  let foundAt = within_text.toLowerCase().indexOf(find_text.toLowerCase(), start_num) + 1

  return foundAt === 0 ? error.value : foundAt
}

export function SEARCHB() {
  throw new Error('SEARCHB is not implemented')
}

export function SPLIT(text, separator) {
  return text.split(separator)
}

/**
 * Substitutes new text for old text in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text or the reference to a value containing text for which you want to substitute characters.
 * @param {*} old_text The text you want to replace.
 * @param {*} new_text The text you want to replace old_text with.
 * @param {*} instance_num Optional. Specifies which occurrence of old_text you want to replace with new_text. If you specify instance_num, only that instance of old_text is replaced. Otherwise, every occurrence of old_text in text is changed to new_text.
 * @returns
 */
export function SUBSTITUTE(text, old_text, new_text, instance_num) {
  if (arguments.length < 3 || arguments.length > 4) {
    return error.na
  }

  if (new_text === null) {
    new_text = ''
  }

  if (text === null) {
    text = ''
  }

  if (typeof text === 'boolean') {
    text = text.toString().toUpperCase()
  }

  if (typeof new_text === 'boolean') {
    return text
  }

  if (typeof instance_num === 'boolean') {
    return error.value
  }

  if (!text || !old_text) {
    return text
  } else if (instance_num === undefined) {
    return text.split(old_text).join(new_text)
  } else {
    instance_num = Math.floor(Number(instance_num))

    if (Number.isNaN(instance_num) || instance_num <= 0) {
      return error.value
    }

    let index = text.indexOf(old_text)
    let i = 0

    while (index > -1) {
      i++

      if (i === instance_num) {
        return text.substring(0, index) + new_text + text.substring(index + old_text.length)
      }
      index = text.indexOf(old_text, index + 1)
    }

    return text
  }
}

/**
 * Converts its arguments to text.
 *
 * Category: Text
 *
 * @param {*} value The value you want to test.
 * @returns
 */
export function T(value) {
  if (value instanceof Error) {
    return value
  }

  return typeof value === 'string' ? value : ''
}

/**
 * Combines the text from multiple ranges and/or strings.
 *
 * Category: Text
 * @param {*} delimiter A text string, either empty, or one or more characters enclosed by double quotes, or a reference to a valid text string. If a number is supplied, it will be treated as text.
 * @param {*} ignore_empty If TRUE, ignores empty values.
 * @param {*} args Text item to be joined. A text string, or array of strings, such as a range of values.
 * @returns
 */
export function TEXTJOIN(delimiter, ignore_empty, ...args) {
  if (arguments.length < 3) {
    return error.na
  }

  if (ignore_empty !== null && typeof ignore_empty !== 'boolean') {
    ignore_empty = utils.parseBool(ignore_empty)
  }

  if (ignore_empty === error.value) {
    return error.value
  }

  if (delimiter == undefined || delimiter == null) {
    delimiter = ''
  }

  let flatArgs = utils.flatten(args)
  let textToJoin = ignore_empty ? flatArgs.filter((text) => text) : flatArgs

  if (Array.isArray(delimiter)) {
    delimiter = utils.flatten(delimiter)

    let chunks = textToJoin.map((item) => [item])
    let index = 0

    for (let i = 0; i < chunks.length - 1; i++) {
      chunks[i].push(delimiter[index])
      index++

      if (index === delimiter.length) {
        index = 0
      }
    }

    textToJoin = utils.flatten(chunks)

    return textToJoin.join('')
  }

  return textToJoin.join(delimiter)
}

/**
 * Removes spaces from text.
 *
 * Category: Text
 *
 * @param {*} text The text from which you want spaces removed.
 * @returns
 */
export function TRIM(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (text === null) {
    return ''
  }

  if (Array.isArray(text)) {
    return text.map((item) => TRIM(item))
  }

  text = utils.parseString(text)

  if (text instanceof Error) {
    return text
  }

  return text.replace(/\s+/g, ' ').trim()
}

export const UNICHAR = CHAR

export const UNICODE = CODE

/**
 * Converts text to uppercase.
 *
 * Category: Text
 *
 * @param {*} text The text you want converted to uppercase. Text can be a reference or text string.
 * @returns
 */
export function UPPER(text) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (Array.isArray(text)) {
    return text.map((item) => UPPER(item))
  }

  text = utils.parseString(text)

  if (text instanceof Error) {
    return text
  }

  return text.toUpperCase()
}

/**
 * Converts a text argument to a number.
 *
 * Category: Text
 *
 * @param {*} text The text enclosed in quotation marks or a reference to a value containing the text you want to convert.
 * @returns
 */
export function VALUE(text) {
  const anyError = utils.anyError(text)

  if (anyError) {
    return anyError
  }

  if (typeof text === 'number') {
    return text
  }

  if (!utils.isDefined(text)) {
    text = ''
  }

  if (typeof text !== 'string') {
    return error.value
  }

  const isPercent = /(%)$/.test(text) || /^(%)/.test(text)
  text = text.replace(/^[^0-9-]{0,3}/, '')
  text = text.replace(/[^0-9]{0,3}$/, '')
  text = text.replace(/[ ,]/g, '')

  if (text === '') {
    return 0
  }

  let output = Number(text)

  if (isNaN(output)) {
    return error.value
  }

  output = output || 0

  if (isPercent) {
    output = output * 0.01
  }

  return output
}

/**
 * Returns text that occurs after given character or string.
 *
 * Category: Text
 *
 * @param {*} text The text you are searching within. Wildcard characters not allowed.
 * @param {*} delimiter The text that marks the point after which you want to extract.
 * @param {*} instanceNum The instance of the delimiter after which you want to extract the text. A negative number starts searching text from the end.
 * @param {*} matchMode  Determines whether the text search is case-sensitive. The default is case-sensitive.
 * @param {*} matchEnd  Treats the end of text as a delimiter. By default, the text is an exact match.
 * @param {*} ifNotFound  Value returned if no match is found. By default, #N/A is returned.
 * @returns
 */
export function TEXTAFTER(text, delimiter, instanceNum = 1, matchMode = 0, matchEnd = 0, ifNotFound = error.na) {
  if (arguments.length < 2 || arguments.length > 6 || utils.anyIsUndefined(text, delimiter)) {
    return error.na
  }

  const anyError = utils.anyError(...arguments)

  if (anyError) {
    return anyError
  }

  if (utils.getVariableType(text) !== 'single') {
    return error.value
  }

  text = utils.parseString(text)
  delimiter = utils.parseString(delimiter)
  instanceNum = utils.parseNumber(instanceNum)
  matchMode = utils.parseNumber(matchMode)
  matchEnd = utils.parseNumber(matchEnd)

  if (utils.anyIsError(text, delimiter, instanceNum, matchMode, matchEnd)) {
    return error.value
  }

  const token = '|'
  let tokenizedText = token + text.split('').join(token) + token
  let tokenizedDelimiter = token + delimiter.split('').join(token)

  if (text.length < instanceNum || instanceNum === 0) {
    return error.value
  }

  if (matchMode) {
    tokenizedText = tokenizedText.toLowerCase()
    tokenizedDelimiter = tokenizedDelimiter.toLowerCase()
  }

  let lastInstancePos = 0
  let instanceLoops = 0

  if (instanceNum < 0) {
    instanceLoops = -instanceNum

    for (let i = 0; i < instanceLoops; i++) {
      if (tokenizedText.includes(tokenizedDelimiter)) {
        lastInstancePos = tokenizedText.lastIndexOf(tokenizedDelimiter)
        tokenizedText = tokenizedText.substring(0, tokenizedText.lastIndexOf(tokenizedDelimiter))
      } else {
        if (matchEnd) {
          return text
        }
        return ifNotFound
      }
    }
  } else {
    instanceLoops = instanceNum

    for (let i = 0; i < instanceLoops; i++) {
      if (tokenizedText.includes(tokenizedDelimiter)) {
        lastInstancePos = tokenizedText.indexOf(tokenizedDelimiter)
        tokenizedText = tokenizedText.replace(tokenizedDelimiter, new Array(tokenizedDelimiter.length + 1).join(token))
      } else {
        if (matchEnd) {
          return ''
        }
        return ifNotFound
      }
    }
  }

  return (token + text.split('').join(token) + token)
    .slice(lastInstancePos + tokenizedDelimiter.length)
    .replaceAll(token, '')
}

/**
 * Returns text that occurs before given character or string.
 *
 * Category: Text
 *
 * @param {*} text The text you are searching within. Wildcard characters not allowed.
 * @param {*} delimiter The text that marks the point after which you want to extract.
 * @param {*} instanceNum The instance of the delimiter after which you want to extract the text. A negative number starts searching text from the end.
 * @param {*} matchMode  Determines whether the text search is case-sensitive. The default is case-sensitive.
 * @param {*} matchEnd  Treats the end of text as a delimiter. By default, the text is an exact match.
 * @param {*} ifNotFound  Value returned if no match is found. By default, #N/A is returned.
 * @returns
 */
export function TEXTBEFORE(text, delimiter, instanceNum = 1, matchMode = 0, matchEnd = 0, ifNotFound = error.na) {
  if (arguments.length < 2 || arguments.length > 6 || utils.anyIsUndefined(text, delimiter)) {
    return error.na
  }

  const anyError = utils.anyError(...arguments)

  if (anyError) {
    return anyError
  }

  if (utils.getVariableType(text) !== 'single') {
    return error.value
  }

  text = utils.parseString(text)
  delimiter = utils.parseString(delimiter)
  instanceNum = utils.parseNumber(instanceNum)
  matchMode = utils.parseNumber(matchMode)
  matchEnd = utils.parseNumber(matchEnd)

  if (utils.anyIsError(text, delimiter, instanceNum, matchMode, matchEnd)) {
    return error.value
  }

  const token = '|'
  let tokenizedText = token + text.split('').join(token) + token
  let tokenizedDelimiter = token + delimiter.split('').join(token)

  if (text.length < instanceNum || instanceNum === 0) {
    return error.value
  }

  if (matchMode) {
    tokenizedText = tokenizedText.toLowerCase()
    tokenizedDelimiter = tokenizedDelimiter.toLowerCase()
  }

  let lastInstancePos = 0
  let instanceLoops = 0

  if (instanceNum < 0) {
    instanceLoops = -instanceNum

    for (let i = 0; i < instanceLoops; i++) {
      if (tokenizedText.includes(tokenizedDelimiter)) {
        lastInstancePos = tokenizedText.lastIndexOf(tokenizedDelimiter)
        tokenizedText = tokenizedText.substring(0, tokenizedText.lastIndexOf(tokenizedDelimiter))
      } else {
        if (matchEnd) {
          return ''
        }
        return ifNotFound
      }
    }
  } else {
    instanceLoops = instanceNum

    for (let i = 0; i < instanceLoops; i++) {
      if (tokenizedText.includes(tokenizedDelimiter)) {
        lastInstancePos = tokenizedText.indexOf(tokenizedDelimiter)
        tokenizedText = tokenizedText.replace(tokenizedDelimiter, new Array(tokenizedDelimiter.length + 1).join(token))
      } else {
        if (matchEnd) {
          return text
        }
        return ifNotFound
      }
    }
  }

  return (token + text.split('').join(token) + token).slice(0, lastInstancePos).replaceAll(token, '')
}

/**
 * Splits text strings by using column and row delimiters.
 *
 * Category: Text
 *
 * @param {*} text The text you are searching within. Wildcard characters not allowed.
 * @param {*} col_delimiter   The text that marks the point where to spill the text across columns.
 * @param {*} row_delimiter The text that marks the point where to spill the text down rows. Optional.
 * @param {*} ignoreEmpty  Specify TRUE to ignore consecutive delimiters. Defaults to FALSE, which creates an empty cell. Optional.
 * @param {*} matchMode  Specify 1 to perform a case-insensitive match. Defaults to 0, which does a case-sensitive match. Optional.
 * @param {*} padWidth  The value with which to pad the result. The default is #N/A.
 * @returns
 */
export function TEXTSPLIT(text, colDelimiter, rowDelimiter, ignoreEmpty = false, matchMode = 0, padWidth = error.na) {
  if (arguments.length < 2 || arguments.length > 6 || utils.anyIsUndefined(text)) {
    return error.na
  }

  if (
    utils.anyIsNull(text, colDelimiter) ||
    utils.getVariableType(text) !== 'single' ||
    utils.getVariableType(colDelimiter) !== 'single' ||
    utils.getVariableType(rowDelimiter) !== 'single' ||
    (!utils.isDefined(colDelimiter) && !utils.isDefined(rowDelimiter))
  ) {
    return error.value
  }

  const anyError = utils.anyError(text, colDelimiter, rowDelimiter, ignoreEmpty, matchMode)

  if (anyError) {
    return anyError
  }

  text = utils.parseString(text)
  ignoreEmpty = utils.parseBool(ignoreEmpty)
  matchMode = utils.parseBool(matchMode)

  if (utils.anyIsError(text, ignoreEmpty, matchMode)) {
    return error.value
  }

  if (matchMode) {
    const regEscape = v => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    colDelimiter = colDelimiter ? new RegExp(regEscape(colDelimiter), 'ig') : colDelimiter
    rowDelimiter = rowDelimiter ? new RegExp(regEscape(rowDelimiter), 'ig') : rowDelimiter
  }

  let rows = text.split(rowDelimiter)
  let maxSize = 0

  let rowsLength = rows.length

  for (let i = 0; i < rowsLength; i++) {
    rows[i] = rows[i].split(colDelimiter)
    if (rows[i].length > maxSize) {
      maxSize = rows[i].length
    }
  }

  if (ignoreEmpty) {
    let filteredResult = []
    let newSize = 0
    let rowLength = undefined

    for (let i = 0; i < rowsLength; i++) {
      filteredResult[i] = []
      for (let j = 0; j < maxSize; j++) {
        if (rows[i][j] !== '') {
          filteredResult[i].push(rows[i][j])
        }
      }
      rowLength = filteredResult[i].length
      if (rowLength > newSize) {
        newSize = rowLength
      }
    }

    maxSize = newSize
    rows = filteredResult
  }

  let result = []

  for (let i = 0; i < rowsLength; i++) {
    result[i] = []
    for (let j = 0; j < maxSize; j++) {
      result[i][j] = utils.isDefined(rows[i][j]) ? rows[i][j] : padWidth
    }
  }

  if (result.length === 1 && result[0].length === 1) {
    return result[0][0]
  }

  return result
}
