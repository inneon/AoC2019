import { count, transfers } from './orbitMapper'

describe('orbit mapper', () => {
  it('can count a simple system', () => {
    expect(count(['COM)ABC'])).toBe(1)
  })

  it('can build an ordered system', () => {
    expect(count(['COM)B', 'COM)C', 'B)D'])).toBe(4)
  })

  it('matches example 1', () => {
    const orbits = [
      'COM)B',
      'B)C',
      'C)D',
      'D)E',
      'E)F',
      'B)G',
      'G)H',
      'D)I',
      'E)J',
      'J)K',
      'K)L'
    ]
    expect(count(orbits)).toBe(42)
  })

  it('matches example 2', () => {
    const orbits = [
      'COM)B',
      'B)C',
      'C)D',
      'D)E',
      'E)F',
      'B)G',
      'G)H',
      'D)I',
      'E)J',
      'J)K',
      'K)L',
      'K)YOU',
      'I)SAN'
    ]
    expect(transfers(orbits)).toBe(4)
  })
})
