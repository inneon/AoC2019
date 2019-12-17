import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'
import { decodeParameter } from '../intCodeInterpreter/parameterDecoder'

describe('Int code interpreter', () => {
  it('should use relative address mode', () => {
    const program = '109,4,204,1,99,10'
    let received: number
    const output = (num: number) => {
      received = num
    }
    interpretCode(program, () => 1, output)

    expect(received).toBe(10)
  })

  it('should put input into the right place', () => {
    const program = '109,4,203,1,99'

    expect(interpretCode(program, () => 999)).toBe('109,4,203,1,99,999')
  })
})

describe('parameter decoding', () => {
  it('should use address mode by default', () => {
    expect(decodeParameter('', [0], ['read'], [1], 0)).toEqual([1])
  })

  it('should use address mode when specified', () => {
    expect(decodeParameter('0', [0], ['read'], [1], 0)).toEqual([1])
    expect(decodeParameter('0', [5], ['write'], [1], 0)).toEqual([5])
  })

  it('should use immediate mode when specified', () => {
    expect(decodeParameter('1', [0], ['read'], [1], 0)).toEqual([0])
  })

  it('should use relative mode', () => {
    expect(decodeParameter('2', [1], ['read'], [0, 1, 2, 5], 2)).toEqual([5])
    expect(decodeParameter('2', [1], ['write'], [0, 1, 2, 5], 2)).toEqual([3])
  })
})
