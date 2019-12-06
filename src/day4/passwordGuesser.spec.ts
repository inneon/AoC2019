import { enumerate, count } from './passwordGuesser'

describe('password guesser', () => {
  it('gets the right number for a 2 digit code', () => {
    const actual = count(2, 43, 78)
    expect(actual).toBe([44, 55, 66, 77].length)
  })

  it('gets the right number for a 3 digit code', () => {
    const actual = enumerate(3, 111, 222)
    expect(actual).toEqual([
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
      122,
      133,
      144,
      155,
      166,
      177,
      188,
      199
    ])
  })
})
