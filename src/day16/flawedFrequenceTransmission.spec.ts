import {
  pattern,
  phase,
  calculateOutputDigit,
  multiPhase,
  finalMessage
} from './flawedFrequenctTransmission'

describe('fft', () => {
  it.each`
    position | output
    ${0}     | ${[1, 0, -1, 0, 1, 0, -1, 0, 1, 0]}
    ${1}     | ${[0, 1, 1, 0, 0, -1, -1, 0, 0, 1]}
    ${3}     | ${[0, 0, 0, 1, 1, 1, 1, 0, 0, 0]}
  `(
    'should get the right pattern for each position',
    ({ position, output }) => {
      expect(pattern(position, 10)).toEqual(output)
    }
  )

  it.each`
    position | output
    ${0}     | ${4}
    ${1}     | ${8}
    ${2}     | ${2}
  `('can calculate one digit', ({ position, output }) => {
    expect(calculateOutputDigit(position, [1, 2, 3, 4, 5, 6, 7, 8])).toBe(
      output
    )
  })

  it.each`
    start         | expected
    ${'12345678'} | ${'48226158'}
    ${'48226158'} | ${'34040438'}
    ${'34040438'} | ${'03415518'}
  `('can do one phase', ({ start, expected }) => {
    expect(phase(start)).toBe(expected)
  })

  it('can do multi phases', () => {
    expect(multiPhase('12345678', 4)).toBe('01029498')
  })

  it.each`
    start                                 | expected
    ${'80871224585914546619083218645595'} | ${'24176176'}
    ${'19617804207202209144916044189917'} | ${'73745418'}
    ${'69317163492948606335995924319873'} | ${'52432133'}
  `('agrees with the examples', ({ start, expected }) => {
    expect(multiPhase(start, 100).substring(0, 8)).toEqual(expected)
  })

  it('gets the message with the right offset', () => {
    expect(finalMessage(7, '98765432109876543210')).toEqual('21098765')
  })
})
