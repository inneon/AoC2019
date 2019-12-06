import { interpretCode } from './intCodeInterpreter'

describe('int code interpreter', () => {
  it('should halt on 99', () => {
    const input = '99'
    const actual = interpretCode(input)

    expect(actual).toBe('99')
  })

  it('should match example 1', () => {
    const input = '1,0,0,0,99'
    const actual = interpretCode(input)

    expect(actual).toBe('2,0,0,0,99')
  })

  it('should match example 4', () => {
    const input = '1,1,1,4,99,5,6,0,99'
    const actual = interpretCode(input)

    expect(actual).toBe('30,1,1,4,2,5,6,0,99')
  })
})
