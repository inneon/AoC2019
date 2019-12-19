import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'

describe('adding hooks', () => {
  it('can override an add instruction', () => {
    const program = '1,0,0,0,99'
    const addHook = () => [9, 0, 0]
    const actual = interpretCode(
      program,
      () => 0,
      () => {},
      { '1': addHook }
    )

    expect(actual).toBe('9,0,0,0,99')
  })
})
