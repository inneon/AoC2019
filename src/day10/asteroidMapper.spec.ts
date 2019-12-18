import {
  readMap,
  intermediateSpaces,
  blocked,
  countAsteroidsInSight,
  bestAsteroid
} from './asteroidMapper'

describe('asteroid mapper', () => {
  it('should read the map', () => {
    const mapped = readMap(['#.', '..', '##'])

    expect(mapped).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 1, y: 2 }
    ])
  })

  it('should generate diagonal intermediate spaces', () => {
    const spaces = intermediateSpaces({ x: 1, y: 1 }, { x: 4, y: 7 })

    expect(spaces).toEqual([
      { x: 2, y: 3 },
      { x: 3, y: 5 }
    ])
  })

  it('should generate horizontal intermediate spaces', () => {
    const spaces = intermediateSpaces({ x: 1, y: 1 }, { x: 4, y: 1 })

    expect(spaces).toEqual([
      { x: 2, y: 1 },
      { x: 3, y: 1 }
    ])
  })

  it('should generate vertical intermediate spaces', () => {
    const spaces = intermediateSpaces({ x: 1, y: 4 }, { x: 1, y: 1 })

    expect(spaces).toEqual([
      { x: 1, y: 3 },
      { x: 1, y: 2 }
    ])
  })

  it('can tell if an asteroid is blocked', () => {
    const map = ['#..', '.#.', '..#']
    const start = { x: 0, y: 0 }
    const end = { x: 2, y: 2 }

    expect(blocked(start, end, map)).toBe(true)
  })

  it('can tell if an asteroid has clear LoS', () => {
    const map = ['#..', '...', '..#']
    const start = { x: 0, y: 0 }
    const end = { x: 2, y: 2 }

    expect(blocked(start, end, map)).toBe(false)
  })

  it('can count the asteroids in sight', () => {
    const map = ['.#..#', '.....', '#####', '....#', '...##']
    const all = readMap(map)

    expect(countAsteroidsInSight({ x: 4, y: 2 }, all, map)).toBe(5)
  })

  it('matches example 1', () => {
    const map = ['.#..#', '.....', '#####', '....#', '...##']
    const result = bestAsteroid(map)

    expect(result.count).toBe(8)
    expect(result.x).toBe(3)
    expect(result.y).toBe(4)
  })

  it('matches example 4', () => {
    const map = [
      '.#..##.###...#######',
      '##.############..##.',
      '.#.######.########.#',
      '.###.#######.####.#.',
      '#####.##.#.##.###.##',
      '..#####..#.#########',
      '####################',
      '#.####....###.#.#.##',
      '##.#################',
      '#####.##.###..####..',
      '..######..##.#######',
      '####.##.####...##..#',
      '.#####..#.######.###',
      '##...#.##########...',
      '#.##########.#######',
      '.####.#.###.###.#.##',
      '....##.##.###..#####',
      '.#.#.###########.###',
      '#.#.#.#####.####.###',
      '###.##.####.##.#..##'
    ]
    const result = bestAsteroid(map)

    expect(result.count).toBe(210)
    expect(result.x).toBe(11)
    expect(result.y).toBe(13)
  })
})
