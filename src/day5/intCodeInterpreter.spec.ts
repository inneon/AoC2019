import { interpretCode } from '../intCodeInterpreter'

const defaultOutput = () => {}

describe('int code interpreter', () => {
  it('should halt on 99', () => {
    const input = '99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('99')
  })

  it('Can add on addresses', () => {
    const input = '1,0,0,0,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('2,0,0,0,99')
  })

  it('Can multiply on immeadiates and addresses', () => {
    const input = '1002,4,3,4,33'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('1002,4,3,4,99')
  })

  it('Can add two immeadiates', () => {
    const input = '1101,4,3,0,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('7,4,3,0,99')
  })

  it('should match example 4', () => {
    const input = '1,1,1,4,99,5,6,0,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('30,1,1,4,2,5,6,0,99')
  })

  it('can do basic IO', () => {
    const input = '3,0,4,0,99'
    let received: number
    const output = (num: number) => {
      received = num
    }
    interpretCode(input, 34, output)

    expect(received).toBe(34)
  })

  it('should do a jump-if-true', () => {
    const input = '1005,0,4,-1,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('1005,0,4,-1,99')
  })

  it('should do a jump-if-false', () => {
    const input = '1105,0,4,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('1105,0,4,99')
  })

  it('should do a less than', () => {
    const input = '07,1,0,3,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('7,1,0,1,99')
  })

  it('should do a equality', () => {
    const input = '1008,1,1,3,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('1008,1,1,1,99')
  })

  it.each`
    input | expected
    ${3}  | ${999}
    ${8}  | ${1000}
    ${11} | ${1001}
  `('should match the advanced example', ({ input, expected }) => {
    const code =
      '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'
    let received: number
    const output = (num: number) => {
      received = num
    }
    interpretCode(code, input, output)

    expect(received).toBe(expected)
  })
})
