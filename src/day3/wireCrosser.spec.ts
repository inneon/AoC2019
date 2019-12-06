import { getClosestCrossingPoint } from './wireCrosser'

describe('wire crosser', () => {
  it('matches the simplest example', () => {
    const actual = getClosestCrossingPoint('R8,U5,L5,D3', 'U7,R6,D4,L4')

    expect(actual).toBe(6)
  })

  it('matches example 1', () => {
    const actual = getClosestCrossingPoint(
      'R75,D30,R83,U83,L12,D49,R71,U7,L72',
      'U62,R66,U55,R34,D71,R55,D58,R83'
    )

    expect(actual).toBe(159)
  })

  it('matches example 2', () => {
    const actual = getClosestCrossingPoint(
      'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
      'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
    )

    expect(actual).toBe(135)
  })
})
