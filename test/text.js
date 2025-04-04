import { expect } from 'chai'

import * as error from '../src/utils/error.js'
import * as text from '../src/text.js'

describe('Text', () => {
  it('ASC', () => {
    expect(text.ASC).to.throw('ASC is not implemented')
  })

  it('BAHTTEXT', () => {
    expect(text.BAHTTEXT).to.throw('BAHTTEXT is not implemented')
  })

  it('CHAR', () => {
    expect(text.CHAR(1)).to.equal(String.fromCharCode('1'))
    expect(text.CHAR(true)).to.equal(String.fromCharCode('1'))
    expect(text.CHAR(false)).to.equal(error.value)

    expect(text.CHAR('true')).to.equal(error.value)
    expect(text.CHAR('false')).to.equal(error.value)

    expect(text.CHAR(null)).to.equal(error.value)

    expect(text.CHAR(65)).to.equal('A')
    expect(text.CHAR(97)).to.equal('a')

    expect(text.CHAR('65')).to.equal('A')
    expect(text.CHAR('80')).to.equal('P')
    expect(text.CHAR('   80')).to.equal('P')
    expect(text.CHAR('   80    ')).to.equal('P')
    expect(text.CHAR('80    ')).to.equal('P')

    expect(text.CHAR(51)).to.equal('3')
    expect(text.CHAR(255)).to.equal('ÿ')
    expect(text.CHAR(1000)).to.equal('Ϩ')

    expect(text.CHAR(0)).to.equal(error.value)
    expect(text.CHAR(-1)).to.equal(error.value)
    expect(text.CHAR(-0.4)).to.equal(error.value)
    expect(text.CHAR(0.9)).to.equal(error.value)
    expect(text.CHAR(80.2)).to.equal('P')

    expect(text.CHAR(65, 55)).to.equal(error.na)
    expect(text.CHAR(error.na)).to.equal(error.na)
    expect(text.CHAR()).to.equal(error.na)

    expect(text.CHAR(undefined)).to.equal(error.value)
    expect(text.CHAR('invalid')).to.equal(error.value)

    expect(text.CHAR([65, 75, 80])).to.eql(['A', 'K', 'P'])
    expect(text.CHAR([[65], ['a'], [80]])).to.eql([['A'], [error.value], ['P']])
    expect(
      text.CHAR([
        [80, 60],
        [40, 40]
      ])
    ).to.eql([
      ['P', '<'],
      ['(', '(']
    ])

    expect(text.CHAR('')).to.equal(error.num)
  })

  it('CLEAN', () => {
    expect(text.CLEAN(null)).to.equal('')
    expect(text.CLEAN(undefined)).to.equal('')

    expect(text.CLEAN()).to.equal(error.na)
    expect(text.CLEAN('text1', 'text2')).to.equal(error.na)
    expect(text.CLEAN(100, 22)).to.equal(error.na)

    expect(text.CLEAN(error.na)).to.equal(error.na)
    expect(text.CLEAN('')).to.equal('')

    expect(text.CLEAN(true)).to.equal('true')
    expect(text.CLEAN(false)).to.equal('false')

    expect(text.CLEAN('true')).to.equal('true')
    expect(text.CLEAN('false')).to.equal('false')

    expect(text.CLEAN('text')).to.equal('text')
    expect(text.CLEAN(100)).to.equal('100')
    expect(text.CLEAN(0)).to.equal('0')
    expect(text.CLEAN(-1.8)).to.equal('-1.8')
    expect(text.CLEAN(-0.9)).to.equal('-0.9')
    expect(text.CLEAN(8.7)).to.equal('8.7')

    expect(text.CLEAN([10, 5, 2])).to.eql(['10', '5', '2'])
    expect(
      text.CLEAN([
        ['texto1', 'texto2'],
        ['texto3', 'texto4']
      ])
    ).to.eql([
      ['texto1', 'texto2'],
      ['texto3', 'texto4']
    ])

    expect(text.CLEAN('\n\nOla!\n\ntudo bem?')).to.equal('Ola!tudo bem?')
    expect(text.CLEAN('Monthly \t\t\tReport')).to.equal('Monthly Report')
  })

  it('CODE', () => {
    expect(text.CODE(null)).to.equal(error.value)
    expect(text.CODE(undefined)).to.equal(error.value)
    expect(text.CODE(error.na)).to.equal(error.na)

    expect(text.CODE('true')).to.equal(116)
    expect(text.CODE('false')).to.equal(102)
    expect(text.CODE(true)).to.equal(116)
    expect(text.CODE(false)).to.equal(102)

    expect(text.CODE('A')).to.equal(65)
    expect(text.CODE('a')).to.equal(97)
    expect(text.CODE('3')).to.equal(51)
    expect(text.CODE(3)).to.equal(51)
    expect(text.CODE(3.2)).to.equal(51)
    expect(text.CODE('-233')).to.equal(45)

    expect(text.CODE('P')).to.equal(80)
    expect(text.CODE('   P')).to.equal(32)
    expect(text.CODE('   P    ')).to.equal(32)
    expect(text.CODE('P    ')).to.equal(80)

    expect(text.CODE('invalid')).to.equal(105)

    expect(text.CODE(['A', 'K', 'P'])).to.eql([65, 75, 80])
    expect(text.CODE([['A'], [error.value], ['P']])).to.eql([[65], [error.value], [80]])
    expect(
      text.CODE([
        ['P', '<'],
        ['(', '(']
      ])
    ).to.eql([
      [80, 60],
      [40, 40]
    ])

    expect(text.CODE(3, 4)).to.equal(error.na)
    expect(text.CODE('3', '4')).to.equal(error.na)
    expect(text.CODE('Ϩ')).to.equal(1000)
    expect(text.CODE('')).to.equal(error.value)
    expect(text.CODE()).to.equal(error.na)
  })

  it('CONCATENATE', () => {
    expect(text.CONCATENATE(1)).to.equal('1')
    expect(text.CONCATENATE(false)).to.equal('FALSE')
    expect(text.CONCATENATE(true)).to.equal('TRUE')
    expect(text.CONCATENATE('false')).to.equal('false')
    expect(text.CONCATENATE('true')).to.equal('true')
    expect(text.CONCATENATE('text')).to.equal('text')

    expect(text.CONCATENATE(true, 'yes')).to.equal('TRUEyes')
    expect(text.CONCATENATE(false, 'no')).to.equal('FALSEno')
    expect(text.CONCATENATE(1, 'one')).to.equal('1one')

    expect(text.CONCATENATE('a', undefined, 'b')).to.equal('ab')
    expect(text.CONCATENATE('a', error.na, 'b')).to.equal(error.na)
    expect(text.CONCATENATE('hello', ' ', 'world')).to.equal('hello world')
    expect(text.CONCATENATE('text', 'text', 2, 4)).to.equal('texttext24')

    expect(text.CONCATENATE([[1]])).to.equal('1')
    expect(text.CONCATENATE([[5]])).to.equal('5')
    expect(text.CONCATENATE([['a']])).to.equal('a')
    expect(text.CONCATENATE([[null]])).to.equal('')

    // expect(text.CONCATENATE(['hello', ' my ', 'world'])).to.eql(['hello', ' my ', 'world'])
    // expect(text.CONCATENATE(['A', ', ', ' B', ', ', 'C'])).to.eql(['A', ', ', ' B', ', ', 'C'])
    // expect(text.CONCATENATE([415, ' text', ' 49'])).to.eql(['415', ' text', ' 49'])
    // expect(text.CONCATENATE([
    //   [415, 'text'],
    //   [14, 'asd']
    // ])).to.eql([
    //   ['415', 'text'],
    //   ['14', 'asd']
    // ])
    // expect(text.CONCATENATE([
    //   ['text1', 'text2'],
    //   ['text3', 'text4']
    // ],[
    //   ['text1', 'text2'],
    //   ['text3', 'text4']
    // ])).to.CONCATENATE([
    //   ['text1text1', 'text2text2'],
    //   ['text3text3', 'text4text4']
    // ])
    // expect(text.CONCATENATE(['text1', ' text2', ' text3'],[
    //   ['text1', 'text2'],
    //   ['text3', 'text4']
    // ])).to.eql([
    //   ['text1text1', 'text2text2', error.na],
    //   ['text1text3', 'text2text4', error.na]
    // ])

    // expect(text.CONCATENATE([
    //   ['text1', 'text2'],
    //   ['text3', 'text4']
    // ], ['text1', ' text2', ' text3'])).to.eql([
    //   ['text1text1', 'text2text2', error.na],
    //   ['text3text1', 'text4text2', error.na]
    // ])

    expect(text.CONCATENATE('')).to.equal('')
    expect(text.CONCATENATE(' ')).to.equal(' ')
    expect(text.CONCATENATE(null)).to.equal('')
    expect(text.CONCATENATE()).to.equal(error.na)
  })

  it('CONCAT', () => {
    expect(text.CONCAT('a', undefined, 'b')).to.equal('ab')
    expect(text.CONCAT('a', error.na, 'b')).to.equal(error.na)
    expect(text.CONCAT('hello', ' ', 'world')).to.equal('hello world')
    expect(text.CONCAT(['hello', ' my ', 'world'])).to.equal('hello my world')
    expect(text.CONCAT(1, 'one')).to.equal('1one')
    expect(text.CONCAT(true, 'yes')).to.equal('TRUEyes')
    expect(text.CONCAT(false, 'no')).to.equal('FALSEno')
  })

  it('DBCS', () => {
    expect(text.DBCS).to.throw('DBCS is not implemented')
  })

  it('DOLLAR', () => {
    expect(text.DOLLAR(1234.567)).to.equal('$1,234.57')
    expect(text.DOLLAR(1234.567, -2)).to.equal('$1,200')
    expect(text.DOLLAR(-1234.567, -2)).to.equal('$(1,200)')
    expect(text.DOLLAR(-0.123, 4)).to.equal('$(0.1230)')
    expect(text.DOLLAR(-99.888)).to.equal('$(99.89)')
    expect(text.DOLLAR('invalid')).to.equal(error.value)
    expect(text.DOLLAR(255)).to.equal('$255.00')
    expect(text.DOLLAR(367.456, 2)).to.equal('$367.46')
  })

  it('EXACT', () => {
    expect(text.EXACT(undefined, undefined)).to.equal(true)
    expect(text.EXACT(undefined, null)).to.equal(true)
    expect(text.EXACT(undefined, '')).to.equal(true)
    expect(text.EXACT(error.na, error.na)).to.equal(error.na)
    expect(text.EXACT('yes', 'yes')).to.equal(true)
    expect(text.EXACT('yes', 'no')).to.equal(false)
    expect(text.EXACT('yes', 'yes', 'yes')).to.equal(error.na)
    expect(text.EXACT()).to.equal(error.na)
    expect(text.EXACT('true', true)).to.equal(true)
    expect(text.EXACT('12', 12)).to.equal(true)
    expect(text.EXACT('Word', '0')).to.equal(false)
  })

  it('FIND', () => {
    const data = 'Miriam McGovern'

    expect(text.FIND()).to.equal(error.na)
    expect(text.FIND(null)).to.equal(error.na)
    expect(text.FIND('')).to.equal(error.na)
    expect(text.FIND('M')).to.equal(error.na)
    expect(text.FIND('M', data, 3, 4)).to.equal(error.na)

    expect(text.FIND('M', data, 'text')).to.equal(error.value)
    expect(text.FIND('x', 'zebra')).to.equal(error.value)
    expect(text.FIND('M', null)).to.equal(error.value)
    expect(text.FIND(null, null, null)).to.equal(error.value)

    expect(text.FIND(null, null)).to.equal(1)
    expect(text.FIND('cG', data)).to.equal(9)
    expect(text.FIND('M', data)).to.equal(1)
    expect(text.FIND(12, 312)).to.equal(2)
    expect(text.FIND('M', data, 3)).to.equal(8)
    expect(text.FIND('M', data, '3')).to.equal(8)
    expect(text.FIND('m', data, 3)).to.equal(6)
    expect(text.FIND(true, '12true')).to.equal(3)
    expect(text.FIND(12, '312')).to.equal(2)
    expect(text.FIND(12, 312)).to.equal(2)
    expect(text.FIND(12, 312)).to.equal(2)

    expect(text.FIND('Text', ['Hello', 'Number', 'Text1'])).to.eql([error.value, error.value, 1])

    expect(
      text.FIND('Brazil', [
        ['Hello', 'Text'],
        ['Brazil', 'I Love Brazil']
      ])
    ).to.eql([
      [error.value, error.value],
      [1, 8]
    ])
    expect(
      text.FIND(
        'Brazil',
        [
          ['Hello', 'Text'],
          ['Brazil', 'I Love Brasil']
        ],
        9
      )
    ).to.eql([
      [error.value, error.value],
      [error.value, error.value]
    ])
  })

  xit('FINDB', () => {
    expect(text.FINDB).to.throw('FINDB is not implemented')
  })

  it('FIXED', () => {
    expect(text.FIXED(1234.567, 1)).to.equal('1,234.6')
    expect(text.FIXED(21.45, 1)).to.equal('21.5')
    expect(text.FIXED(21.45)).to.equal('21.45')
    expect(text.FIXED(21.45, 3)).to.equal('21.450')
    expect(text.FIXED(1234.567, -1)).to.equal('1,230')
    expect(text.FIXED(-1234.567, -1, true)).to.equal('-1230')
    expect(text.FIXED(44.332)).to.equal('44.33')
    expect(text.FIXED('invalid')).to.equal(error.value)
    expect(text.FIXED(1234567.89, 3)).to.equal('1,234,567.890')
    expect(text.FIXED(123456.789, undefined, true)).to.equal('123456.79')
    expect(text.FIXED(12345.6789, -2)).to.equal('12,300')
    expect(text.FIXED(12134567.89, -3, 1)).to.equal('12135000')
    expect(text.FIXED(12345.789, 3 / 4)).to.equal('12,346')
    expect(text.FIXED(12345.789, -1.99)).to.equal('12,350')
    expect(text.FIXED(12345.789, 8 / 5)).to.equal('12,345.8')
    expect(text.FIXED(1234.56789, 5)).to.equal('1,234.56789')
    expect(text.FIXED(1234.567899, 5)).to.equal('1,234.56790')
    expect(text.FIXED(1234.5, 5)).to.equal('1,234.50000')
    expect(text.FIXED(123456.9, 4)).to.equal('123,456.9000')

    expect(text.FIXED()).to.equal(error.na)
    expect(text.FIXED(1, 1, false, true)).to.equal(error.na)

    expect(text.FIXED('1234.567', 1, true)).to.equal('1234.6')
    expect(text.FIXED(1234.567, '1', true)).to.equal('1234.6')
    expect(text.FIXED(1234.567, 1, 'true')).to.equal('1234.6')

    expect(text.FIXED('test', 1, true)).to.equal(error.value)
    expect(text.FIXED(1234.567, 'test', true)).to.equal(error.value)
    expect(text.FIXED(1234.567, 1, 'test')).to.equal(error.value)

    expect(text.FIXED(null, 1, true)).to.equal('0.0')
    expect(text.FIXED(1234.567, null)).to.equal('1,235')
    expect(text.FIXED(1234.567, 1, null)).to.equal('1,234.6')

    expect(text.FIXED(undefined, 1, true)).to.equal('0.0')
    expect(text.FIXED(1234.567, undefined, true)).to.equal('1234.57')
    expect(text.FIXED(1234.567, 1, undefined)).to.equal('1,234.6')

    Object.values(error).forEach((err) => {
      expect(text.FIXED(err, 0)).to.equal(err)
      expect(text.FIXED(1234.5678, err)).to.equal(err)
      expect(text.FIXED(1234.5678, 0, err)).to.equal(err)
    })
  })

  it('LEFT', () => {
    expect(text.LEFT('Sale Price', 4, 3)).to.equal(error.na)
    expect(text.LEFT()).to.equal(error.na)

    expect(text.LEFT('')).to.equal('')
    expect(text.LEFT(null)).to.equal('')

    expect(text.LEFT('Sweeden')).to.equal('S')
    expect(text.LEFT(true)).to.equal('t')
    expect(text.LEFT(42)).to.equal('4')
    expect(text.LEFT(4.2)).to.equal('4')
    expect(text.LEFT(4.2, 2)).to.equal('4.')
    expect(text.LEFT('Sale Price', 4)).to.equal('Sale')

    expect(text.LEFT(error.na, 2)).to.equal(error.na)
    expect(text.LEFT('text', error.na)).to.equal(error.na)

    expect(text.LEFT(5, 'Sale Price')).to.equal(error.value)
    expect(text.LEFT('something', 'invalid')).to.equal(error.value)

    expect(text.LEFT(null, null)).to.equal('')
    expect(text.LEFT(null, 3)).to.equal('')

    expect(text.LEFT(['text1', 'text2', 'text3'])).to.eql(['t', 't', 't'])
    expect(text.LEFT([null, 'text2', 'text3'])).to.eql(['', 't', 't'])
    //expect(text.LEFT(['text1', 'text2', 'text3'], ['text1', 'text2', 'text3'])).to.eql([error.value, error.value, error.value])
    //expect(text.LEFT(['text1', 'text2', 'text3'], [1, 2, 3])).to.eql(['t', 'te', 'tex'])

    expect(
      text.LEFT([
        ['text', 'string'],
        ['date', 'number']
      ])
    ).to.eql([
      ['t', 's'],
      ['d', 'n']
    ])
    expect(
      text.LEFT(
        [
          ['text', 'string'],
          ['date', 'number']
        ],
        4
      )
    ).to.eql([
      ['text', 'stri'],
      ['date', 'numb']
    ])
  })

  xit('LEFTB', () => {
    expect(text.LEFTB).to.throw('LEFTB is not implemented')
  })

  it('LEN', () => {
    expect(text.LEN(true)).to.equal(4)
    expect(text.LEN('four')).to.equal(4)
    expect(text.LEN('$1,000.00')).to.equal(9)
    expect(text.LEN('25-Jun-21')).to.equal(9)
    expect(text.LEN(1000)).to.equal(4)
    expect(text.LEN(-1.75)).to.equal(5)
    expect(text.LEN(123)).to.equal(3)

    expect(text.LEN('')).to.equal(0)
    expect(text.LEN(null)).to.equal(0)

    expect(text.LEN('four', 'text')).to.equal(error.na)
    expect(text.LEN()).to.equal(error.na)
    expect(text.LEN(error.na)).to.equal(error.na)

    expect(text.LEN([['text']])).to.eql([[4]])
    expect(text.LEN([[null]])).to.eql([[0]])
    expect(text.LEN([[1]])).to.eql([[1]])
    expect(text.LEN([1, 2, 3, 4, 5])).to.eql([1, 1, 1, 1, 1])

    expect(
      text.LEN([
        ['text', 'string'],
        ['date', 'number']
      ])
    ).to.eql([
      [4, 6],
      [4, 6]
    ])
  })

  xit('LENB', () => {
    expect(text.LENB).to.throw('LENB is not implemented')
  })

  it('LOWER', () => {
    expect(text.LOWER(undefined)).to.equal('')
    expect(text.LOWER('')).to.equal('')
    expect(text.LOWER(null)).to.equal('')

    expect(text.LOWER()).to.equal(error.na)
    expect(text.LOWER(error.na)).to.equal(error.na)

    expect(text.LOWER('A Title Case')).to.equal('a title case')
    expect(text.LOWER('abcd')).to.equal('abcd')
    expect(text.LOWER('ABcd')).to.equal('abcd')
    expect(text.LOWER('ABCD')).to.equal('abcd')
    expect(text.LOWER(true)).to.equal('true')
    expect(text.LOWER(false)).to.equal('false')
    expect(text.LOWER(1)).to.equal('1')

    expect(text.LOWER('ABCD', 'FG')).to.equal(error.na)

    expect(text.LOWER(['Text1', 'Text2', 'Text3'])).to.eql(['text1', 'text2', 'text3'])
    expect(
      text.LOWER([
        ['Text1', 'Text2'],
        ['Text3', 'Text4']
      ])
    ).to.eql([
      ['text1', 'text2'],
      ['text3', 'text4']
    ])
  })

  it('MID', () => {
    const data = 'Fluid Flow'

    expect(text.MID(0)).to.equal(error.na)
    expect(text.MID('')).to.equal(error.na)
    expect(text.MID()).to.equal(error.na)
    expect(text.MID(data)).to.equal(error.na)
    expect(text.MID(data)).to.equal(error.na)
    expect(text.MID(data, 1)).to.equal(error.na)
    expect(text.MID(data, 1, 5, 7)).to.equal(error.na)

    expect(text.MID(1, 5, data)).to.equal(error.value)

    expect(text.MID(error.na, 1, 5)).to.equal(error.na)
    expect(text.MID(data, error.na, 5)).to.equal(error.na)
    expect(text.MID(data, 1, error.na)).to.equal(error.na)

    expect(text.MID(data, 1, 5)).to.equal('Fluid')
    expect(text.MID(true, 1, 2)).to.eql('TR')
    expect(text.MID(false, 1, 3)).to.eql('FAL')

    expect(text.MID(data, 7, 20)).to.equal('Flow')
    expect(text.MID(data, 20, 50)).to.equal('')
    expect(text.MID(412, 1, 2)).to.equal('41')
    expect(text.MID(4.12, 1, 2)).to.equal('4.')
    expect(text.MID(4.12, 2, 1)).to.equal('.')

    expect(text.MID(null, 1, 2)).to.equal('')
    expect(text.MID(4.12, null, 2)).to.equal(error.value)
    expect(text.MID(4.12, 1, null)).to.equal('')

    expect(text.MID(['text1', 'text2', 'text3'], 1, 1)).to.eql(['t', 't', 't'])
    //expect(text.MID(['text1', 'text2'], ['text3', 'text4'], ['text5', 'text6'])).to.eql([error.value, error.value])
    //expect(text.MID(['text1', 'text2'], [4, 2], [3, 4])).to.eql(['t1', 'ext2'])

    expect(
      text.MID(
        [
          ['text1', 'text2'],
          ['text3', 'text4']
        ],
        1,
        2
      )
    ).to.eql([
      ['te', 'te'],
      ['te', 'te']
    ])
  })

  xit('MIDB', () => {
    expect(text.MIDB).to.throw('MIDB is not implemented')
  })

  describe('NUMBERVALUE', () => {
    it('should parse text value', () => {
      expect(text.NUMBERVALUE('2.500,27', ',', '.')).to.equal(2500.27)
      expect(text.NUMBERVALUE('250', ',', '.')).to.equal(250)
      expect(text.NUMBERVALUE('', ',', '.')).to.equal(0)
      // expect(text.NUMBERVALUE("3.5%")).to.equal(.035);
    })

    it('should work with empty inputs', () => {
      expect(text.NUMBERVALUE(null, ',', '.')).to.equal(0)
      expect(text.NUMBERVALUE(undefined, ',', '.')).to.equal(0)
    })

    it('should work with number input', () => {
      expect(text.NUMBERVALUE(3)).to.equal(3)
    })

    it('should throw an error in case of text input different from string', () => {
      expect(text.NUMBERVALUE(true)).to.equal(error.na)
    })
  })

  it('PHONETIC', () => {
    expect(text.PHONETIC).to.throw('PHONETIC is not implemented')
  })

  it('PROPER', () => {
    expect(text.PROPER(undefined)).to.equal('')
    expect(text.PROPER('')).to.equal('')
    expect(text.PROPER(null)).to.equal('')

    expect(text.PROPER()).to.equal(error.na)
    expect(text.PROPER(error.na)).to.equal(error.na)

    expect(text.PROPER('a title case')).to.equal('A Title Case')
    expect(text.PROPER(true)).to.equal('True')
    expect(text.PROPER(false)).to.equal('False')
    expect(text.PROPER(90)).to.equal('90')
    expect(text.PROPER(0)).to.equal('0')

    expect(text.PROPER('a title case', 'text')).to.equal(error.na)

    expect(text.PROPER(['text1', 'text2', 'text3'])).to.eql(['Text1', 'Text2', 'Text3'])
    expect(
      text.PROPER([
        ['text1', 'text2'],
        ['text3', 'text4']
      ])
    ).to.eql([
      ['Text1', 'Text2'],
      ['Text3', 'Text4']
    ])
  })

  it('REGEXEXTRACT', () => {
    expect(text.REGEXEXTRACT('(Content) between brackets', '\\(([A-Za-z]+)\\)')).to.equal('Content')
    expect(text.REGEXEXTRACT('The price today is $826.25', '[0-9]+.[0-9]+[0-9]+')).to.equal('826.25')
    expect(text.REGEXEXTRACT('Google Doc 101', '[0-9]+')).to.equal('101')
    expect(text.REGEXEXTRACT('1 test 20', '(\\d+)\\D+(\\d+)')).to.eql([['1', '20']])
    expect(text.REGEXEXTRACT('Google Doc 101', 'a')).to.equal(error.na)

    expect(text.REGEXEXTRACT('', '\\D+')).to.equal(error.na)
    expect(text.REGEXEXTRACT(null, '\\D+')).to.equal(error.na)
    expect(text.REGEXEXTRACT(undefined, '\\D+')).to.equal(error.na)
    expect(text.REGEXEXTRACT('1 test 20', '')).to.equal('')
    expect(text.REGEXEXTRACT('1 test 20', null)).to.equal('')
    expect(text.REGEXEXTRACT('1 test 20', undefined)).to.equal('')

    expect(text.REGEXEXTRACT(1, 'e')).to.equal(error.value)
    expect(text.REGEXEXTRACT('test', 1)).to.equal(error.value)
    expect(text.REGEXEXTRACT(true, 'e')).to.equal(error.value)
    expect(text.REGEXEXTRACT('test', true)).to.equal(error.value)
    expect(text.REGEXEXTRACT('1 test 20', [['(\\d+)\\D+(\\d+)', '(\\d+)\\D+']])).to.equal(error.value)
    expect(text.REGEXEXTRACT([['1 test 20', '1 test 18']], '(\\d+)\\D+(\\d+)')).to.equal(error.value)
    expect(text.REGEXEXTRACT([['1 test 20', '1 test 18']], [['(\\d+)\\D+(\\d+)', '(\\d+)\\D+']])).to.equal(error.value)

    expect(text.REGEXEXTRACT('test', 'e', true)).to.equal(error.na)
    expect(text.REGEXEXTRACT('Google Doc 101')).to.equal(error.na)
    expect(text.REGEXEXTRACT()).to.equal(error.na)

    Object.values(error).forEach((err) => {
      expect(text.REGEXEXTRACT('test', err)).to.equal(err)
      expect(text.REGEXEXTRACT(err, 'e')).to.equal(err)
    })
  })

  it('REGEXREPLACE', () => {
    expect(text.REGEXREPLACE('(Content) between brackets', '\\([A-Za-z]+\\)', 'Me')).to.equal('Me between brackets')
    expect(text.REGEXREPLACE('(Content) between brackets', '(([A-Za-z]+))', 'Me')).to.equal('(Me) Me Me')
    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', 'replacement')).to.equal('1replacementreplacement')
    expect(text.REGEXREPLACE('1 test 20 something 3', '(\\D+)(\\d+)', 'replacement')).to.equal(
      '1replacementreplacement'
    )

    expect(text.REGEXREPLACE('', '\\D+\\d+', 'replacement')).to.equal('')
    expect(text.REGEXREPLACE(null, '\\D+\\d+', 'replacement')).to.equal('')
    expect(text.REGEXREPLACE(undefined, '\\D+\\d+', 'replacement')).to.equal('')

    expect(text.REGEXREPLACE('1 test', '', 'a')).to.equal('a1a ataeasata')
    expect(text.REGEXREPLACE('1 test', null, 'a')).to.equal('a1a ataeasata')
    expect(text.REGEXREPLACE('1 test', undefined, 'a')).to.equal('a1a ataeasata')

    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', '')).to.equal('1')
    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', null)).to.equal('1')
    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', undefined)).to.equal('1')

    expect(text.REGEXREPLACE(1, '\\D+\\d+', 'replacement')).to.equal(error.value)
    expect(text.REGEXREPLACE(true, '\\D+\\d+', 'replacement')).to.equal(error.value)
    expect(text.REGEXREPLACE('1 test 20 something 3', 1, 'replacement')).to.equal(error.value)
    expect(text.REGEXREPLACE('1 test 20 something 3', true, 'replacement')).to.equal(error.value)
    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', 1)).to.equal(error.value)
    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', true)).to.equal(error.value)
    expect(text.REGEXREPLACE([['1 test 20 something 3', '2 test 21 something 4']], '\\D+\\d+', 'replacement')).to.equal(
      error.value
    )
    expect(text.REGEXREPLACE('1 test 20 something 3', [['\\D+\\d+', '\\d+']], 'replacement')).to.equal(error.value)
    expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', [['replacement', 'replace']])).to.equal(error.value)

    expect(text.REGEXREPLACE('(Content) between brackets', '(([A-Za-z]+))', 'Me', true)).to.equal(error.na)
    expect(text.REGEXREPLACE('(Content) between brackets', '(([A-Za-z]+))')).to.equal(error.na)
    expect(text.REGEXREPLACE('(Content) between brackets')).to.equal(error.na)
    expect(text.REGEXREPLACE()).to.equal(error.na)

    Object.values(error).forEach((err) => {
      expect(text.REGEXREPLACE(err, '\\D+\\d+', 'replacement')).to.equal(err)
      expect(text.REGEXREPLACE('1 test 20 something 3', err, 'replacement')).to.equal(err)
      expect(text.REGEXREPLACE('1 test 20 something 3', '\\D+\\d+', err)).to.equal(err)
    })
  })

  it('REGEXMATCH', () => {
    expect(text.REGEXMATCH('test 100', '\\D\\d')).to.equal(true)
    expect(text.REGEXMATCH('test 100', '^\\D\\d$')).to.equal(false)
    expect(text.REGEXMATCH('test 100', '^\\D+\\d+$')).to.equal(true)

    expect(text.REGEXMATCH('test 100', null)).to.equal(true)
    expect(text.REGEXMATCH('test 100', '')).to.equal(true)
    expect(text.REGEXMATCH('test 100', undefined)).to.equal(true)

    expect(text.REGEXMATCH(null, null)).to.equal(true)
    expect(text.REGEXMATCH(null, '')).to.equal(true)
    expect(text.REGEXMATCH(null, undefined)).to.equal(true)

    expect(text.REGEXMATCH('', '')).to.equal(true)
    expect(text.REGEXMATCH('', undefined)).to.equal(true)
    expect(text.REGEXMATCH('', null)).to.equal(true)

    expect(text.REGEXMATCH(undefined, '')).to.equal(true)
    expect(text.REGEXMATCH(undefined, null)).to.equal(true)
    expect(text.REGEXMATCH(undefined, undefined)).to.equal(true)

    expect(text.REGEXMATCH(null, '\\D\\d')).to.equal(false)
    expect(text.REGEXMATCH(undefined, '\\D\\d')).to.equal(false)
    expect(text.REGEXMATCH('', '\\D\\d')).to.equal(false)

    expect(text.REGEXMATCH(1, '^\\D+\\d+$')).to.equal(error.value)
    expect(text.REGEXMATCH(true, '^\\D+\\d+$')).to.equal(error.value)
    expect(text.REGEXMATCH('test 100', 1)).to.equal(error.value)
    expect(text.REGEXMATCH('test 100', true)).to.equal(error.value)
    expect(text.REGEXMATCH([['test 100', 'test 101']], '^\\D+\\d+$')).to.equal(error.value)
    expect(text.REGEXMATCH('test 100', [['^\\D+\\d+$', '\\d+']])).to.equal(error.value)

    expect(text.REGEXMATCH('test 100', '\\D\\d', true)).to.equal(error.na)
    expect(text.REGEXMATCH('test 100')).to.equal(error.na)
    expect(text.REGEXMATCH()).to.equal(error.na)

    Object.values(error).forEach((err) => {
      expect(text.REGEXMATCH(err, '^\\D+\\d+$')).to.equal(err)
      expect(text.REGEXMATCH('test 100', err)).to.equal(err)
    })
  })

  it('REPLACE', () => {
    expect(text.REPLACE('abcdefghijk', 6, 5, '*')).to.equal('abcde*k')
    expect(text.REPLACE('2009', 3, 2, '10')).to.equal('2010')
    expect(text.REPLACE('123456', 1, 3, '@')).to.equal('@456')

    expect(text.REPLACE(123456, 1, 3, '@')).to.equal('@456')
    expect(text.REPLACE(true, 1, 3, '@')).to.equal('@E')
    expect(text.REPLACE(true, 1, 2, false)).to.equal('FALSEUE')
    expect(text.REPLACE(true, 1, 0, false)).to.equal('FALSETRUE')

    expect(text.REPLACE(true, '1', '2', false)).to.equal('FALSEUE')
    expect(text.REPLACE(true, true, false, false)).to.equal('FALSETRUE')
    expect(text.REPLACE(true, true, 0, false)).to.equal('FALSETRUE')

    expect(text.REPLACE(true, 0, 2, false)).to.equal(error.value)
    expect(text.REPLACE(true, 0, false, false)).to.equal(error.value)
    expect(text.REPLACE(true, '2', '', false)).to.equal(error.value)
    expect(text.REPLACE(true, '', '2', false)).to.equal(error.value)
    expect(text.REPLACE(true, null, null, false)).to.equal(error.value)

    expect(text.REPLACE(error.div0, 1, 2, 'test')).to.equal(error.div0)
    expect(text.REPLACE('123456', error.div0, 1, 'test')).to.equal(error.div0)
    expect(text.REPLACE('123456', 1, error.div0, 'test')).to.equal(error.div0)
    expect(text.REPLACE('123456', 1, 2, error.div0)).to.equal(error.div0)

    expect(text.REPLACE('123456', 3, '@')).to.equal(error.na)
    expect(text.REPLACE('123456', '@')).to.equal(error.na)
    expect(text.REPLACE('123456', 1, 3, '@', 4)).to.equal(error.na)
    expect(text.REPLACE('')).to.equal(error.na)
    expect(text.REPLACE()).to.equal(error.na)

    expect(text.REPLACE(['text1', 'text2', 'text3'], 1, 4, 'texto')).to.eql(['texto1', 'texto2', 'texto3'])

    expect(
      text.REPLACE(
        [
          ['text1', 'text2'],
          ['text3', 'text4']
        ],
        1,
        4,
        'texto'
      )
    ).to.eql([
      ['texto1', 'texto2'],
      ['texto3', 'texto4']
    ])
  })

  xit('REPLACEB', () => {
    expect(text.REPLACEB).to.throw('REPLACEB is not implemented')
  })

  it('REPT', () => {
    expect(text.REPT(undefined, undefined)).to.equal('')
    expect(text.REPT('text', undefined)).to.equal('')
    expect(text.REPT(undefined, 3)).to.equal('')
    expect(text.REPT(error.na, 3)).to.equal(error.na)
    expect(text.REPT('multiple ', 3)).to.equal('multiple multiple multiple ')
    expect(text.REPT('m')).to.equal('')
    expect(text.REPT()).to.equal('')
    expect(text.REPT(true, 2)).to.equal('truetrue')
    expect(text.REPT(12, 2)).to.equal('1212')
  })

  it('RIGHT', () => {
    expect(text.RIGHT('Sale Price', 5, 3)).to.equal(error.na)
    expect(text.RIGHT()).to.equal(error.na)

    expect(text.RIGHT('')).to.equal('')
    expect(text.RIGHT(null)).to.equal('')

    expect(text.RIGHT('Stock Number')).to.equal('r')
    expect(text.RIGHT(true)).to.equal('e')
    expect(text.RIGHT(42)).to.equal('2')
    expect(text.RIGHT(4.2)).to.equal('2')
    expect(text.RIGHT(4.2, 2)).to.equal('.2')
    expect(text.RIGHT('Sale Price', 5)).to.equal('Price')

    expect(text.RIGHT(error.na, 2)).to.equal(error.na)
    expect(text.RIGHT('text', error.na)).to.equal(error.na)

    expect(text.RIGHT(5, 'Sale Price')).to.equal(error.value)
    expect(text.RIGHT('something', 'invalid')).to.equal(error.value)

    expect(text.RIGHT(null, null)).to.equal('')
    expect(text.RIGHT(null, 3)).to.equal('')

    expect(text.RIGHT(['text1', 'text2', 'text3'])).to.eql(['1', '2', '3'])
    expect(text.RIGHT([null, 'text2', 'text3'])).to.eql(['', '2', '3'])
    expect(text.RIGHT(['text1', 'text2', 'text3'], ['text1', 'text2', 'text3'])).to.eql([
      error.value,
      error.value,
      error.value
    ])
    //expect(text.RIGHT(['text1', 'text2', 'text3'], [1, 2, 3])).to.eql(['1', 't2', 'xt3'])

    expect(
      text.RIGHT([
        ['text', 'string'],
        ['date', 'number']
      ])
    ).to.eql([
      ['t', 'g'],
      ['e', 'r']
    ])
    expect(
      text.RIGHT(
        [
          ['text', 'string'],
          ['date', 'number']
        ],
        4
      )
    ).to.eql([
      ['text', 'ring'],
      ['date', 'mber']
    ])
  })

  xit('RIGHTB', () => {
    expect(text.RIGHTB).to.throw('RIGHTB is not implemented')
  })

  it('SEARCH', () => {
    expect(text.SEARCH('e', 'Statements', 6, 'text')).to.equal(error.na)
    expect(text.SEARCH(80)).to.equal(error.na)
    expect(text.SEARCH('')).to.equal(error.na)
    expect(text.SEARCH()).to.equal(error.na)
    expect(text.SEARCH(null)).to.equal(error.na)

    expect(text.SEARCH('e', 'Statements', 6)).to.equal(7)

    expect(text.SEARCH('MARGIN', 'Profit Margin')).to.equal(8)
    expect(text.SEARCH(80, 80)).to.equal(1)
    expect(text.SEARCH(0, 80)).to.equal(2)
    expect(text.SEARCH('0', 80)).to.equal(2)
    expect(text.SEARCH(8, 'text8')).to.equal(5)

    expect(text.SEARCH(true, 'this is true')).to.equal(9)
    expect(text.SEARCH('true', true)).to.equal(1)
    expect(text.SEARCH(true, 'true')).to.equal(1)

    expect(text.SEARCH(false, 'this is false')).to.equal(9)
    expect(text.SEARCH('false', false)).to.equal(1)
    expect(text.SEARCH(false, 'false')).to.equal(1)

    expect(text.SEARCH(null, null)).to.equal(1)
    expect(text.SEARCH(null, '')).to.equal(1)
    expect(text.SEARCH(null, true)).to.equal(1)
    expect(text.SEARCH(null, false)).to.equal(1)
    expect(text.SEARCH(null, 'true')).to.equal(1)
    expect(text.SEARCH(null, -1)).to.equal(1)
    expect(text.SEARCH(null, 0)).to.equal(1)
    expect(text.SEARCH(null, 1)).to.equal(1)
    expect(text.SEARCH(null, '-1')).to.equal(1)

    expect(text.SEARCH(true, null)).to.equal(error.value)
    expect(text.SEARCH(false, null)).to.equal(error.value)
    expect(text.SEARCH('true', null)).to.equal(error.value)
    expect(text.SEARCH(-1, null)).to.equal(error.value)
    expect(text.SEARCH(0, null)).to.equal(error.value)
    expect(text.SEARCH(1, null)).to.equal(error.value)
    expect(text.SEARCH('-1', null)).to.equal(error.value)

    expect(text.SEARCH('', '')).to.equal(1)
    expect(text.SEARCH('', null)).to.equal(1)
    expect(text.SEARCH('', true)).to.equal(1)
    expect(text.SEARCH('', false)).to.equal(1)
    expect(text.SEARCH('', 'true')).to.equal(1)
    expect(text.SEARCH('', -1)).to.equal(1)
    expect(text.SEARCH('', 0)).to.equal(1)
    expect(text.SEARCH('', 1)).to.equal(1)
    expect(text.SEARCH('', '-1')).to.equal(1)

    expect(text.SEARCH(true, '')).to.equal(error.value)
    expect(text.SEARCH(false, '')).to.equal(error.value)
    expect(text.SEARCH('true', '')).to.equal(error.value)
    expect(text.SEARCH(-1, '')).to.equal(error.value)
    expect(text.SEARCH(0, '')).to.equal(error.value)
    expect(text.SEARCH(1, '')).to.equal(error.value)
    expect(text.SEARCH('-1', '')).to.equal(error.value)

    expect(text.SEARCH(1, true)).to.equal(error.value)

    expect(text.SEARCH(800, 80)).to.equal(error.value)
    expect(text.SEARCH('MARGIN', 8)).to.equal(error.value)
    expect(text.SEARCH(true, 'bool')).to.equal(error.value)
    expect(text.SEARCH('foo', 'bar')).to.equal(error.value)
    expect(text.SEARCH('ba', 'bar')).to.equal(1)

    expect(text.SEARCH(1, 4561, 2)).to.equal(4)
    expect(text.SEARCH('UE', true, 3)).to.equal(3)

    expect(text.SEARCH('t', 'test', 0)).to.equal(error.value)
    expect(text.SEARCH('t', 'test', -1)).to.equal(error.value)
    expect(text.SEARCH('t', 'test', 5)).to.equal(error.value)

    expect(text.SEARCH('', 'test', 0)).to.equal(error.value)
    expect(text.SEARCH('', 'test', -1)).to.equal(error.value)
    expect(text.SEARCH('', 'test', 5)).to.equal(5)

    expect(text.SEARCH('t', 'test', null)).to.equal(error.value)
    expect(text.SEARCH('t', 'test', '')).to.equal(error.value)
    expect(text.SEARCH('t', 'test', true)).to.equal(1)
    expect(text.SEARCH('t', 'test', false)).to.equal(error.value)

    expect(text.SEARCH('t', 'test', '2     ')).to.equal(4)
    expect(text.SEARCH('t', 'test', '    2')).to.equal(4)
    expect(text.SEARCH('t', 'test', '    2    ')).to.equal(4)
    expect(text.SEARCH('t', 'test', '    a2    ')).to.equal(error.value)

    Object.values(error).forEach((err) => {
      expect(text.SEARCH(err, 'test')).to.equal(err)
      expect(text.SEARCH('', err)).to.equal(err)
      expect(text.SEARCH('', 'test', err)).to.equal(err)
    })

    expect(text.SEARCH('Brazil', ['Hello', 'Number', 'Text1', 'Brazil'])).to.eql([
      error.value,
      error.value,
      error.value,
      1
    ])

    expect(
      text.SEARCH('Brazil', [
        ['Hello', 'Text'],
        ['Brazil', 'I Love Brazil']
      ])
    ).to.eql([
      [error.value, error.value],
      [1, 8]
    ])
  })

  xit('SEARCHB', () => {
    expect(text.SEARCHB).to.throw('SEARCHB is not implemented')
  })

  it('SPLIT', () => {
    // eslint-disable-next-line no-extra-semi
    expect(text.SPLIT('123242', '2')).to.be.a('array')
  })

  describe('SUBSTITUTE', () => {
    it('should substitute all occurrences of a string for another string', () => {
      expect(text.SUBSTITUTE('Jim Alateras', 'Jim', 'James')).to.equal('James Alateras')
      expect(text.SUBSTITUTE('Jim Alateras', 'Jim', 2)).to.equal('2 Alateras')
      expect(text.SUBSTITUTE('Jim Alateras', 'im', 'ames')).to.equal('James Alateras')
      expect(text.SUBSTITUTE('tuttle', 't', 'b')).to.equal('bubble')
      expect(text.SUBSTITUTE('tuttle', 't', null)).to.equal('ule')
      expect(text.SUBSTITUTE('tuttle', null, 'b')).to.equal('tuttle')
      expect(text.SUBSTITUTE(null, 't', 'b')).to.equal('')
      expect(text.SUBSTITUTE(true, 't', 'b')).to.equal('TRUE')
      expect(text.SUBSTITUTE(true, 'T', 'b')).to.equal('bRUE')
      expect(text.SUBSTITUTE(false, 'F', 'b')).to.equal('bALSE')
      expect(text.SUBSTITUTE('tuttle', true, 'b')).to.equal('tuttle')
      expect(text.SUBSTITUTE('tuttle', 't', true)).to.equal('TRUEuTRUETRUEle')

      expect(text.SUBSTITUTE('Jim Alateras', '', 'ames')).to.equal('Jim Alateras')
      expect(text.SUBSTITUTE('Jim Alateras', undefined, 'ames')).to.equal('Jim Alateras')
      expect(text.SUBSTITUTE('Jim, Alateras, Sr.', ',', '')).to.equal('Jim Alateras Sr.')
      expect(text.SUBSTITUTE('', 'im', 'ames')).to.equal('')
    })

    it('should substitute regex meta-characters without interpretation', () => {
      expect(text.SUBSTITUTE('J. Alateras', '.', 'ames')).to.equal('James Alateras')
    })

    it('should return an #N/A error if not enough inputs', () => {
      expect(text.SUBSTITUTE('tuttle', 't', 'b', 1, 2)).to.equal(error.na)
      expect(text.SUBSTITUTE('Jim Alateras')).to.equal(error.na)
      expect(text.SUBSTITUTE('Jim Alateras', 'James')).to.equal(error.na)
      expect(text.SUBSTITUTE('')).to.equal(error.na)
      expect(text.SUBSTITUTE(null)).to.equal(error.na)
      expect(text.SUBSTITUTE()).to.equal(error.na)
    })

    it('should substitute the nth occurrence of a string for another string', () => {
      expect(text.SUBSTITUTE('tuttle', null, 'b', 1)).to.equal('tuttle')
      expect(text.SUBSTITUTE('tuttle', 't', null, 1)).to.equal('uttle')
      expect(text.SUBSTITUTE('tuttle', 't', ' ', 1)).to.equal(' uttle')
      expect(text.SUBSTITUTE('tuttle', 'P', 'b', 1)).to.equal('tuttle')
      expect(text.SUBSTITUTE('tuttle', 'T', 'b', 1)).to.equal('tuttle')
      expect(text.SUBSTITUTE('tuttle', 't', 'b', 1)).to.equal('buttle')
      expect(text.SUBSTITUTE('tuttle', 't', 'b', '     1')).to.equal('buttle')
      expect(text.SUBSTITUTE('tuttle', 't', 'b', '1    ')).to.equal('buttle')
      expect(text.SUBSTITUTE('tuttle', 't', 'b', 2)).to.equal('tubtle')
      expect(text.SUBSTITUTE('tuttle', 't', 'b', 3)).to.equal('tutble')
      expect(text.SUBSTITUTE('tuttle', 't', 'b', 4)).to.equal('tuttle')
      expect(text.SUBSTITUTE('a-a-a', ':', '', 1)).to.equal('a-a-a')
      expect(text.SUBSTITUTE('a-a-a', '-', ':', '2')).to.equal('a-a:a')
      expect(text.SUBSTITUTE('a-a-a', '-', ':', '2.5')).to.equal('a-a:a')
      expect(text.SUBSTITUTE('a-a-a', '-', ':', '3')).to.equal('a-a-a')
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 2)).to.equal('a-a:a')
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 2.5)).to.equal('a-a:a')
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 3)).to.equal('a-a-a')

      expect(text.SUBSTITUTE('aldldlda', 'ldld', '9', 1)).to.equal('a9lda')
      expect(text.SUBSTITUTE('aldldlda', 'ldld', '9', 2)).to.equal('ald9a')
    })

    it('should return a #VALUE! error if occurrence is not a number greater than or equal to 1', () => {
      expect(text.SUBSTITUTE('tuttle', 't', 'b', 'text')).to.equal(error.value)
      expect(text.SUBSTITUTE('tuttle', 't', 'b', null)).to.equal(error.value)
      expect(text.SUBSTITUTE('tuttle', 't', 'b', undefined)).to.equal(error.value)
      expect(text.SUBSTITUTE('tuttle', 't', 'b', true)).to.equal(error.value)
      expect(text.SUBSTITUTE('tuttle', 't', 'b', false)).to.equal(error.value)

      expect(text.SUBSTITUTE('a-a-a', '-', ':', '')).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 'x')).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', '-1')).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', '-0.5')).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', -1)).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 0)).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 0.5)).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', '1a')).to.equal(error.value)
      expect(text.SUBSTITUTE('a-a-a', '-', ':', 'a1')).to.equal(error.value)
    })

    it('Non-textual arguments', () => {
      expect(text.SUBSTITUTE(5000, 0, 4)).to.equal('5444')

      expect(text.SUBSTITUTE('the text is true', true, false)).to.equal('the text is true')
      expect(text.SUBSTITUTE('the text is TRUE', true, false)).to.equal('the text is FALSE')
      expect(text.SUBSTITUTE('the text is false', false, true)).to.equal('the text is false')
      expect(text.SUBSTITUTE('the text is FALSE', false, true)).to.equal('the text is TRUE')
    })

    it('Omitted arguments', () => {
      expect(text.SUBSTITUTE(undefined, 'e', '9')).to.equal('')
      expect(text.SUBSTITUTE('test', undefined, '9')).to.equal('test')
      expect(text.SUBSTITUTE('test', 'e', undefined)).to.equal('tst')
    })

    it('Errors', () => {
      Object.values(error).forEach((err) => {
        expect(text.SUBSTITUTE(err, '0', 'a')).to.equal(err)
        expect(text.SUBSTITUTE('test', err, 'a')).to.equal(err)
        expect(text.SUBSTITUTE('test', 'e', err)).to.equal(err)
        expect(text.SUBSTITUTE('test', 'e', ',', err)).to.equal(err)
      })
    })
  })

  it('T', () => {
    expect(text.T(undefined)).to.equal('')
    expect(text.T(error.na)).to.equal(error.na)
    expect(text.T('Rainfall')).to.equal('Rainfall')
    expect(text.T(19)).to.equal('')
    expect(text.T(true)).to.equal('')
  })

  it('TEXTJOIN', () => {
    expect(text.TEXTJOIN(' ', true, 'The', '', 'sun', 'will', 'come', 'up', 'tomorrow.')).to.equal(
      'The sun will come up tomorrow.'
    )
    expect(text.TEXTJOIN(' ', false, 1, '', 2, null, 4, 0, '9')).to.equal('1  2  4 0 9')
    expect(text.TEXTJOIN(' ', 'TRUE', 'The', '', 'sun', 'will', 'come', 'up', 'tomorrow.')).to.equal(
      'The sun will come up tomorrow.'
    )
    expect(text.TEXTJOIN(' ', false, 'The', '', 'sun', 'will', 'come', 'up', 'tomorrow.')).to.equal(
      'The  sun will come up tomorrow.'
    )
    expect(text.TEXTJOIN(' ', 'FALSE', 'The', '', 'sun', 'will', 'come', 'up', 'tomorrow.')).to.equal(
      'The  sun will come up tomorrow.'
    )
    expect(text.TEXTJOIN(['_', '>'], true, 'The', 'sun', 'will', 'come', 'up', 'tomorrow.')).to.equal(
      'The_sun>will_come>up_tomorrow.'
    )
    expect(text.TEXTJOIN(' ', true, ['The', 'sun', 'will'], 'come', ['up', 'tomorrow.'])).to.equal(
      'The sun will come up tomorrow.'
    )
    expect(text.TEXTJOIN(true, true, ['The', 'sun', 'will'], 'come', ['up', 'tomorrow.'])).to.equal(
      'Thetruesuntruewilltruecometrueuptruetomorrow.'
    )
    expect(text.TEXTJOIN(', ', 'One', 'Two', 'Three', 'Four')).to.equal(error.value)
    expect(text.TEXTJOIN(null, null, 'The', 'sun', 'will', 'come', 'up', 'tomorrow.')).to.equal(
      'Thesunwillcomeuptomorrow.'
    )
    expect(text.TEXTJOIN('text', 1, 'text2')).to.equal('text2')
    expect(text.TEXTJOIN('text', true, 'text2')).to.equal('text2')

    expect(text.TEXTJOIN('text', 'text2')).to.equal(error.na)
    expect(text.TEXTJOIN(1, 3)).to.equal(error.na)
    expect(text.TEXTJOIN(1)).to.equal(error.na)
    expect(text.TEXTJOIN(' ', true)).to.equal(error.na)
    expect(text.TEXTJOIN('')).to.equal(error.na)
    expect(text.TEXTJOIN()).to.equal(error.na)
  })

  it('TRIM', () => {
    expect(text.TRIM(null)).to.equal('')

    expect(text.TRIM(true)).to.equal('true')
    expect(text.TRIM(false)).to.equal('false')

    expect(text.TRIM('true')).to.equal('true')
    expect(text.TRIM('false')).to.equal('false')

    expect(text.TRIM()).to.equal(error.na)
    expect(text.TRIM('')).to.equal('')
    expect(text.TRIM(undefined)).to.equal('')
    expect(text.TRIM(error.na)).to.equal(error.na)
    expect(text.TRIM(' more  spaces ')).to.equal('more spaces')

    expect(text.TRIM(10, 'text')).to.equal(error.na)
    expect(text.TRIM(10, 10)).to.equal(error.na)

    expect(text.TRIM(10)).to.equal('10')
    expect(text.TRIM(-10)).to.equal('-10')
    expect(text.TRIM(0)).to.equal('0')
    expect(text.TRIM(3.4)).to.equal('3.4')
    expect(text.TRIM(-93.4)).to.equal('-93.4')

    expect(text.TRIM([['hello world']])).to.eql([['hello world']])
    expect(text.TRIM([[1]])).to.eql([['1']])
    expect(text.TRIM([[null]])).to.eql([['']])
    expect(text.TRIM(['   f', '   ', ' c'])).to.eql(['f', '', 'c'])
    expect(text.TRIM([[10], [5], [2]])).to.eql([['10'], ['5'], ['2']])
    expect(
      text.TRIM([
        [5, 10],
        [3, 5],
        [1, 2]
      ])
    ).to.eql([
      ['5', '10'],
      ['3', '5'],
      ['1', '2']
    ])
    expect(
      text.TRIM(
        `  spaces,      tabs, and
      new lines`
      )
    ).to.equal('spaces, tabs, and new lines')
    expect(text.TRIM('  spaces, tabs, and new lines')).to.equal('spaces, tabs, and new lines')
  })

  it('UNICHAR', () => {
    expect(text.UNICHAR(undefined)).to.equal(error.value)
    expect(text.UNICHAR(error.na)).to.equal(error.na)
    expect(text.UNICHAR(65)).to.equal('A')
    expect(text.UNICHAR(255)).to.equal('ÿ')
    expect(text.UNICHAR(1000)).to.equal('Ϩ')
  })

  it('UNICODE', () => {
    expect(text.UNICODE(undefined)).to.equal(error.value)
    expect(text.UNICODE(error.na)).to.equal(error.na)
    expect(text.UNICODE('A')).to.equal(65)
    expect(text.UNICODE('Ϩ')).to.equal(1000)
  })

  it('UPPER', () => {
    expect(text.UPPER('to upper case please', 'text')).to.equal(error.na)
    expect(text.UPPER()).to.equal(error.na)

    expect(text.UPPER(undefined)).to.equal('')
    expect(text.UPPER(null)).to.equal('')
    expect(text.UPPER('')).to.equal('')

    expect(text.UPPER(error.na)).to.equal(error.na)

    expect(text.UPPER('to upper case please')).to.equal('TO UPPER CASE PLEASE')
    expect(text.UPPER(true)).to.equal('TRUE')

    expect(text.UPPER(1)).to.equal('1')
    expect(text.UPPER(1.1)).to.equal('1.1')

    expect(text.UPPER(['text1', 'text2', 'text3'])).to.eql(['TEXT1', 'TEXT2', 'TEXT3'])
    expect(
      text.UPPER([
        ['text1', 'text2'],
        ['text3', 'text4']
      ])
    ).to.eql([
      ['TEXT1', 'TEXT2'],
      ['TEXT3', 'TEXT4']
    ])
  })

  describe('VALUE', () => {
    it('should thrown an error in case of error input', () => {
      expect(text.VALUE(error.na)).to.equal(error.na)
    })

    it('should return the input in case of number input', () => {
      expect(text.VALUE(3)).to.equal(3)
    })

    it('should return 0 in case of null, empty input', () => {
      expect(text.VALUE('')).to.equal(0)
      expect(text.VALUE()).to.equal(0)
      expect(text.VALUE(null)).to.equal(0)
    })

    it('should thrown an error in case of boolean input', () => {
      expect(text.VALUE(true)).to.equal(error.value)
    })

    it('should thrown an error in case of malformed input', () => {
      expect(text.VALUE('SOMETEXT')).to.equal(error.value)
      expect(text.VALUE('2+2')).to.equal(error.value)
      expect(text.VALUE('3%22')).to.equal(error.value)
      expect(text.VALUE('3D22')).to.equal(error.value)
      expect(text.VALUE('SOMETEXT 42')).to.equal(error.value)
    })

    it('should parse scientific notation string', () => {
      expect(text.VALUE('10E3')).to.equal(10000)
    })

    it('should parse percentage string', () => {
      expect(text.VALUE('%12')).to.equal(0.12)
      expect(text.VALUE('12%')).to.equal(0.12)
    })

    it('should allow numeric input', () => {
      expect(text.VALUE(12)).to.equal(12)
    })

    /**
     * Only supports thousands separator "," and decimal separator "."
     *
     * These separators are not yet configurable. But the aim is not be as extensive as dedicated parsing library
     * such as Numeral.js or Numbro.
     */
    it('should parse a number as string', () => {
      expect(text.VALUE('123.45')).to.equal(123.45)
      expect(text.VALUE('10,000')).to.equal(10000)
      expect(text.VALUE('1,210,000')).to.equal(1210000)
      expect(text.VALUE('11 000')).to.equal(11000)
      expect(text.VALUE('-3.14')).to.equal(-3.14)
    })

    it('should parse dollar monetary string', () => {
      expect(text.VALUE('$1000')).to.equal(1000)
      expect(text.VALUE('$11,000')).to.equal(11000)
    })

    /**
     * These test cases illustrate permissive input cases. They do not mirror exactly Excel behaviors.
     */
    it('could be less permissive', () => {
      expect(text.VALUE('EUR1000')).to.equal(1000)
    })
  })

  it('TEXTAFTER', () => {
    expect(text.TEXTAFTER('Red riding hoods, red hood', 'hood')).to.equal('s, red hood')
    expect(text.TEXTAFTER('Red riding hoods, red hood', '')).to.equal('Red riding hoods, red hood')
    expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'red', -2)).to.equal(' Riding Hoods red hood')
    expect(text.TEXTAFTER('Red riding hoods, red hood', '', -1)).to.equal('')
    expect(text.TEXTAFTER('Little Red Riding Hoods red hood', 'Red')).to.equal(' Riding Hoods red hood')
    expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'red', 2)).to.equal(' hood')
    expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'Red', 2, 1)).to.equal(' hood')
    expect(text.TEXTAFTER(123, 1, undefined, false, undefined, 'Not found')).to.equal('23')
    expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'Red', 2, 0)).to.equal(error.na)
    expect(text.TEXTAFTER('Little Red Riding Hoods red hood', 'Red', 3)).to.equal(error.na)
    expect(text.TEXTAFTER('Marcus Aurelius', ' ', undefined, undefined, 1)).to.equal('Aurelius')
    expect(text.TEXTAFTER('Socrates', ' ', undefined, undefined, 1)).to.equal('')
    expect(text.TEXTAFTER('Socrates', ' ', -1, undefined, 1)).to.equal('Socrates')
    expect(text.TEXTAFTER('Immanuel Kant', ' ', undefined, undefined, 1)).to.equal('Kant')
    expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'Red', undefined, false)).to.equal(error.na)
    expect(
      text.TEXTAFTER('Little red Riding Hoods red hood', 'Red', undefined, false, undefined, 'Not found')
    ).to.equal('Not found')
    expect(text.TEXTAFTER('Socrates', ' ', undefined, undefined, 0)).to.equal(error.na)
    expect(text.TEXTAFTER('Little Red Riding Hoods red hood', 'basket')).to.equal(error.na)
    expect(text.TEXTAFTER('Text', 'T', 10)).to.equal(error.value)
    expect(text.TEXTAFTER('Text', 'T', 0)).to.equal(error.value)
    expect(text.TEXTAFTER('Text', 'T', 2)).to.equal(error.na)
    expect(text.TEXTAFTER('Text', 'T', 2, undefined, undefined, undefined, 1)).to.equal(error.na)
    expect(text.TEXTAFTER('Text')).to.equal(error.na)
    expect(text.TEXTAFTER()).to.equal(error.na)
    expect(text.TEXTAFTER(true, true, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTAFTER('true', true, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTAFTER(false, false, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTAFTER(true, false, undefined, false, undefined, 'Not found')).to.equal('Not found')
    expect(text.TEXTAFTER(true, false, undefined, false, undefined, error.error)).to.equal(error.error)
    expect(text.TEXTAFTER(true, false, undefined, false, undefined, null)).to.equal(null)
    expect(text.TEXTAFTER(undefined, 'text', undefined, false, undefined, 'Not found')).to.equal(error.na)
    expect(text.TEXTAFTER(null, 'text', undefined, false, undefined, 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER([[1], [2]], 'text', undefined, false, undefined, 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER('abc', 'b', null, false, undefined, 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER('abc', 'b', true, null, undefined, 'Not found')).to.equal('c')
    expect(text.TEXTAFTER('abc', 'b', true, undefined, null, 'Not found')).to.equal('c')
    expect(text.TEXTAFTER('abc', [[1], [2]], undefined, undefined, null, 'Not found')).to.equal('Not found')
    expect(text.TEXTAFTER('abc', 'b', [[1], [2]], undefined, null, 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER('abc', 'b', false, undefined, null, 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER('abc', 'b', 1, [[1], [2]], null, 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER('abc', 'b', 1, 1, [[1], [2]], 'Not found')).to.equal(error.value)
    expect(text.TEXTAFTER('abc', 'b', 1, 1, 1, [[1], [2]])).to.equal('c')

    Object.values(error).forEach((err) => {
      expect(text.TEXTAFTER(err, 'red', undefined, false, undefined, 'Not found')).to.equal(err)
      expect(
        text.TEXTAFTER('Little red Riding Hoods red hood', err, undefined, false, undefined, 'Not found')
      ).to.equal(err)
      expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'red', err, false, undefined, 'Not found')).to.equal(
        err
      )
      expect(
        text.TEXTAFTER('Little red Riding Hoods red hood', 'red', undefined, err, undefined, 'Not found')
      ).to.equal(err)
      expect(text.TEXTAFTER('Little red Riding Hoods red hood', 'red', undefined, false, err, 'Not found')).to.equal(
        err
      )
    })
  })

  it('TEXTBEFORE', () => {
    expect(text.TEXTBEFORE('Red riding hoods, red hood', 'hood')).to.equal('Red riding ')
    expect(text.TEXTBEFORE('Red riding hoods, red hood', '')).to.equal('')
    expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'red', -2)).to.equal('Little ')
    expect(text.TEXTBEFORE('Red riding hoods, red hood', '', -1)).to.equal('Red riding hoods, red hood')
    expect(text.TEXTBEFORE('Little Red Riding Hoods red hood', 'Red')).to.equal('Little ')
    expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'red', 2)).to.equal('Little red Riding Hoods ')
    expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'Red', 2, 1)).to.equal('Little red Riding Hoods ')
    expect(text.TEXTBEFORE(123, 1, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'Red', 2, 0)).to.equal(error.na)
    expect(text.TEXTBEFORE('Little Red Riding Hoods red hood', 'Red', 3)).to.equal(error.na)
    expect(text.TEXTBEFORE('Marcus Aurelius', ' ', undefined, undefined, 1)).to.equal('Marcus')
    expect(text.TEXTBEFORE('Socrates', ' ', undefined, undefined, 1)).to.equal('Socrates')
    expect(text.TEXTBEFORE('Socrates', ' ', -1, undefined, 1)).to.equal('')
    expect(text.TEXTBEFORE('Immanuel Kant', ' ', undefined, undefined, 1)).to.equal('Immanuel')
    expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'Red', undefined, false)).to.equal(error.na)
    expect(
      text.TEXTBEFORE('Little red Riding Hoods red hood', 'Red', undefined, false, undefined, 'Not found')
    ).to.equal('Not found')
    expect(text.TEXTBEFORE('Socrates', ' ', undefined, undefined, 0)).to.equal(error.na)
    expect(text.TEXTBEFORE('Little Red Riding Hoods red hood', 'basket')).to.equal(error.na)
    expect(text.TEXTBEFORE('Text', 'T', 10)).to.equal(error.value)
    expect(text.TEXTBEFORE('Text', 'T', 0)).to.equal(error.value)
    expect(text.TEXTBEFORE('Text', 'T', 2)).to.equal(error.na)
    expect(text.TEXTBEFORE('Text', 'T', 2, undefined, undefined, undefined, 1)).to.equal(error.na)
    expect(text.TEXTBEFORE('Text')).to.equal(error.na)
    expect(text.TEXTBEFORE()).to.equal(error.na)
    expect(text.TEXTBEFORE(true, true, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTBEFORE('true', true, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTBEFORE(false, false, undefined, false, undefined, 'Not found')).to.equal('')
    expect(text.TEXTBEFORE(true, false, undefined, false, undefined, 'Not found')).to.equal('Not found')
    expect(text.TEXTBEFORE(true, false, undefined, false, undefined, error.error)).to.equal(error.error)
    expect(text.TEXTBEFORE(true, false, undefined, false, undefined, null)).to.equal(null)
    expect(text.TEXTBEFORE(undefined, 'text', undefined, false, undefined, 'Not found')).to.equal(error.na)
    expect(text.TEXTBEFORE(null, 'text', undefined, false, undefined, 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE([[1], [2]], 'text', undefined, false, undefined, 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE('abc', 'b', null, false, undefined, 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE('abc', 'b', true, null, undefined, 'Not found')).to.equal('a')
    expect(text.TEXTBEFORE('abc', 'b', true, undefined, null, 'Not found')).to.equal('a')
    expect(text.TEXTBEFORE('abc', [[1], [2]], undefined, undefined, null, 'Not found')).to.equal('Not found')
    expect(text.TEXTBEFORE('abc', 'b', [[1], [2]], undefined, null, 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE('abc', 'b', false, undefined, null, 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE('abc', 'b', 1, [[1], [2]], null, 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE('abc', 'b', 1, 1, [[1], [2]], 'Not found')).to.equal(error.value)
    expect(text.TEXTBEFORE('abc', 'b', 1, 1, 1, [[1], [2]])).to.equal('a')

    Object.values(error).forEach((err) => {
      expect(text.TEXTBEFORE(err, 'red', undefined, false, undefined, 'Not found')).to.equal(err)
      expect(
        text.TEXTBEFORE('Little red Riding Hoods red hood', err, undefined, false, undefined, 'Not found')
      ).to.equal(err)
      expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'red', err, false, undefined, 'Not found')).to.equal(
        err
      )
      expect(
        text.TEXTBEFORE('Little red Riding Hoods red hood', 'red', undefined, err, undefined, 'Not found')
      ).to.equal(err)
      expect(text.TEXTBEFORE('Little red Riding Hoods red hood', 'red', undefined, false, err, 'Not found')).to.equal(
        err
      )
    })
  })
  it('TEXTSPLIT', () => {
    expect(text.TEXTSPLIT('abcabc', [['a', 'b']], undefined, true)).to.eql([['c', 'c']])
    expect(text.TEXTSPLIT('abcabc', undefined, [['a', 'b']], true)).to.eql([['c'], ['c']])
    expect(text.TEXTSPLIT('abcabc', 'a', undefined, true)).to.eql([['bc', 'bc']])
    expect(text.TEXTSPLIT('Dakota Lennon Sanchez', ' ')).to.eql([['Dakota', 'Lennon', 'Sanchez']])
    expect(text.TEXTSPLIT('To be or not to be', ' ')).to.eql([['To', 'be', 'or', 'not', 'to', 'be']])
    expect(text.TEXTSPLIT('zab.xac.yad.ae', [['.', 'a']])).to.eql([['z', 'b', 'x', 'c', 'y', 'd', '', 'e']])
    expect(text.TEXTSPLIT('zab.xac.yad.ae', [['.'], ['a']])).to.eql([['z', 'b', 'x', 'c', 'y', 'd', '', 'e']])
    expect(text.TEXTSPLIT('zab.xac.yad.ae', undefined, [['.', 'a']])).to.eql([
      ['z'],
      ['b'],
      ['x'],
      ['c'],
      ['y'],
      ['d'],
      [''],
      ['e']
    ])
    expect(text.TEXTSPLIT('zab.xac.yad.ae', undefined, [['.'], ['a']])).to.eql([
      ['z'],
      ['b'],
      ['x'],
      ['c'],
      ['y'],
      ['d'],
      [''],
      ['e']
    ])
    expect(text.TEXTSPLIT('zab.xAc.yad.Ae', undefined, [['.'], ['a']], true, true)).to.eql([
      ['z'],
      ['b'],
      ['x'],
      ['c'],
      ['y'],
      ['d'],
      ['e']
    ])
    expect(text.TEXTSPLIT('za?b.xa?c.ya?d.A?e', undefined, [['.'], ['A?']], true, true)).to.eql([
      ['z'],
      ['b'],
      ['x'],
      ['c'],
      ['y'],
      ['d'],
      ['e']
    ])
    expect(text.TEXTSPLIT('1,2,3;4,5,6', ',', ';')).to.eql([
      ['1', '2', '3'],
      ['4', '5', '6']
    ])
    expect(text.TEXTSPLIT('abcabc;abcabcabc', 'a', ';', true)).to.eql([
      ['bc', 'bc', error.na],
      ['bc', 'bc', 'bc']
    ])
    expect(text.TEXTSPLIT('abcabc', 'a')).to.eql([['', 'bc', 'bc']])
    expect(text.TEXTSPLIT('abcabc', 'A', undefined, true, true)).to.eql([['bc', 'bc']])
    expect(text.TEXTSPLIT('Do. Or do not. There is no try. -Anonymous', '.')).to.eql([
      ['Do', ' Or do not', ' There is no try', ' -Anonymous']
    ])
    expect(text.TEXTSPLIT('Do. Or do not. There is no try. -Anonymous', undefined, '. ')).to.eql([
      ['Do'],
      ['Or do not'],
      ['There is no try'],
      ['-Anonymous']
    ])
    expect(text.TEXTSPLIT('Do. Or do not. There is no try. -Anonymous', ' ', '. ', true)).to.eql([
      ['Do', error.na, error.na, error.na],
      ['Or', 'do', 'not', error.na],
      ['There', 'is', 'no', 'try'],
      ['-Anonymous', error.na, error.na, error.na]
    ])
    expect(text.TEXTSPLIT('Do. Or do not. There is no try. -Anonymous', ' ', '. ', true, false, error.error)).to.eql([
      ['Do', error.error, error.error, error.error],
      ['Or', 'do', 'not', error.error],
      ['There', 'is', 'no', 'try'],
      ['-Anonymous', error.error, error.error, error.error]
    ])
    expect(text.TEXTSPLIT('Do. Or do not. There is no try. -Anonymous', ' ', '. ', true, false, '')).to.eql([
      ['Do', '', '', ''],
      ['Or', 'do', 'not', ''],
      ['There', 'is', 'no', 'try'],
      ['-Anonymous', '', '', '']
    ])
    expect(text.TEXTSPLIT(true, 'a')).to.eql('true')
    expect(text.TEXTSPLIT(false, 'a')).to.eql([['f', 'lse']])
    expect(text.TEXTSPLIT(undefined, 'a')).to.eql(error.na)
    expect(text.TEXTSPLIT(null, 'a')).to.eql(error.value)
    expect(text.TEXTSPLIT([[1], [2]], 'a')).to.eql(error.value)
    expect(text.TEXTSPLIT(123, 2)).to.eql([['1', '3']])
    expect(text.TEXTSPLIT(123, 2)).to.eql([['1', '3']])
    expect(text.TEXTSPLIT(123, true)).to.eql('123')
    expect(text.TEXTSPLIT(123, false)).to.eql('123')
    expect(text.TEXTSPLIT(123, undefined)).to.eql(error.value)
    expect(text.TEXTSPLIT(123, null)).to.eql(error.value)
    expect(text.TEXTSPLIT(123, undefined, 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, true)).to.eql('123')
    expect(text.TEXTSPLIT(123, undefined, false)).to.eql('123')
    expect(text.TEXTSPLIT(123, undefined, undefined)).to.eql(error.value)
    expect(text.TEXTSPLIT(123, undefined, null)).to.eql(error.value)
    expect(text.TEXTSPLIT(123, undefined, '2', 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, 2, 1, 1)).to.equal(error.na)
    expect(text.TEXTSPLIT(123)).to.equal(error.na)
    expect(text.TEXTSPLIT()).to.equal(error.na)
    expect(text.TEXTSPLIT(123, undefined, '2', undefined)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', null)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', [[1, 3]])).to.eql(error.value)
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT('12?3', undefined, '2?', undefined, 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, undefined)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, null)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, 2)).to.eql([['1'], ['3']])
    expect(text.TEXTSPLIT(123, undefined, '2', undefined, [[1, 3]])).to.eql(error.value)

    Object.values(error).forEach((err) => {
      expect(text.TEXTSPLIT(err, 'A', undefined, true, true)).to.equal(err)
      expect(text.TEXTSPLIT('abcabc', err, undefined, true, true)).to.equal(err)
      expect(text.TEXTSPLIT('abcabc', 'A', err, true, true)).to.equal(err)
      expect(text.TEXTSPLIT('abcabc', 'A', undefined, err, true)).to.equal(err)
      expect(text.TEXTSPLIT('abcabc', 'A', undefined, true, err)).to.equal(err)
    })
  })

  it('VALUETOTEXT', () => {
    expect(text.VALUETOTEXT(true, 0)).to.equal('true')
    expect(text.VALUETOTEXT(false, 0)).to.equal('false')
    expect(text.VALUETOTEXT(1234.01234, 0)).to.equal('1234.01234')
    expect(text.VALUETOTEXT('Hello', 0)).to.equal('Hello')
    expect(text.VALUETOTEXT(error.value, 0)).to.equal(error.value.message)
    expect(text.VALUETOTEXT('Seattle', 0)).to.equal('Seattle')
    expect(text.VALUETOTEXT(1234, 0)).to.equal('1234')
    expect(text.VALUETOTEXT(true, 1)).to.equal('true')
    expect(text.VALUETOTEXT(1234.01234, 1)).to.equal('1234.01234')
    expect(text.VALUETOTEXT('Hello', 1)).to.equal(`"Hello"`)
    expect(text.VALUETOTEXT(error.value, 1)).to.equal(error.value.message)
    expect(text.VALUETOTEXT('Seattle', 1)).to.equal(`"Seattle"`)
    expect(text.VALUETOTEXT(1234, 1)).to.equal('1234')
    expect(text.VALUETOTEXT(undefined, 0)).to.equal('')
    expect(text.VALUETOTEXT(null, 0)).to.equal('')
    expect(text.VALUETOTEXT(undefined, 1)).to.equal('')
    expect(text.VALUETOTEXT(null, 1)).to.equal('')
    expect(text.VALUETOTEXT('Hello', true)).to.equal(`"Hello"`)
    expect(text.VALUETOTEXT('Hello', false)).to.equal('Hello')
    expect(text.VALUETOTEXT()).to.equal(error.na)
    expect(text.VALUETOTEXT('Hello', false, 1)).to.equal(error.na)
    expect(text.VALUETOTEXT([['Hello', 'Seattle', 123]], false)).to.eql([['Hello', 'Seattle', '123']])
    expect(
      text.VALUETOTEXT(
        [
          ['Hello', 'Seattle'],
          [123, 456],
          [null, undefined]
        ],
        false
      )
    ).to.eql([
      ['Hello', 'Seattle'],
      ['123', '456'],
      ['', '']
    ])
    expect(
      text.VALUETOTEXT(
        [
          ['Hello', 'Seattle'],
          [123, 456],
          [null, undefined]
        ],
        true
      )
    ).to.eql([
      [`"Hello"`, `"Seattle"`],
      ['123', '456'],
      ['', '']
    ])

    Object.values(error).forEach((err) => {
      expect(text.VALUETOTEXT(err, 0)).to.equal(err.message)
      expect(text.VALUETOTEXT(err, 1)).to.equal(err.message)
      expect(text.VALUETOTEXT('Hello', err)).to.equal(err)
    })
  })
})
