import { chainInterpreter } from '../intCodeInterpreter'

describe('chaining interpreters', () => {
  it('can output its phase', () => {
    const input = '3,0,4,0,99'
    const received = chainInterpreter(input, [34])

    expect(received).toBe(34)
  })

  it.skip('can add phase and input', () => {
    const input = '03,0,03,1,01,0,1,0,04,0,99'
    const received = chainInterpreter(input, [34])

    expect(received).toBe(34)
  })
})
