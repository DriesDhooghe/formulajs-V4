import { expect } from 'chai'

import * as error from '../src/utils/error.js'
import * as operator from '../src/operator.js'

describe('Operator', () => {
  it('ADD', () => {
    expect(operator.ADD(10, 4)).to.equal(14)
    expect(operator.ADD(1.2, 4)).to.equal(5.2)
    expect(operator.ADD(1, 'string')).to.equal(error.value)

    expect(operator.ADD()).to.equal(error.na)
    expect(operator.ADD(undefined, undefined)).to.equal(0)
    expect(operator.ADD(1, undefined)).to.equal(1)
    expect(operator.ADD(undefined, 1)).to.equal(1)
    expect(operator.ADD(null, undefined)).to.equal(0)
    expect(operator.ADD(undefined, null)).to.equal(0)
    expect(operator.ADD(null, null)).to.equal(0)
    expect(operator.ADD(null, 1)).to.equal(1)
    expect(operator.ADD(error.na, undefined)).to.equal(error.na)
    expect(operator.ADD(error.na, null)).to.equal(error.na)
    expect(operator.ADD(error.na, 1)).to.equal(error.na)
    expect(operator.ADD(true, false)).to.equal(1)
  })

  it('DIVIDE', () => {
    expect(operator.DIVIDE(10, 4)).to.equal(2.5)
    expect(operator.DIVIDE(12, -6)).to.equal(-2)
    expect(operator.DIVIDE(0, 0)).to.equal(error.div0)
    expect(operator.DIVIDE(1, 0)).to.equal(error.div0)
    expect(operator.DIVIDE(0, 1)).to.equal(0)
    expect(operator.DIVIDE(1, 'string')).to.equal(error.value)

    expect(operator.DIVIDE()).to.equal(error.na)
    expect(operator.DIVIDE(undefined, undefined)).to.equal(error.div0)
    expect(operator.DIVIDE(1, undefined)).to.equal(error.div0)
    expect(operator.DIVIDE(undefined, 1)).to.equal(0)
    expect(operator.DIVIDE(null, undefined)).to.equal(error.div0)
    expect(operator.DIVIDE(undefined, null)).to.equal(error.div0)
    expect(operator.DIVIDE(null, null)).to.equal(error.div0)
    expect(operator.DIVIDE(null, 1)).to.equal(0)
    expect(operator.DIVIDE(error.na, undefined)).to.equal(error.na)
    expect(operator.DIVIDE(error.na, null)).to.equal(error.na)
    expect(operator.DIVIDE(error.na, 1)).to.equal(error.na)
    expect(operator.DIVIDE(false, true)).to.equal(0)
  })

  it('EQ', () => {
    expect(operator.EQ(10, 10)).to.equal(true)
    expect(operator.EQ(1.2, 1.2)).to.equal(true)
    expect(operator.EQ('hello', 'jim')).to.equal(false)
    expect(operator.EQ('hello', 'hello')).to.equal(true)
    expect(operator.EQ(123, 'hello')).to.equal(false)
    expect(operator.EQ(true, true)).to.equal(true)
    expect(operator.EQ(false, false)).to.equal(true)
    expect(operator.EQ(false, 0)).to.equal(false)

    expect(operator.EQ()).to.equal(error.na)
    expect(operator.EQ(undefined, undefined)).to.equal(true)
    expect(operator.EQ(null, null)).to.equal(true)
    expect(operator.EQ(undefined, null)).to.equal(true)
    expect(operator.EQ(error.na)).to.equal(error.na)
    expect(operator.EQ(1, undefined)).to.equal(false)
    expect(operator.EQ(1, 'string')).to.equal(false)
  })

  it('GT', () => {
    expect(operator.GT(10, 4)).to.equal(true)
    expect(operator.GT(10, 10)).to.equal(false)
    expect(operator.GT(10, 12)).to.equal(false)
    expect(operator.GT()).to.equal(error.na)
    expect(operator.GT(undefined, undefined)).to.equal(false)
    expect(operator.GT(1, undefined)).to.equal(true)
    expect(operator.GT(0, undefined)).to.equal(false)
    expect(operator.GT(-1, undefined)).to.equal(false)
    expect(operator.GT(error.na)).to.equal(error.na)
    expect(operator.GT(1, 'string')).to.equal(false)
    expect(operator.GT('string', 2)).to.equal(true)
    expect(operator.GT('a', 'a')).to.equal(false)
    expect(operator.GT('a', 'ab')).to.equal(false)
    expect(operator.GT('ab', 'a')).to.equal(true)
  })

  it('GTE', () => {
    expect(operator.GTE(10, 4)).to.equal(true)
    expect(operator.GTE(10, 10)).to.equal(true)
    expect(operator.GTE(10, 12)).to.equal(false)
    expect(operator.GTE()).to.equal(error.na)
    expect(operator.GTE(undefined, undefined)).to.equal(true)
    expect(operator.GTE(1, undefined)).to.equal(true)
    expect(operator.GTE(0, undefined)).to.equal(true)
    expect(operator.GTE(-1, undefined)).to.equal(false)
    expect(operator.GTE(error.na)).to.equal(error.na)
    expect(operator.GTE(1, 'string')).to.equal(false)
    expect(operator.GTE('string', 2)).to.equal(true)
    expect(operator.GTE('a', 'a')).to.equal(true)
    expect(operator.GTE('a', 'ab')).to.equal(false)
    expect(operator.GTE('ab', 'a')).to.equal(true)
  })

  it('LT', () => {
    expect(operator.LT(10, 4)).to.equal(false)
    expect(operator.LT(10, 10)).to.equal(false)
    expect(operator.LT(10, 12)).to.equal(true)
    expect(operator.LT()).to.equal(error.na)
    expect(operator.LT(undefined, undefined)).to.equal(false)
    expect(operator.LT(1, undefined)).to.equal(false)
    expect(operator.LT(0, undefined)).to.equal(false)
    expect(operator.LT(-1, undefined)).to.equal(true)
    expect(operator.LT(error.na)).to.equal(error.na)
    expect(operator.LT(1, 'string')).to.equal(true)
    expect(operator.LT('string', 2)).to.equal(false)
    expect(operator.LT('a', 'a')).to.equal(false)
    expect(operator.LT('a', 'ab')).to.equal(true)
    expect(operator.LT('ab', 'a')).to.equal(false)
  })

  it('LTE', () => {
    expect(operator.LTE(10, 4)).to.equal(false)
    expect(operator.LTE(10, 10)).to.equal(true)
    expect(operator.LTE(10, 12)).to.equal(true)
    expect(operator.LTE()).to.equal(error.na)
    expect(operator.LTE(undefined, undefined)).to.equal(true)
    expect(operator.LTE(1, undefined)).to.equal(false)
    expect(operator.LTE(0, undefined)).to.equal(true)
    expect(operator.LTE(-1, undefined)).to.equal(true)
    expect(operator.LTE(error.na)).to.equal(error.na)
    expect(operator.LTE(1, 'string')).to.equal(true)
    expect(operator.LTE('string', 2)).to.equal(false)
    expect(operator.LTE('a', 'a')).to.equal(true)
    expect(operator.LTE('a', 'ab')).to.equal(true)
    expect(operator.LTE('ab', 'a')).to.equal(false)
  })

  it('MINUS', () => {
    expect(operator.MINUS(10, 4)).to.equal(6)
    expect(operator.MINUS(1.2, 4)).to.equal(-2.8)
    expect(operator.MINUS(1, 'string')).to.equal(error.value)
    expect(operator.MINUS()).to.equal(error.na)
    expect(operator.MINUS(undefined, undefined)).to.equal(0)
    expect(operator.MINUS(1, undefined)).to.equal(1)
    expect(operator.MINUS(undefined, 1)).to.equal(-1)
    expect(operator.MINUS(null, undefined)).to.equal(0)
    expect(operator.MINUS(undefined, null)).to.equal(0)
    expect(operator.MINUS(null, null)).to.equal(0)
    expect(operator.MINUS(null, 1)).to.equal(-1)
    expect(operator.MINUS(error.na, undefined)).to.equal(error.na)
    expect(operator.MINUS(error.na, null)).to.equal(error.na)
    expect(operator.MINUS(error.na, 1)).to.equal(error.na)
    expect(operator.MINUS(false, true)).to.equal(-1)
  })

  it('MULTIPLY', () => {
    expect(operator.MULTIPLY(10, 4)).to.equal(40)
    expect(operator.MULTIPLY(12, -6)).to.equal(-72)
    expect(operator.MULTIPLY(0, 0)).to.equal(0)
    expect(operator.MULTIPLY(1, 0)).to.equal(0)
    expect(operator.MULTIPLY(0, 1)).to.equal(0)
    expect(operator.MULTIPLY(1, 'string')).to.equal(error.value)
    expect(operator.MULTIPLY()).to.equal(error.na)
    expect(operator.MULTIPLY(undefined, undefined)).to.equal(0)
    expect(operator.MULTIPLY(1, undefined)).to.equal(0)
    expect(operator.MULTIPLY(undefined, 1)).to.equal(0)
    expect(operator.MULTIPLY(null, undefined)).to.equal(0)
    expect(operator.MULTIPLY(undefined, null)).to.equal(0)
    expect(operator.MULTIPLY(null, null)).to.equal(0)
    expect(operator.MULTIPLY(null, 1)).to.equal(0)
    expect(operator.MULTIPLY(error.na, undefined)).to.equal(error.na)
    expect(operator.MULTIPLY(error.na, null)).to.equal(error.na)
    expect(operator.MULTIPLY(error.na, 1)).to.equal(error.na)
    expect(operator.MULTIPLY(true, false)).to.equal(0)
  })

  it('NE', () => {
    expect(operator.NE(10, 10)).to.equal(false)
    expect(operator.NE(1.2, 1.2)).to.equal(false)
    expect(operator.NE('hello', 'jim')).to.equal(true)
    expect(operator.NE('hello', 'hello')).to.equal(false)
    expect(operator.NE(123, 'hello')).to.equal(true)
    expect(operator.NE(true, true)).to.equal(false)
    expect(operator.NE(false, false)).to.equal(false)
    expect(operator.NE(false, 0)).to.equal(true)
    expect(operator.NE()).to.equal(error.na)
    expect(operator.NE(undefined, undefined)).to.equal(false)
    expect(operator.NE(null, null)).to.equal(false)
    expect(operator.NE(undefined, null)).to.equal(false)
    expect(operator.NE(error.na)).to.equal(error.na)
    expect(operator.NE(1, undefined)).to.equal(true)
    expect(operator.NE(1, 'string')).to.equal(true)
  })

  it('POW', () => {
    expect(operator.POW(undefined, undefined)).to.equal(error.num)
    expect(operator.POW(undefined, 2)).to.equal(0)
    expect(operator.POW(5, undefined)).to.equal(1)
    expect(operator.POW(error.na, 2)).to.equal(error.na)
    expect(operator.POW(5, error.na)).to.equal(error.na)
    expect(operator.POW(5)).to.equal(error.na)
    expect(operator.POW(5, 2)).to.equal(25)
    expect(operator.POW(98.6, 3.2)).to.approximately(2401077.2220695773, 1e-9)
    expect(operator.POW(4, 5 / 4)).to.approximately(5.656854249492381, 1e-9)
    expect(operator.POW(-1, 0.5)).to.equal(error.num)
    expect(operator.POW(-1, 'invalid')).to.equal(error.value)
  })

  it('ISBETWEEN', () => {
    expect(operator.ISBETWEEN(2, 1, 3)).to.equal(true)
    expect(operator.ISBETWEEN(0, -1, 1)).to.equal(true)
    expect(operator.ISBETWEEN(1, 1, 1)).to.equal(true)
    expect(operator.ISBETWEEN(-1.5, -2, -1)).to.equal(true)
    expect(operator.ISBETWEEN(4, 1, 3)).to.equal(false)
    expect(operator.ISBETWEEN(-2, -1, 1)).to.equal(false)
    expect(operator.ISBETWEEN(0, 1, 3)).to.equal(false)
    expect(operator.ISBETWEEN(-1.5, -2, -2.5)).to.equal(false)
    expect(operator.ISBETWEEN(10, 1, 10, true, false)).to.equal(false)
    expect(operator.ISBETWEEN(1, 1, 10, false, false)).to.equal(false)
    expect(operator.ISBETWEEN(5, 1, 10, false, false)).to.equal(true)
    expect(operator.ISBETWEEN(1, 1, 10, false, true)).to.equal(false)
    expect(operator.ISBETWEEN(1, 1, 10, null, true)).to.equal(false)
    expect(operator.ISBETWEEN(1, 1, 10, 4, true)).to.equal(true)
    expect(operator.ISBETWEEN()).to.equal(error.na)
    expect(operator.ISBETWEEN(error.error, 1, 10)).to.equal(error.error)
    expect(operator.ISBETWEEN(error.na, 1, 10)).to.equal(error.na)
    expect(operator.ISBETWEEN(error.num, 1, 10)).to.equal(error.num)
    expect(operator.ISBETWEEN(error.value, 1, 10)).to.equal(error.value)
    expect(operator.ISBETWEEN(error.calc, 1, 10)).to.equal(error.calc)
    expect(operator.ISBETWEEN(error.error, undefined, undefined)).to.equal(error.error)
    expect(operator.ISBETWEEN(1, error.error, 10)).to.equal(error.error)
    expect(operator.ISBETWEEN(1, 1, error.error)).to.equal(error.error)
    expect(operator.ISBETWEEN(null, 1, 10)).to.equal(false)
    expect(operator.ISBETWEEN(1, null, 10)).to.equal(true)
    expect(operator.ISBETWEEN(1, 4, null)).to.equal(true)
    expect(operator.ISBETWEEN(undefined, 1, 10)).to.equal(false)
    expect(operator.ISBETWEEN(1, undefined, 10)).to.equal(true)
    expect(operator.ISBETWEEN(1, 10, undefined)).to.equal(true)
    expect(operator.ISBETWEEN(1, undefined, undefined)).to.equal(false)
    expect(operator.ISBETWEEN('string', 1, 10)).to.equal(false)
    expect(operator.ISBETWEEN(1, 'string', 10)).to.equal(error.num)
    expect(operator.ISBETWEEN(1, 10, 'string')).to.equal(error.num)
    expect(operator.ISBETWEEN(5, 1, 10, 'string')).to.equal(error.value)
    expect(operator.ISBETWEEN(5, 1, 10, true, 'string')).to.equal(error.value)
    expect(operator.ISBETWEEN('5', 1, 10)).to.equal(true)
    expect(
      operator.ISBETWEEN(
        [
          [-1, -2],
          [1, 2],
          [-1, 1]
        ],
        1,
        10
      )
    ).to.eql([
      [false, false],
      [true, true],
      [false, true]
    ])
    expect(
      operator.ISBETWEEN(
        [
          [-1, -2],
          ['string', '1'],
          [-1, 1]
        ],
        1,
        10
      )
    ).to.eql([
      [false, false],
      [false, false],
      [false, true]
    ])
    expect(
      operator.ISBETWEEN(
        [
          [-1, -2],
          [true, false],
          [-1, 1]
        ],
        1,
        10
      )
    ).to.eql([
      [false, false],
      [false, false],
      [false, true]
    ])
    expect(
      operator.ISBETWEEN(
        [
          [-1, -2],
          [
            [4, 5],
            [2, 3]
          ],
          [-1, 1]
        ],
        1,
        10
      )
    ).to.eql([
      [false, false],
      [false, false],
      [false, true]
    ])
    expect(
      operator.ISBETWEEN(
        [
          [-1, -2],
          [
            [4, 5],
            [2, 3]
          ],
          [-1, 1]
        ],
        [[1, 2]],
        10
      )
    ).to.equal(error.value)
    expect(
      operator.ISBETWEEN(
        [
          [-1, -2],
          [
            [4, 5],
            [2, 3]
          ],
          [-1, 1]
        ],
        1,
        10,
        [[1, 2]]
      )
    ).to.equal(error.value)
    expect(operator.ISBETWEEN(10, 1, 10, true, false, 1)).to.equal(error.na)
  })

  it('UMINUS', () => {
    expect(operator.UMINUS(10)).to.equal(-10)
    expect(operator.UMINUS(-5)).to.equal(5)
    expect(operator.UMINUS(0)).to.equal(0)
    expect(operator.UMINUS(true)).to.equal(-1)
    expect(operator.UMINUS(false)).to.equal(0)
    expect(operator.UMINUS('-1')).to.equal(1)
    expect(operator.UMINUS('1')).to.equal(-1)
    expect(operator.UMINUS(null)).to.equal(0)

    expect(operator.UMINUS()).to.equal(error.na)
    expect(operator.UMINUS(1, 2)).to.equal(error.na)
    expect(operator.UMINUS(1, 2, 3)).to.equal(error.na)
    expect(operator.UMINUS('string')).to.equal(error.value)

    expect(operator.UMINUS([[1], [2]])).to.equal(error.value)

    Object.values(error).forEach((err) => {
      expect(operator.UMINUS(err)).to.equal(err)
    })
  })

  it('UNARY_PERCENT', () => {
    expect(operator.UNARY_PERCENT(10)).to.equal(0.1)
    expect(operator.UNARY_PERCENT(1)).to.equal(0.01)
    expect(operator.UNARY_PERCENT(0.01)).to.equal(0.0001)
    expect(operator.UNARY_PERCENT(-10)).to.equal(-0.1)
    expect(operator.UNARY_PERCENT(100)).to.equal(1)
    expect(operator.UNARY_PERCENT(200)).to.equal(2)
    expect(operator.UNARY_PERCENT(50)).to.equal(0.5)

    expect(operator.UNARY_PERCENT(10, 10)).to.equal(error.na)
    expect(operator.UNARY_PERCENT()).to.equal(error.na)
    expect(operator.UNARY_PERCENT('50')).to.equal(0.5)
    expect(operator.UNARY_PERCENT(true)).to.equal(0.01)
    expect(operator.UNARY_PERCENT(false)).to.equal(0)
    expect(operator.UNARY_PERCENT(null)).to.equal(0)
    expect(operator.UNARY_PERCENT('true')).to.equal(error.value)
    expect(operator.UNARY_PERCENT('false')).to.equal(error.value)
    expect(operator.UNARY_PERCENT('string')).to.equal(error.value)
    expect(operator.UNARY_PERCENT(error.error)).to.equal(error.error)
    expect(operator.UNARY_PERCENT(error.value)).to.equal(error.value)
    expect(operator.UNARY_PERCENT(error.calc)).to.equal(error.calc)
    expect(operator.UNARY_PERCENT(error.num)).to.equal(error.num)
    expect(operator.UNARY_PERCENT(error.na)).to.equal(error.na)
    expect(operator.UNARY_PERCENT([[1], [1]])).to.equal(error.value)
    expect(
      operator.UNARY_PERCENT([
        [1, 10],
        [5, 30]
      ])
    ).to.equal(error.value)

    Object.values(error).forEach((err) => {
      expect(operator.UNARY_PERCENT(err)).to.equal(err)
    })
  })

  it('UPLUS', () => {
    expect(operator.UPLUS('10')).to.equal(10)
    expect(operator.UPLUS('-5')).to.equal(-5)
    expect(operator.UPLUS(0)).to.equal(0)
    expect(operator.UPLUS(-10.5)).to.equal(-10.5)
    expect(operator.UPLUS('10.5')).to.equal(10.5)
    expect(operator.UPLUS('')).to.equal('')
    expect(operator.UPLUS('string')).to.equal('string')
    expect(operator.UPLUS('1a')).to.equal('1a')
    expect(operator.UPLUS(null)).to.equal(null)
    expect(operator.UPLUS(true)).to.equal(true)
    expect(operator.UPLUS(false)).to.equal(false)

    expect(operator.UPLUS()).to.equal(error.na)
    expect(operator.UPLUS([[1]])).to.equal(error.value)
    expect(operator.UPLUS([['1']])).to.equal(error.value)

    expect(operator.UPLUS([[1], [2]])).to.equal(error.value)

    Object.values(error).forEach((err) => {
      expect(operator.UPLUS(err)).to.equal(err)
    })
  })
})
