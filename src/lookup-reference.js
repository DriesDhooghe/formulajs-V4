import * as error from './utils/error.js'
import * as utils from './utils/common.js'
import * as advance from './advance.js'
import * as evalExpression from './utils/criteria-eval.js'

const approximateBinarySearch = (lookupValue, lookupArray) => {
  const valueType = typeof lookupValue

  if (valueType === 'string') {
    lookupValue = lookupValue.toLowerCase()
  }

  let highestValidValue = null

  let start = 0
  let end = lookupArray.length - 1

  while (end >= start) {
    let middle = start + Math.trunc((end - start) / 2)

    while (middle <= end && valueType !== typeof lookupArray[middle]) {
      middle++
    }

    if (middle > end) {
      end = start + Math.trunc((end - start) / 2) - 1

      continue
    }

    if (middle < start) {
      break
    }

    const comparisonValue =
      typeof lookupArray[middle] === 'string' ? lookupArray[middle].toLowerCase() : lookupArray[middle]

    if (lookupValue > comparisonValue) {
      highestValidValue = middle

      start = middle + 1
    } else if (lookupValue < comparisonValue) {
      end = middle - 1
    } else {
      return middle
    }
  }

  return highestValidValue
}

/**
 * Chooses a value from a list of values.
 *
 * Category: Lookup and reference
 *
 * @param {*} index_num Specifies which value argument is selected. Index_num must be a number between 1 and 254, or a formula or reference to a value containing a number between 1 and 254. If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on. If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value. If index_num is a fraction, it is truncated to the lowest integer before being used.
 - If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on.
 - If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value.
 - If index_num is a fraction, it is truncated to the lowest integer before being used.
 * @param {*} args value1, value2, ... Value 1 is required, subsequent values are optional. 1 to 254 value arguments from which CHOOSE selects a value or an action to perform based on index_num. The arguments can be numbers, value references, defined names, formulas, functions, or text.
 * @returns
 */
export function CHOOSE() {
  if (arguments.length < 2) {
    return error.na
  }

  let index = arguments[0]

  if (Array.isArray(index)) {
    const options = Array.from(arguments).slice(1)

    return index.map((item) => CHOOSE(item, ...options))
  }

  if (Object.values(error).includes(index)) {
    return index
  }

  if (typeof index === 'string') {
    index = index.trim()

    if (!utils.isValidNumber(index)) {
      return error.value
    }

    index = parseFloat(index)
  }

  if (!Number.isInteger(index)) {
    index = Math.trunc(index)
  }

  if (index < 1 || index > 254) {
    return error.value
  }

  if (arguments.length < index + 1) {
    return error.value
  }

  return arguments[index]
}

/**
 * Returns the number of columns in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or array formula, or a reference to a range of values for which you want the number of columns.
 * @returns
 */
export function COLUMNS(array) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (!(array instanceof Array)) {
    return 1
  }

  return array[0].length
}

/**
 * Looks in the top row of an array and returns the value of the indicated value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} row_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
export function HLOOKUP(lookup_value, table_array, row_index_num, range_lookup) {
  if (arguments.length < 3 || arguments.length > 4) {
    return error.na
  }

  if (Array.isArray(table_array)) {
    table_array = utils.transpose(table_array)
  }

  return VLOOKUP(lookup_value, table_array, row_index_num, range_lookup)
}

/**
 * Uses an index to choose a value from a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array A range of values or an array constant.
 - If array contains only one row or column, the corresponding row_num or column_num argument is optional.
 - If array has more than one row and more than one column, and only row_num or column_num is used, INDEX returns an array of the entire row or column in array.
 * @param {*} row_num Required, unless column_num is present. Selects the row in array from which to return a value. If row_num is omitted, column_num is required.
 * @param {*} column_num Optional. Selects the column in array from which to return a value. If column_num is omitted, row_num is required.
 * @returns
 */
export function INDEX(array, row_num, column_num) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  const someError = utils.anyError(array, row_num, column_num)
  if (someError) {
    return someError
  }

  if (!Array.isArray(array)) {
    array = [array]
  }

  if (!Array.isArray(array[0])) {
    array[0] = [array[0]]
  }

  const isRow = array.length === 1

  if (column_num === undefined) {
    if (isRow) {
      column_num = row_num
      row_num = 1
    } else {
      column_num = 1
    }
  }

  column_num = utils.getNumber(column_num)
  if (typeof column_num !== 'number') {
    return error.value
  }

  column_num = Math.trunc(column_num)

  row_num = utils.getNumber(row_num)
  if (typeof row_num !== 'number') {
    return error.value
  }

  row_num = Math.trunc(row_num)

  if (column_num < 0 || row_num < 0) {
    return error.value
  }

  const numOfRows = array.length
  const numOfColumns = array[0].length

  if (row_num > numOfRows || column_num > numOfColumns) {
    return error.ref
  }

  let result
  if (column_num === 0 && row_num === 0) {
    result = array
  } else if (column_num === 0) {
    result = [array[row_num - 1]]
  } else if (row_num === 0) {
    result = array.map((row) => [row[column_num - 1]])
  } else {
    return array[row_num - 1][column_num - 1]
  }

  if (result.length === 1 && result[0].length === 1) {
    return result[0][0]
  }
  return result
}

/**
 * Looks up values in a vector or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value A value that LOOKUP searches for in an array. The lookup_value argument can be a number, text, a logical value, or a name or reference that refers to a value.
 - If LOOKUP can't find the value of lookup_value, it uses the largest value in the array that is less than or equal to lookup_value.
 - If the value of lookup_value is smaller than the smallest value in the first row or column (depending on the array dimensions), LOOKUP returns the #N/A error value.
 * @param {*} array A range of values that contains text, numbers, or logical values that you want to compare with lookup_value. The array form of LOOKUP is very similar to the HLOOKUP and VLOOKUP functions. The difference is that HLOOKUP searches for the value of lookup_value in the first row, VLOOKUP searches in the first column, and LOOKUP searches according to the dimensions of array.
* @param {*} result_array Optional. A range that contains only one row or column. The result_array argument must be the same size as lookup_value. It has to be the same size.
 * @returns
 */
export function LOOKUP(lookup_value, array, result_array) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  if (lookup_value instanceof Error) {
    return lookup_value
  }

  if (!Array.isArray(array)) {
    array = [array]
  }
  if (!Array.isArray(array[0])) {
    array[0] = [array[0]]
  }

  if (array[0].length > array.length) {
    if (result_array === undefined) {
      result_array = array[array.length - 1]
    }

    array = array[0]
  } else {
    if (result_array === undefined) {
      result_array = array.map((row) => row[row.length - 1])
    }

    array = array.map((row) => row[0])
  }

  if (!Array.isArray(result_array)) {
    result_array = [result_array]
  }
  if (!Array.isArray(result_array[0])) {
    result_array[0] = [result_array[0]]
  }

  if (result_array.length > 1 && result_array[0].length > 1) {
    return error.na
  }

  array = utils.flatten(array)
  result_array = utils.flatten(result_array)

  const index = approximateBinarySearch(lookup_value, array)

  if (index === null) {
    return error.na
  }

  if (index >= result_array.length) {
    return error.ref
  }

  return result_array[index]
}

/**
 * Looks up values in a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value that you want to match in lookup_array. For example, when you look up someone's number in a telephone book, you are using the person's name as the lookup value, but the telephone number is the value you want.The lookup_value argument can be a value (number, text, or logical value) or a value reference to a number, text, or logical value.
 * @param {*} lookup_array The range of values being searched.
 * @param {*} match_type Optional. The number -1, 0, or 1. The match_type argument specifies how Excel matches lookup_value with values in lookup_array. The default value for this argument is 1.
 * @returns
 */
export function MATCH(lookup_value, lookup_array, match_type = 1) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  if (!(lookup_array instanceof Array)) {
    return error.na
  }

  if (lookup_value instanceof Error) {
    return lookup_value
  }
  if (match_type instanceof Error) {
    return error.ref
  }

  if (lookup_array.length > 1 && lookup_array[0].length > 1) {
    return error.na
  }

  lookup_array = utils.flatten(lookup_array)

  match_type = utils.getNumber(match_type)
  if (typeof match_type !== 'number') {
    return error.value
  }

  if (lookup_value === null) {
    lookup_value = 0
  }

  if (match_type > 0) {
    const result = approximateBinarySearch(lookup_value, lookup_array)

    return result !== null ? result + 1 : error.na
  }

  if (match_type === 0) {
    const length = lookup_array.length

    if (typeof lookup_value !== 'string') {
      for (let index = 0; index < length; index++) {
        if (lookup_array[index] === lookup_value) {
          return index + 1
        }
      }
    } else {
      const lowerCaseLookupValue = lookup_value.toLowerCase()

      for (let index = 0; index < length; index++) {
        if (
          typeof lookup_array[index] === 'string' &&
          evalExpression.stringCompare(lookup_array[index].toLowerCase(), lowerCaseLookupValue)
        ) {
          return index + 1
        }
      }
    }

    return error.na
  }

  const valueType = typeof lookup_value

  if (valueType === 'string') {
    lookup_value = lookup_value.toLowerCase()
  }

  let lowestValidValue = null

  const arrayLength = lookup_array.length
  for (let i = 0; i < arrayLength; i++) {
    if (valueType !== typeof lookup_array[i]) {
      continue
    }

    const comparisonValue = valueType === 'string' ? lookup_array[i].toLowerCase() : lookup_array[i]

    if (lookup_value > comparisonValue) {
      break
    }

    if (lookup_value < comparisonValue) {
      lowestValidValue = i
    } else {
      return i + 1
    }
  }

  return lowestValidValue !== null ? lowestValidValue + 1 : error.na
}

/**
 * Returns the number of rows in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array, an array formula, or a reference to a range of values for which you want the number of rows.
 * @returns
 */
export function ROWS(array) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (!(array instanceof Array)) {
    return 1
  }

  return array.length
}

/**
 * Returns a sorted array of the elements in an array. The returned array is the same shape as the provided array argument.
 *
 * Category: Lookup and reference
 *
 * @param {*} array Array to sort
 * @param {*} sort_index Optional. A number indicating the row or column to sort by
 * @param {*} sort_order Optional. A number indicating the desired sort order; 1 for ascending order (default), -1 for descending order
 * @param {*} by_col Optional. A logical value indicating the desired sort direction; FALSE to sort by row (default), TRUE to sort by column
 * @returns
 */
export function SORT(array, sort_index = 1, sort_order = 1, by_col = false) {
  if (!array || !Array.isArray(array)) {
    return error.na
  }

  if (array.length === 0) {
    return 0
  }

  sort_index = utils.parseNumber(sort_index)
  if (!sort_index || sort_index < 1) {
    return error.value
  }

  sort_order = utils.parseNumber(sort_order)
  if (sort_order !== 1 && sort_order !== -1) {
    return error.value
  }

  by_col = utils.parseBool(by_col)
  if (typeof by_col !== 'boolean') {
    return error.name
  }

  const sortArray = (arr) =>
    arr.sort((a, b) => {
      a = utils.parseString(a[sort_index - 1])
      b = utils.parseString(b[sort_index - 1])

      return sort_order === 1 ? (a < b ? sort_order * -1 : sort_order) : a > b ? sort_order : sort_order * -1
    })

  const matrix = utils.fillMatrix(array)
  const result = by_col ? utils.transpose(matrix) : matrix

  return sort_index >= 1 && sort_index <= result[0].length
    ? by_col
      ? utils.transpose(sortArray(result))
      : sortArray(result)
    : error.value
}

/**
 * Returns a sorted array of the elements in an array. The returned array is the same shape as the provided array argument.
 *
 * Category: Lookup and reference
 *
 * @param {*} array Array to sort
 * @param {*} sort_index Optional. A number indicating the row or column to sort by
 * @param {*} sort_order Optional. A number indicating the desired sort order; 1 for ascending order (default), -1 for descending order
 * @param {*} by_col Optional. A logical value indicating the desired sort direction; FALSE to sort by row (default), TRUE to sort by column
 * @returns
 */
export function SORTBY(array, ...sort) {
  if (arguments.length < 2) {
    return error.na
  }

  const anyError = utils.anyError(array, ...sort)

  if (anyError) {
    return anyError
  }

  if (
    !array ||
    !Array.isArray(array) ||
    sort.filter((_, i) => i % 2 == 1).some((e) => e !== 1 && e !== -1 && typeof e !== 'undefined')
  ) {
    return error.value
  }

  const sortLength = sort.length

  if (utils.getVariableType(arguments[1]) === 'column') {
    if (arguments[1].length !== array.length) {
      return error.value
    }

    array = array.sort((a, b) => {
      for (let i = 0; i < sortLength; i += 2) {
        let indexA = array.indexOf(a)
        let indexB = array.indexOf(b)
        let criteria = sort[i]
        let criteriaOrder = sort[i + 1] | 1

        if (criteria[indexA] > criteria[indexB]) {
          return criteriaOrder
        } else if (criteria[indexA] < criteria[indexB]) {
          return -criteriaOrder
        }
      }
      return 0
    })
  } else if (utils.getVariableType(arguments[1]) === 'line') {
    if (arguments[1][0].length !== array[0].length) {
      return error.value
    }

    const arrayLength = array.length

    for (let c = 0; c < arrayLength; c++) {
      let current = array[c]
      current = current.sort((a, b) => {
        for (let i = 0; i < sortLength; i += 2) {
          let indexA = current.indexOf(a)
          let indexB = current.indexOf(b)
          let criteria = sort[i][0]
          let criteriaOrder = sort[i + 1] | 1

          if (criteria[indexA] > criteria[indexB]) {
            return criteriaOrder
          } else if (criteria[indexA] < criteria[indexB]) {
            return -criteriaOrder
          }
        }
        return 0
      })
    }
  } else {
    return error.value
  }

  return array
}

/**
 * Returns the transpose of an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or range of values on a worksheet that you want to transpose. The transpose of an array is created by using the first row of the array as the first column of the new array, the second row of the array as the second column of the new array, and so on. If you're not sure of how to enter an array formula, see Create an array formula.
 * @returns
 */
export function TRANSPOSE(array) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (!Array.isArray(array)) {
    return array
  }

  const result = []

  const arrayLength = array.length
  const rowLength = array[0].length

  for (let x = 0; x < rowLength; x++) {
    result.push([])
  }

  for (let y = 0; y < arrayLength; y++) {
    const row = array[y]

    for (let x = 0; x < rowLength; x++) {
      const item = row[x]

      result[x].push(item)
    }
  }

  return result
}

const rowExistInArray = (targetRow, array) => {
  const numOfRows = array.length
  const numOfColumns = array[0].length

  let columnIndex

  for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
    const row = array[rowIndex]

    for (columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
      if (row[columnIndex] !== targetRow[columnIndex]) {
        break
      }
    }

    if (columnIndex === numOfColumns) {
      return true
    }
  }

  return false
}

const getArrayWithoutDuplicateRows = (array) => {
  const uniqueRows = [array[0]]

  const numOfRows = array.length
  for (let rowIndex = 1; rowIndex < numOfRows; rowIndex++) {
    const row = array[rowIndex]

    if (!rowExistInArray(row, uniqueRows)) {
      uniqueRows.push(row)
    }
  }

  return uniqueRows
}

const compareRows = (row1, row2) => {
  const numOfColumns = row1.length

  for (let columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
    if (row1[columnIndex] !== row2[columnIndex]) {
      return false
    }
  }

  return true
}

const filterNonDuplicateRows = (array) => {
  const result = []

  const numOfRows = array.length

  let rowIndex

  for (let targetRowIndex = 0; targetRowIndex < numOfRows; targetRowIndex++) {
    const targetRow = array[targetRowIndex]

    for (rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
      if (targetRowIndex === rowIndex) {
        continue
      }

      if (compareRows(targetRow, array[rowIndex])) {
        break
      }
    }

    if (rowIndex === numOfRows) {
      result.push(targetRow)
    }
  }

  return result
}

const columnExistInArray = (baseArray, baseColumnIndex, targetArray) => {
  const numOfRows = targetArray.length
  const numOfColumns = targetArray[0].length

  let rowIndex

  for (let columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
    for (rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
      if (baseArray[rowIndex][baseColumnIndex] !== targetArray[rowIndex][columnIndex]) {
        break
      }
    }

    if (rowIndex === numOfRows) {
      return true
    }
  }

  return false
}

const compareColumns = (array1, columnIndex1, array2, columnIndex2) => {
  const numOfRows = array1.length

  for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
    if (array1[rowIndex][columnIndex1] !== array2[rowIndex][columnIndex2]) {
      return false
    }
  }

  return true
}

const copyColumn = (baseArray, targetArray, columnIndex) => {
  const numOfRows = baseArray.length

  for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
    if (!targetArray[rowIndex]) {
      targetArray.push([])
    }

    targetArray[rowIndex].push(baseArray[rowIndex][columnIndex])
  }
}

const getArrayWithoutDuplicateColumns = (array) => {
  const uniqueColumns = []
  copyColumn(array, uniqueColumns, 0)

  const numOfColumns = array[0].length
  for (let columnIndex = 1; columnIndex < numOfColumns; columnIndex++) {
    if (!columnExistInArray(array, columnIndex, uniqueColumns)) {
      copyColumn(array, uniqueColumns, columnIndex)
    }
  }

  return uniqueColumns
}

const filterNonDuplicateColumns = (array) => {
  const result = []

  let columnIndex

  const numOfColumns = array[0].length

  for (let targetColumnIndex = 0; targetColumnIndex < numOfColumns; targetColumnIndex++) {
    for (columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
      if (targetColumnIndex === columnIndex) {
        continue
      }

      if (compareColumns(array, targetColumnIndex, array, columnIndex)) {
        break
      }
    }

    if (columnIndex === numOfColumns) {
      copyColumn(array, result, targetColumnIndex)
    }
  }

  return result
}

const copy = function (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    const numOfItems = obj.length

    const result = []

    for (let i = 0; i < numOfItems; i++) {
      result.push(copy(obj[i]))
    }

    return result
  }

  if (obj instanceof Error) {
    return obj
  }

  const entries = Object.entries(obj)
  const entriesLength = entries.length

  const result = {}

  for (let i = 0; i < entriesLength; i++) {
    const [key, value] = entries[i]

    result[key] = copy(value)
  }

  return result
}

/**
 * Returns a list of unique values in a list or range.
 *
 * Category: Lookup and reference
 *
 * @returns
 */
export function UNIQUE(array, by_col, exactly_once) {
  if (arguments.length === 0 || arguments.length > 3) {
    return error.na
  }

  if (typeof array === 'undefined') {
    return 0
  }

  if (!Array.isArray(array)) {
    array = [[array]]
  }

  if (typeof by_col === 'undefined') {
    by_col = false
  } else {
    by_col = utils.parseBool(by_col)

    if (typeof by_col !== 'boolean') {
      return by_col
    }
  }

  if (typeof exactly_once === 'undefined') {
    exactly_once = false
  } else {
    exactly_once = utils.parseBool(exactly_once)

    if (typeof exactly_once !== 'boolean') {
      return exactly_once
    }
  }

  let filterFunction = by_col
    ? exactly_once
      ? filterNonDuplicateColumns
      : getArrayWithoutDuplicateColumns
    : exactly_once
    ? filterNonDuplicateRows
    : getArrayWithoutDuplicateRows

  const result = copy(filterFunction(array))

  const numOfRows = result.length
  const numOfColumns = result[0].length

  for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
    const row = result[rowIndex]

    for (let columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
      if (row[columnIndex] === null) {
        row[columnIndex] = 0
      }
    }
  }

  return numOfRows === 1 && numOfColumns === 1 ? result[0][0] : result
}

/**
 * Looks in the first column of an array and moves across the row to return the value of a value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} col_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
export function VLOOKUP(lookup_value, table_array, col_index_num, range_lookup = true) {
  if (arguments.length < 3 || arguments.length > 4) {
    return error.na
  }

  if (lookup_value instanceof Error) {
    return lookup_value
  }

  if (col_index_num instanceof Error) {
    return col_index_num
  }

  if (range_lookup instanceof Error) {
    return range_lookup
  }

  if (!Array.isArray(table_array)) {
    table_array = [[table_array]]
  }

  range_lookup = utils.parseBool(range_lookup)
  if (typeof range_lookup !== 'boolean') {
    return error.value
  }

  const numOfRows = table_array.length

  let resultRow

  if (range_lookup) {
    const firstColumn = []

    for (let y = 0; y < numOfRows; y++) {
      firstColumn.push(table_array[y][0])
    }

    const rowIndex = approximateBinarySearch(lookup_value, firstColumn)

    if (rowIndex !== null) {
      resultRow = table_array[rowIndex]
    }
  } else {
    for (let y = 0; y < numOfRows; y++) {
      if (table_array[y][0] === lookup_value) {
        resultRow = table_array[y]
      }
    }
  }

  if (typeof resultRow === 'undefined') {
    return error.na
  }

  col_index_num = utils.getNumber(col_index_num)
  if (typeof col_index_num !== 'number' || col_index_num < 1) {
    return error.value
  }

  if (col_index_num > table_array[0].length) {
    return error.ref
  }

  return resultRow[col_index_num - 1]
}

const typePrecedenceMap = {
  number: 0,
  string: 1,
  boolean: 2
}

const getTypePrecedence = function (value) {
  const type = typeof value

  if (typeof typePrecedenceMap[type] !== 'undefined') {
    return typePrecedenceMap[type]
  }

  return value === null ? 4 : 3
}

const compare = function (value1, value2) {
  const typePrecedence1 = getTypePrecedence(value1)
  const typePrecedence2 = getTypePrecedence(value2)

  if (typePrecedence1 !== typePrecedence2) {
    return typePrecedence1 < typePrecedence2 ? -1 : 1
  }

  if (typeof value2 === 'string') {
    value2 = value2.toLowerCase()
  }

  if (value1 === value2) {
    return 0
  }

  return value1 < value2 ? -1 : 1
}

function xLookupBinarySearch(target, arr, match_mode) {
  let left = 0
  let right = arr.length - 1

  const targetIsString = typeof target === 'string'

  if (targetIsString) {
    target = target.toLowerCase()
  }

  while (left <= right) {
    let mid = Math.floor((left + right) / 2)

    const comparisonResult = compare(target, arr[mid])

    if (comparisonResult === 0) {
      while (mid > 0 && compare(target, arr[mid - 1]) === 0) {
        mid--
      }

      return mid
    }

    let changeLeft = comparisonResult > 0

    if (changeLeft) {
      // Continue search to the right half of the array
      left = mid + 1
    } else {
      // Continue search to the left half of the array
      right = mid - 1
    }
  }

  if (match_mode === 0) {
    return null
  }

  if (match_mode === -1) {
    if (right < 0) {
      return null
    }

    const comparisonResult = compare(target, arr[right])

    if (comparisonResult > 0) {
      return right
    }

    return right > 0 ? right - 1 : null
  }

  if (left >= arr.length) {
    return null
  }

  const comparisonResult = compare(target, arr[left])

  if (comparisonResult < 0) {
    return left
  }

  return left < arr.length - 1 ? left + 1 : null
}

function invertedXLookupBinarySearch(target, arr, match_mode) {
  let left = 0
  let right = arr.length - 1

  if (typeof target === 'string') {
    target = target.toLowerCase()
  }

  while (left <= right) {
    let mid = Math.floor((left + right) / 2)

    const comparisonResult = compare(target, arr[mid])

    if (comparisonResult === 0) {
      while (mid < arr.length - 1 && compare(target, arr[mid + 1]) === 0) {
        mid++
      }

      return mid
    }

    let changeLeft = comparisonResult < 0

    if (changeLeft) {
      // Continue search to the right half of the array
      left = mid + 1
    } else {
      // Continue search to the left half of the array
      right = mid - 1
    }
  }

  if (match_mode === 0) {
    return null
  }

  if (match_mode === -1) {
    if (left >= arr.length) {
      return null
    }

    const comparisonResult = compare(target, arr[left])

    if (comparisonResult > 0) {
      return left
    }

    return left > 0 ? left - 1 : null
  }

  if (right < 0) {
    return null
  }

  const comparisonResult = compare(target, arr[right])

  if (comparisonResult < 0) {
    return right
  }

  return right < arr.length - 1 ? right + 1 : null
}

// Searches the index of a given value. Works with XLOOKUP arguments: match_mode and search_mode
function lookupIndex(value, lookup_array, match_mode, reverse) {
  const arrLength = lookup_array.length

  const startIndex = reverse ? arrLength - 1 : 0
  const endIndex = reverse ? -1 : arrLength
  const step = reverse ? -1 : 1

  if (typeof value === 'string') {
    value = value.toLowerCase()
  }

  if (match_mode === 0) {
    for (let i = startIndex; i !== endIndex; i += step) {
      if (compare(value, lookup_array[i]) === 0) {
        return i
      }
    }
  } else if (match_mode === -1) {
    let closest_smaller = undefined
    let closest_smaller_pos = false

    for (let i = startIndex; i !== endIndex; i += step) {
      let current = lookup_array[i]

      const comparisonResult = compare(value, current)

      if (comparisonResult === 0) {
        return i
      }

      if (comparisonResult > 0 && (typeof closest_smaller === 'undefined' || compare(closest_smaller, current) < 0)) {
        closest_smaller = typeof current === 'string' ? current.toLowerCase() : current
        closest_smaller_pos = i
      }
    }

    return closest_smaller_pos
  } else if (match_mode === 1) {
    let closest_larger = undefined
    let closest_larger_pos = false

    for (let i = startIndex; i !== endIndex; i += step) {
      let current = lookup_array[i]

      const comparisonResult = compare(value, current)

      if (comparisonResult === 0) {
        return i
      }

      if (comparisonResult < 0 && (typeof closest_larger === 'undefined' || compare(closest_larger, current) > 0)) {
        closest_larger = typeof current === 'string' ? current.toLowerCase() : current
        closest_larger_pos = i
      }
    }

    return closest_larger_pos
  } else if (match_mode === 2) {
    if (typeof value !== 'string') {
      for (let i = startIndex; i !== endIndex; i += step) {
        if (lookup_array[i] === value) {
          return i
        }
      }
    } else {
      const lowerCaseLookupValue = value.toLowerCase()

      for (let i = startIndex; i !== endIndex; i += step) {
        if (
          typeof lookup_array[i] === 'string' &&
          evalExpression.stringCompare(lookup_array[i].toLowerCase(), lowerCaseLookupValue)
        ) {
          return i
        }
      }
    }
  }
}

const xLookupSearchFunctions = {
  2: xLookupBinarySearch,
  '-2': invertedXLookupBinarySearch,
  1: lookupIndex,
  '-1': function () {
    return lookupIndex.call(this, ...arguments, true)
  }
}

/**
 * Looks in the first column of an array and moves across the row to return the value of a value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value Required*. The value to search for *If omitted, XLOOKUP returns blank cells it finds in lookup_array.
 * @param {*} lookup_array Required. The array or range to search
 * @param {*} return_array Required. The array or range to return
 * @param {*} if_not_found Optional. Where a valid match is not found, return the [if_not_found] text you supply. If a valid match is not found, and [if_not_found] is missing, #N/A is returned
 * @param {*} match_mode Optional. Specify the match type: 0 - Exact match. If none found, return #N/A. This is the default. -1 - Exact match. If none found, return the next smaller item. 1 - Exact match. If none found, return the next larger item. 2 - A wildcard match where *, ?, and ~ have special meaning.
 * @param {*} search_mode Optional. Specify the search mode to use: 1 - Perform a search starting at the first item. This is the default. -1 - Perform a reverse search starting at the last item. 2 - Perform a binary search that relies on lookup_array being sorted in ascending order. If not sorted, invalid results will be returned. -2 - Perform a binary search that relies on lookup_array being sorted in descending order. If not sorted, invalid results will be returned.
 * @returns
 */
export function XLOOKUP(lookup_value, lookup_array, return_array, if_not_found, match_mode = 0, search_mode = 1) {
  if (arguments.length > 6 || arguments.length < 3 || utils.anyIsUndefined(lookup_value, lookup_array, return_array)) {
    return error.na
  }

  const anyError = utils.anyError(lookup_value, lookup_array, return_array, match_mode, search_mode)

  if (anyError) {
    return anyError
  }

  match_mode = utils.parseNumber(match_mode)
  search_mode = utils.parseNumber(search_mode)

  if (
    utils.anyIsError(match_mode, search_mode) ||
    ![-1, 0, 1, 2].includes(match_mode) ||
    ![-2, -1, 1, 2].includes(search_mode)
  ) {
    return error.value
  }

  if (match_mode === 2 && (search_mode === 2 || search_mode === -2)) {
    return error.value
  }

  const lookup_arrayType = utils.getVariableType(lookup_array)
  if (lookup_arrayType === 'matrix') {
    return error.value
  }

  let flattened
  if (lookup_arrayType === 'single') {
    flattened = [lookup_array]
  } else {
    if (!Array.isArray(return_array)) {
      return error.value
    }

    if (lookup_arrayType === 'line') {
      if (return_array[0].length !== lookup_array[0].length) {
        return error.value
      }
    } else {
      if (return_array.length !== lookup_array.length) {
        return error.value
      }
    }

    flattened = utils.flatten(lookup_array)
  }

  const type = utils.getVariableType(lookup_value)

  const searchFunction = xLookupSearchFunctions[search_mode]

  if (type === 'single') {
    const p = searchFunction(lookup_value, flattened, match_mode)

    if (typeof p !== 'number') {
      return typeof if_not_found !== 'undefined' ? if_not_found : error.na
    }

    if (lookup_arrayType === 'single') {
      if (Array.isArray(return_array) && return_array.length > 1 && return_array[0].length > 1) {
        return error.value
      }

      return return_array
    }

    if (utils.getVariableType(lookup_array) === 'line') {
      const result = utils.getColumnAsMatrix(return_array, p)

      return result.length === 1 ? result[0][0] : result
    }

    return return_array[p].length === 1 ? return_array[p][0] : [return_array[p]]
  }

  const value_rows = lookup_value.length
  const value_columns = lookup_value[0].length
  const result = []

  // Iterate through each value when lookup_value is a range
  for (let i = 0; i < value_rows; i++) {
    const resultRow = []
    result.push(resultRow)

    for (let j = 0; j < value_columns; j++) {
      if (lookup_arrayType === 'single') {
        if (Array.isArray(return_array) && return_array.length > 1 && return_array[0].length > 1) {
          resultRow.push(error.value)

          continue
        }
      }

      const p = searchFunction(lookup_value[i][j], flattened, match_mode)

      let resultItem

      if (typeof p !== 'number') {
        if (typeof if_not_found === 'undefined') {
          resultItem = error.na
        } else {
          resultItem = Array.isArray(if_not_found) ? if_not_found[0][0] : if_not_found
        }
      } else {
        if (lookup_arrayType === 'line') {
          resultItem = return_array[0][p]
        } else if (lookup_arrayType === 'column') {
          resultItem = return_array[p][0]
        } else {
          resultItem = Array.isArray(return_array) ? return_array[0][0] : return_array
        }
      }

      resultRow.push(resultItem)
    }
  }

  return result
}

/**
 * Extract a subset of data from a range based on specified criteria
 *
 * Category: Lookup and reference
 *
 * @param {*} sample The data set that the criteria will be applied to.
 * @param {*} conditions The criteria that the sample will be filtered on. Array of array of booleans.
 * @returns
 */
export function FILTER(array, include, if_empty) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  if (typeof array === 'undefined' || typeof include === 'undefined') {
    return error.value
  }

  const validationArrayType = utils.getVariableType(include)

  if (validationArrayType === 'matrix') {
    return error.value
  }

  const sourceArrayType = utils.getVariableType(array)

  if (validationArrayType === 'single') {
    if (sourceArrayType === 'matrix') {
      return error.value
    }

    const parsedValidation = utils.parseBool(include)

    if (typeof parsedValidation !== 'boolean') {
      return parsedValidation
    }

    if (parsedValidation) {
      if (array === null) {
        return 0
      }

      return array
    }

    if (typeof if_empty === 'undefined') {
      return error.calc
    }

    if (if_empty === null) {
      return 0
    }

    return if_empty
  }

  if (sourceArrayType === 'single') {
    return error.value
  }

  if (validationArrayType === 'line') {
    const validations = include[0]

    const numberOfCols = validations.length

    if (array[0].length !== numberOfCols) {
      return error.value
    }

    const numberOfRows = array.length

    const result = []
    for (let y = 0; y < numberOfRows; y++) {
      result.push([])
    }

    for (let x = 0; x < numberOfCols; x++) {
      const parsedValidation = utils.parseBool(validations[x])

      if (typeof parsedValidation !== 'boolean') {
        return parsedValidation
      } else if (parsedValidation) {
        for (let y = 0; y < numberOfRows; y++) {
          const item = array[y][x]

          result[y].push(item !== null ? item : 0)
        }
      }
    }

    if (result[0].length !== 0) {
      return result
    }

    if (typeof if_empty === 'undefined') {
      return error.calc
    }

    if (if_empty === null) {
      return 0
    }

    return if_empty
  }

  // validationArrayType === 'column'

  const numberOfRows = include.length

  if (array.length !== numberOfRows) {
    return error.value
  }

  const numberOfCols = array[0].length

  const result = []

  for (let y = 0; y < numberOfRows; y++) {
    const parsedValidation = utils.parseBool(include[y][0])

    if (typeof parsedValidation !== 'boolean') {
      return parsedValidation
    } else if (parsedValidation) {
      const row = array[y]

      const parsedRow = []
      for (let x = 0; x < numberOfCols; x++) {
        const item = row[x]

        parsedRow.push(item !== null ? item : 0)
      }

      result.push(parsedRow)
    }
  }

  if (result.length !== 0) {
    return result
  }

  if (typeof if_empty === 'undefined') {
    return error.calc
  }

  if (if_empty === null) {
    return 0
  }

  return if_empty
}

const startsWithNumber = /^-*\d/
const startWithLetterOrNumber = /^\w/

const a1Absolute = {
  1: function (row, column) {
    return '$' + column + '$' + row
  },
  2: function (row, column) {
    return column + '$' + row
  },
  3: function (row, column) {
    return '$' + column + row
  },
  4: function (row, column) {
    return column + row
  }
}

const r1c1Absolute = {
  1: function (row, column) {
    return 'R' + row + 'C' + column
  },
  2: function (row, column) {
    return 'R' + row + 'C[' + column + ']'
  },
  3: function (row, column) {
    return 'R[' + row + ']C' + column
  },
  4: function (row, column) {
    return 'R[' + row + ']C[' + column + ']'
  }
}

export function ADDRESS(row, column, absoluteNum = 1, a1Style = true, sheetName) {
  if (arguments.length < 2 || arguments.length > 5) {
    return error.na
  }

  const someError = utils.anyError(row, column, absoluteNum, a1Style, sheetName)
  if (someError) {
    return someError
  }

  row = utils.getNumber(row)
  column = utils.getNumber(column)

  if (typeof row === 'string') {
    row = row.toUpperCase()

    if (row === 'TRUE') {
      row = 1
    } else if (row === 'FALSE') {
      row = 0
    } else {
      return error.value
    }
  }

  if (typeof column === 'string') {
    column = column.toUpperCase()

    if (column === 'TRUE') {
      column = 1
    } else if (column === 'FALSE') {
      column = 0
    } else {
      return error.value
    }
  }

  row = Math.trunc(row)
  column = Math.trunc(column)

  if (row < 1 || column < 1) {
    return error.value
  }

  absoluteNum = utils.getNumber(absoluteNum)
  if (typeof absoluteNum !== 'number') {
    return error.value
  }

  absoluteNum = Math.trunc(absoluteNum)

  if (absoluteNum < 1 || absoluteNum > 4) {
    return error.value
  }

  a1Style = utils.parseBool(a1Style)
  if (typeof a1Style !== 'boolean') {
    return error.value
  }

  let result = ''

  if (sheetName !== undefined) {
    const sheetNameType = typeof sheetName

    if (sheetName === null) {
      sheetName = ''
    } else {
      if (sheetNameType !== 'string') {
        sheetName = sheetName.toString()
      }

      const upperCase = sheetName.toUpperCase()

      if (upperCase === 'TRUE' || upperCase === 'FALSE') {
        sheetName = "'" + upperCase + "'"
      } else if (
        sheetName.length > 0 &&
        (startsWithNumber.test(sheetName) || !startWithLetterOrNumber.test(sheetName))
      ) {
        sheetName = "'" + sheetName + "'"
      }
    }

    result = sheetName + '!'
  }

  if (a1Style) {
    const columnsLetter = advance.getColumnName(column - 1)

    return result + a1Absolute[absoluteNum](row, columnsLetter)
  }
  return result + r1c1Absolute[absoluteNum](row, column)
}

export function GETPIVOTDATA() {
  throw new Error('GETPIVOTDATA is not implemented')
}

export function RTD() {
  throw new Error('RTD is not implemented')
}

/**
 * Excludes a specified number of rows or columns from the start or end of an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The array from which to drop rows or columns.
 * @param {*} rows The number of rows to drop. A negative value drops from the end of the array.
 * @param {*} columns The number of columns to exclude. A negative value drops from the end of the array.
 * @returns
 */
export function DROP(array, rows = 0, columns = 0) {
  if (arguments.length < 2 || arguments.length > 3) {
    return error.na
  }

  if (array === undefined) {
    return error.value
  }

  const anyError = utils.anyError(rows, columns)

  if (anyError) {
    return anyError
  }

  rows = utils.parseNumber(rows)
  columns = utils.parseNumber(columns)

  if (utils.anyIsError(rows, columns)) {
    return error.value
  }

  const arrayVarType = utils.getVariableType(array)

  if (arrayVarType === 'single' && rows === 0 && columns === 0) {
    return utils.isDefined(array) ? array : 0
  } else if (arrayVarType === 'single') {
    return error.calc
  }

  let arrayRows = array.length
  let arrayColumns = array[0].length

  if (arrayRows > 64 || arrayColumns > 64) {
    return error.num
  }

  if (rows < 0) {
    arrayRows = arrayRows + rows
    rows = 0
  }

  if (columns < 0) {
    arrayColumns = arrayColumns + columns
    columns = 0
  }

  if (arrayRows <= rows || arrayColumns <= columns) {
    return error.calc
  }

  let result = []
  for (let i = rows; i < arrayRows; i++) {
    result.push(array[i].slice(columns))
  }

  if (result.length === 1 && result[0].length === 1) {
    return result[0][0]
  }

  return result
}

/**
 * Expands or pads an array to specified row and column dimensions.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The array to expand.
 * @param {*} rows The number of rows in the expanded array. If missing, rows will not be expanded.
 * @param {*} columns The number of columns in the expanded array. If missing, columns will not be expanded.
 * @param {*} padWith The value with which to pad. The default is #N/A.
 * @returns
 */
export function EXPAND(array, rows, columns, padWith = error.na) {
  if (arguments.length < 2 || arguments.length > 4) {
    return error.na
  }

  if (
    !utils.isDefined(array) ||
    utils.anyIsNull(rows, columns) ||
    utils.isArrayLike(rows) ||
    utils.isArrayLike(columns) ||
    utils.isArrayLike(padWith)
  ) {
    return error.value
  }

  const anyError = utils.anyError(rows, columns)

  if (anyError) {
    return anyError
  }

  const arrayVarType = utils.getVariableType(array)

  let arrayRows = utils.isArrayLike(array) ? array.length : 1
  let arrayColumns = array[0] ? array[0].length || 1 : 1
  rows = utils.isDefined(rows) ? rows : arrayRows
  columns = utils.isDefined(columns) ? columns : arrayColumns

  if (arrayRows > rows || arrayColumns > columns) {
    return error.value
  }

  if (arrayRows > 64 || arrayColumns > 64) {
    return error.num
  }

  let result = []

  if (arrayVarType === 'single') {
    for (let i = 0; i < rows; i++) {
      result[i] = Array(columns).fill(padWith)
      if (i === 0) {
        result[i][0] = array
      }
    }
  } else {
    for (let i = 0; i < rows; i++) {
      result[i] = []
      for (let j = 0; j < columns; j++) {
        result[i][j] = array[i] ? array[i][j] || padWith : padWith
      }
    }
  }

  if (result.length === 1 && result[0].length === 1) {
    return result[0][0]
  }

  return result
}

/**
 * Appends arrays horizontally and in sequence to return a larger array.
 *
 * Category: Lookup and reference
 *
 * @param {*} arrays The arrays to append.
 * @returns
 */
export function HSTACK(...arrays) {
  if (!arrays.length) {
    return error.na
  }

  if (utils.anyIsUndefined(...arrays)) {
    return error.value
  }

  let result = [],
    maxRows = 0,
    arraysLength = arrays.length

  for (let a = 0; a < arraysLength; a++) {
    let current = arrays[a]

    if (!utils.isArrayLike(current)) {
      current = [[current]]
    }

    if (maxRows < current.length) {
      maxRows = current.length
    }
  }

  for (let a = 0; a < arraysLength; a++) {
    let current = arrays[a]

    if (!utils.isArrayLike(current)) {
      current = [[current]]
    }

    let currentRows = current.length

    for (let i = 0; i < maxRows; i++) {
      if (!result[i]) {
        result[i] = []
      }
      if (i >= currentRows) {
        result[i] = result[i].concat(new Array(current[0].length).fill(error.na))
      } else {
        result[i] = result[i].concat(current[i])
      }
    }
  }

  if (~utils.flatten(result).indexOf(null)) {
    let rows = result.length
    let columns = result[0].length

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (result[i][j] === null) {
          result[i][j] = 0
        }
      }
    }
  }

  return result.length === 1 && result[0].length === 1 ? result[0][0] : result
}

/**
 * Returns the specified columns from an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The array containing the columns to be returned in the new array. Required.
 * @param  {*} col_num1 The first column to be returned. Required.
 * @param {...any} col_numN Additional columns to be returned. Optional.
 * @returns
 */
export function CHOOSECOLS(array, col_num1, ...col_numN) {
  if (!arguments.length || arguments.length === 1) {
    return error.na
  }

  if (utils.getVariableType(array) === 'single' || arguments[0] === undefined || arguments[1] === undefined) {
    return error.value
  }

  const result = []

  col_num1 = utils.parseNumber(col_num1)
  col_numN = col_numN.map((v) => utils.parseNumber(v))

  const indices = [col_num1, ...col_numN]
  const firstRow = array[0]

  for (let j = 0; j < indices.length; j++) {
    if (indices[j] instanceof Error) {
      return indices[j]
    }

    if (indices[j] < 1 || indices[j] > firstRow.length) {
      return error.value
    }
  }

  for (let i = 0; i < array.length; i++) {
    const row = array[i]
    const newRow = []

    for (let j = 0; j < indices.length; j++) {
      const index = indices[j]

      let v = row[index - 1]

      if (v === null) {
        v = utils.parseNumber(v)
      }

      newRow.push(v)
    }

    result.push(newRow)
  }

  return result
}

/**
 * Returns the specified columns from an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The array containing the columns to be returned in the new array. Required.
 * @param  {*} row_num1 The first row to be returned. Required.
 * @param {...any} row_numN Additional row numbers to be returned. Optional.
 * @returns
 */
export function CHOOSEROWS(array, row_num1, ...row_numN) {
  if (!arguments.length || arguments.length === 1) {
    return error.na
  }

  if (utils.getVariableType(array) === 'single' || arguments[0] === undefined || arguments[1] === undefined) {
    return error.value
  }

  row_num1 = utils.parseNumber(row_num1)
  row_numN = row_numN.map((v) => utils.parseNumber(v))

  const result = []
  const indices = [row_num1, ...row_numN]

  for (let j = 0; j < indices.length; j++) {
    if (indices[j] instanceof Error) {
      return indices[j]
    }

    if (typeof indices[j] !== 'number' || indices[j] < 1 || !array[indices[j] - 1]) {
      return error.value
    }
  }

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i]

    const row = array[index - 1].map((v) => {
      return v === null ? utils.parseNumber(v) : v
    })

    result.push(row)
  }

  return result
}

/**
 * converts a generic value based on its type to handle comparisons between types that follow excel's comparison logic.
 * In excel a boolean is considered greater than any primitive type e.g.
 * @param {*} valueA any javascript type
 * @returns
 */
const excelTypesComparator = function (valueA) {
  const isBoolean = (v) => typeof v === 'boolean'
  const isString = (v) => typeof v === 'string'

  const TBoolean = (bool) => {
    const isGreaterThan = (v) => {
      if (!isBoolean(v)) return true
      return bool > v
    }

    const isGreaterOrEqualThan = (v) => {
      if (!isBoolean(v)) return true
      return bool >= v
    }

    const isLessThan = (v) => {
      if (!isBoolean(v)) return false
      return bool < v
    }

    const isLessOrEqualThan = (v) => {
      if (!isBoolean(v)) return false
      return bool <= v
    }

    const isEqualsTo = (v) => {
      return bool === v
    }

    return {
      isGreaterThan,
      isGreaterOrEqualThan,
      isLessThan,
      isLessOrEqualThan,
      isEqualsTo
    }
  }

  const TString = (string) => {
    const isGreaterThan = (v) => {
      if (isBoolean(v)) return false
      if (!isString(v)) return true
      if (isString(v)) return string > v
    }

    const isGreaterOrEqualThan = (v) => {
      if (isBoolean(v)) return false
      if (!isString(v)) return true
      if (isString(v)) return string >= v
    }

    const isLessThan = (v) => {
      if (isBoolean(v)) return true
      if (!isString(v)) return false
      if (isString(v)) return string < v
    }

    const isLessOrEqualThan = (v) => {
      if (isBoolean(v)) return true
      if (!isString(v)) return false
      if (isString(v)) return string <= v
    }

    const isEqualsTo = (v) => {
      return v === string
    }

    return {
      isGreaterThan,
      isGreaterOrEqualThan,
      isLessThan,
      isLessOrEqualThan,
      isEqualsTo
    }
  }

  const TNumber = (number) => {
    const isGreaterThan = (v) => {
      if (isBoolean(v) || isString(v)) return false
      return number > v
    }

    const isGreaterOrEqualThan = (v) => {
      if (isBoolean(v) || isString(v)) return false
      return number >= v
    }

    const isLessThan = (v) => {
      if (isBoolean(v) || isString(v)) return true
      return number < v
    }

    const isLessOrEqualThan = (v) => {
      if (isBoolean(v) || isString(v)) return true
      return number <= v
    }

    const isEqualsTo = (v) => {
      return number === v
    }

    return {
      isGreaterThan,
      isGreaterOrEqualThan,
      isLessThan,
      isLessOrEqualThan,
      isEqualsTo
    }
  }

  const TGeneric = (genericValue) => {
    const isGreaterThan = (v) => {
      if (isBoolean(v) || isString(v)) return false
      return genericValue > v
    }

    const isGreaterOrEqualThan = (v) => {
      if (isBoolean(v) || isString(v)) return false
      return genericValue >= v
    }

    const isLessThan = (v) => {
      if (isBoolean(v) || isString(v)) return true
      return genericValue < v
    }

    const isLessOrEqualThan = (v) => {
      if (isBoolean(v) || isString(v)) return true
      return genericValue <= v
    }

    const isEqualsTo = (v) => {
      return genericValue === v
    }

    return {
      isGreaterThan,
      isGreaterOrEqualThan,
      isLessThan,
      isLessOrEqualThan,
      isEqualsTo
    }
  }

  const convertToType = (genericValue) => {
    switch (typeof genericValue) {
      case 'boolean':
        return TBoolean(genericValue)
      case 'number':
        return TNumber(genericValue)
      case 'string':
        return TString(genericValue)
      default:
        return TGeneric(genericValue)
    }
  }

  const T = convertToType(valueA)
  return T
}

/**
 * Performs a binary search to find a value that follows specified match mode and search mode rules.
 * @param {*} lookupValue The value to search for.
 * @param {*} lookupArray The range to consider for the search. This range must be a singular row or column.
 * @param {*} match_mode [OPTIONAL: 0 by default] The manner in which to find a match for the search_key.
 *  - 0 is for an exact match.
 *  - 1 is for an exact match or the next value that's greater than the search_key.
 *  - -1 is for an exact match or the next value that's lesser than the search_key.
 * @param {*} search_mode [OPTIONAL: 1 by default] The manner in which to search through the lookup range.
 * - 1 is to search from the first entry to the last.
 * - -1 is to search from the last entry to the first.
 * - 2 is to search through the range with binary search. The range needs to be sorted in ascending order first.
 * - -2 is to search through the range with binary search. The range needs to be sorted in descending order first.
 * @returns
 */
const xmatchCustomBinarySearch = (lookupValue, lookupArray, match_mode = 1, search_mode = 2) => {
  let low = 0
  let up = lookupArray.length - 1
  let mid = undefined
  let lastMatch = undefined
  let exactMatch = undefined

  // enquanto o indice inicial do array for menor que o maior indice
  while (low <= up) {
    // calcula o indice do meio do array
    mid = (low + up) >> 1

    if (match_mode === 0 && search_mode === 2) {
      // Caso "mid" seja exatamente igual ao valor procurado
      if (lookupArray[mid] === lookupValue) {
        // Atribuimos a referência do índice de match à variável lastMatch
        exactMatch = mid
        // Como é exatamente igual e supomos que a lista está ordenada em ordem crescente, então iremos olhar para os valores
        // anteriores de lookup_range, para verificar se existem outros possiveis matches menores ou iguais a lookupValue
        up = mid - 1
      }
      // Verificamos se a referência de mid em lookupArray é um valor menor que lookupValue
      else if (excelTypesComparator(lookupArray[mid]).isLessThan(lookupValue)) {
        // como supomos que a lista ser ordenada em ordem crescente, isso significa que o ponteiro
        // "low" deve apontar para o próximo valor de "mid", já que se a referencia de mid é menor que lookupValue, então,
        // teoricamente, os valores maiores estão à direita da lista.
        low = mid + 1
      }
      // Caso a referência de mid em lookupArray seja um valor maior que lookupValue
      else {
        up = mid - 1
      }
      continue
    }

    if (match_mode === 0 && search_mode === -2) {
      if (lookupArray[mid] === lookupValue) {
        exactMatch = mid
        // Encaminha a referência de low para a direita (valores menores)
        low = mid + 1
      } else if (excelTypesComparator(lookupArray[mid]).isLessThan(lookupValue)) {
        // Encaminha a referência de up para a esquerda (valores maiores)
        up = mid - 1
      } else {
        // Encaminha a referência de low para a direita (valores menores)
        low = mid + 1
      }
      continue
    }

    // supomos que a lista está ordenada em ordem crescente
    if (match_mode === 1 && search_mode === 2) {
      // Caso "mid" seja exatamente igual ao valor procurado
      if (lookupArray[mid] === lookupValue) {
        // Atribuimos a referência do índice de match à variável lastMatch
        exactMatch = mid
        // Como é exatamente igual e supomos que a lista está ordenada em ordem crescente, então iremos olhar para os valores
        // anteriores de lookup_range, para verificar se existem outros possiveis matches menores ou iguais a lookupValue
        up = mid - 1
      }
      // Verificamos se a referência de mid em lookupArray é um valor menor que lookupValue
      else if (excelTypesComparator(lookupArray[mid]).isLessThan(lookupValue)) {
        // como supomos que a lista ser ordenada em ordem crescente, isso significa que o ponteiro
        // "low" deve apontar para o próximo valor de "mid", já que se a referencia de mid é menor que lookupValue, então,
        // teoricamente, os valores maiores estão à direita da lista.
        low = mid + 1
      }
      // Caso a referência de mid em lookupArray seja um valor maior que lookupValue
      else {
        // Esse é um caso de match, portanto devemos guardar a referencia do match
        lastMatch = mid

        up = mid - 1
      }
      continue
    }

    // supomos que a lista está ordenada em ordem crescente e queremos achar um valor menor ou igual
    // ao valor de busca (match_mode = -1)
    if (match_mode === -1 && search_mode === 2) {
      if (lookupArray[mid] === lookupValue) {
        // Caso o valor seja igual, guardamos a referência deste match
        exactMatch = mid
        // Como supomos que a lista está ordenada em ordem crescente, significa que podem existir outros valores iguais a
        // searchKey anteriormente, como o caso [1, 1, 7, 7, 8, 9, 10], caso simplesmente retornassemos o match aqui, seria
        // retornado a posição 4, porém o primeiro match está na posição 3.
        up = mid - 1
      } else if (excelTypesComparator(lookupArray[mid]).isLessThan(lookupValue)) {
        // Caso o valor seja menor que searchKey, guardamos a referência deste match
        lastMatch = mid
        // Atualizamos low para ter a referência da proxima posição referente a mid, pois, se o valor de referência de mid
        // é menor que o valor procurado, isso significa que podem existir elementos posteriores que se aproximam mais
        // da chave de busca.
        low = mid + 1
      } else {
        // Caso o valor atual referente a mid seja maior que lookupValue, então podemos diminuir a referência do tamanho
        // do array (up) para mid - 1;
        up = mid - 1
      }
      continue
    }
    // supomos que a lista está ordenada em ordem decrescente
    if (match_mode === 1 && search_mode === -2) {
      if (lookupArray[mid] === lookupValue) {
        exactMatch = mid
        // Encaminha a referência de low para a direita (valores menores)
        low = mid + 1
      } else if (excelTypesComparator(lookupArray[mid]).isLessThan(lookupValue)) {
        // Encaminha a referência de up para a esquerda (valores maiores)
        up = mid - 1
      } else {
        lastMatch = mid
        // Encaminha a referência de low para a direita (valores menores)
        low = mid + 1
      }
      continue
    }

    if (match_mode === -1 && search_mode === -2) {
      if (lookupArray[mid] === lookupValue) {
        exactMatch = mid
        // Encaminha a referência de up para a esquerda (valores maiores)
        low = mid + 1
      } else if (excelTypesComparator(lookupArray[mid]).isLessThan(lookupValue)) {
        lastMatch = mid

        // Encaminha a referência de up para a esquerda (valores maiores)
        up = mid - 1
      } else {
        low = mid + 1
      }
    }
  }

  const referenceIndex = exactMatch !== undefined ? exactMatch : lastMatch !== undefined ? lastMatch : -1
  return referenceIndex
}

/**
 *
 * @param {*} searchKey The value to search for.
 * @param {*} lookup_range The range to consider for the search. This range must be a singular row or column.
 * @param {*} match_mode [OPTIONAL: 0 by default] The manner in which to find a match for the search_key.
 *  - 0 is for an exact match.
 *  - 1 is for an exact match or the next value that's greater than the search_key.
 *  - -1 is for an exact match or the next value that's lesser than the search_key.
 * @param {*} search_mode [OPTIONAL: 1 by default] The manner in which to search through the lookup range.
 * - 1 is to search from the first entry to the last.
 * - -1 is to search from the last entry to the first.
 * - 2 is to search through the range with binary search. The range needs to be sorted in ascending order first.
 * - -2 is to search through the range with binary search. The range needs to be sorted in descending order first.
 * @returns
 */
export function XMATCH(searchKey, lookup_range, match_mode = 0, search_mode = 1) {
  if (!arguments.length || arguments.length === 1) {
    return error.na
  }

  if (typeof searchKey === 'undefined') {
    searchKey = null
  }

  match_mode = utils.parseNumber(match_mode)
  search_mode = utils.parseNumber(search_mode)

  const isInvalidLookupRange = ['matrix', 'single'].includes(utils.getVariableType(lookup_range))

  if (utils.anyIsError(match_mode, search_mode) || isInvalidLookupRange) {
    return error.value
  }

  if (![0, 1, -1].includes(match_mode) || ![1, -1, 2, -2].includes(search_mode)) {
    return error.value
  }

  lookup_range = lookup_range.flat()

  searchKey = typeof searchKey === 'string' ? searchKey.toLowerCase() : searchKey

  lookup_range = lookup_range.map((v) => (typeof v === 'string' ? v.toLowerCase() : v))

  let orderedList
  let findedIndex

  const checkMatchModeRules = (value, searchKey) => {
    if (match_mode === 0) return excelTypesComparator(value).isEqualsTo(searchKey)
    else if (match_mode === 1) return excelTypesComparator(value).isGreaterOrEqualThan(searchKey)
    else if (match_mode === -1) return excelTypesComparator(value).isLessOrEqualThan(searchKey)
  }

  // is not a binary search
  if (![2, -2].includes(search_mode)) {
    orderedList = lookup_range
      .slice()
      .sort((a, b) => (excelTypesComparator(a).isLessThan(b) ? -1 : excelTypesComparator(a).isGreaterThan(b) ? 1 : 0))

    if ((match_mode === -1 && search_mode !== -1) || (match_mode === 1 && search_mode === -1)) {
      orderedList = orderedList.reverse()
    }

    if (search_mode === 1) {
      for (let i = 0; i < orderedList.length; i++) {
        if (checkMatchModeRules(orderedList[i], searchKey)) {
          findedIndex = lookup_range.indexOf(orderedList[i])
          break
        }
      }
    } else if (search_mode === -1) {
      for (let i = orderedList.length - 1; i >= 0; i--) {
        if (checkMatchModeRules(orderedList[i], searchKey)) {
          findedIndex = lookup_range.indexOf(orderedList[i])
          break
        }
      }
    }
  } else {
    orderedList = lookup_range
    findedIndex = xmatchCustomBinarySearch(searchKey, orderedList, match_mode, search_mode)
  }

  if (typeof findedIndex === 'number' && findedIndex >= 0) {
    return 1 + findedIndex
  }

  return error.na
}
