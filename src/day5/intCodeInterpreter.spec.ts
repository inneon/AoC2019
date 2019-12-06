import { interpretCode } from './intCodeInterpreter'

const defaultOutput = () => {}

describe('int code interpreter', () => {
  it('should halt on 99', () => {
    const input = '99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('99')
  })

  it('should match example 1', () => {
    const input = '1,0,0,0,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('2,0,0,0,99')
  })

  it('should match example 4', () => {
    const input = '1,1,1,4,99,5,6,0,99'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('30,1,1,4,2,5,6,0,99')
  })

  it('should match advanced example 1', () => {
    const input = '1002,4,3,4,33'
    const actual = interpretCode(input, 0, defaultOutput)

    expect(actual).toBe('1002,4,3,4,99')
  })

  it.only('can do basic IO', () => {
    const input = '3,0,4,0,99'
    let received: number
    const output = (num: number) => {
      received = num
    }
    interpretCode(input, 34, output)

    expect(received).toBe(34)
  })
})
