import {
  chainInterpreter,
  generateChains,
  maximiseChain
} from '../intCodeInterpreter/chainer'

describe('chaining interpreters', () => {
  it('can output its phase', () => {
    const program = '3,0,4,0,99'
    const received = chainInterpreter(program, [34])

    expect(received).toBe(34)
  })

  it('can add phase and program', () => {
    const program = '03,0,03,1,01,0,1,0,04,0,99'
    const received = chainInterpreter(program, [34])

    expect(received).toBe(34)
  })

  it('can chain two together', () => {
    const program = '03,0,03,1,01,0,1,0,04,0,99'
    const received = chainInterpreter(program, [1, 2])

    expect(received).toBe(3)
  })

  it('gets the same signal as example 1', () => {
    const program = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'
    const received = chainInterpreter(program, [4, 3, 2, 1, 0])

    expect(received).toBe(43210)
  })

  it('generates the correct chains for 3 phases', () => {
    expect(Array.from(generateChains(3))).toEqual([
      [2, 1, 0],
      [1, 2, 0],
      [1, 0, 2],
      [2, 0, 1],
      [0, 2, 1],
      [0, 1, 2]
    ])
  })

  it('gets the same result as example1', () => {
    const program = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'
    const received = maximiseChain(program, 5)

    expect(received).toBe(43210)
  })

  it('gets the same result as example2', () => {
    const program =
      '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'
    const received = maximiseChain(program, 5)

    expect(received).toBe(54321)
  })

  it('gets the same result as example2', () => {
    const program =
      '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'
    const received = maximiseChain(program, 5)

    expect(received).toBe(65210)
  })
})
