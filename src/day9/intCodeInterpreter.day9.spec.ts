import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'
import { decodeParameter } from '../intCodeInterpreter/parameterDecoder'

describe.skip('Int code interpreter', () => {
  it('should use relative address mode', () => {
    const program = '109,4,204,1,99,10'
    let received: number
    const output = (num: number) => {
      received = num
    }
    interpretCode(program, () => 1, output)

    expect(received).toBe(10)
  })
})

describe('parameter decoding', () => {
  it('should use address mode by default', () => {
    expect(decodeParameter('', [0], [1], 0)).toEqual([1])
  })

  it('should use address mode when specified', () => {
    expect(decodeParameter('0', [0], [1], 0)).toEqual([1])
  })

  it('should use immediate mode when specified', () => {
    expect(decodeParameter('1', [0], [1], 0)).toEqual([0])
  })
})
