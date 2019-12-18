import { toBucketedList, angle, vaporise } from './asteroidVaporisor'

const round = (num: number, dp: number) =>
  Math.round(num * Math.pow(10, dp)) / Math.pow(10, dp)

describe('Asteroid vaporisor', () => {
  it('can order the bottom right quadrant', () => {
    expect(
      toBucketedList({ x: 1, y: 1 }, [
        { x: 2, y: 1 },
        { x: 3, y: 3 },
        { x: 2, y: 2 },
        { x: 1, y: 2 }
      ])
    ).toEqual([
      {
        angle: 90,
        asteroids: [{ x: 2, y: 1 }]
      },
      {
        angle: 135,
        asteroids: [
          { x: 2, y: 2 },
          { x: 3, y: 3 }
        ]
      },
      {
        angle: 180,
        asteroids: [{ x: 1, y: 2 }]
      }
    ])
  })

  it('gets the angle for directly up', () => {
    const result = angle({ x: 1, y: 1 }, { x: 1, y: 0 })
    expect(round(result, 2)).toBe(0)
  })

  it('gets the angle between the base and the target for upper right quadrant', () => {
    const result = angle({ x: 1, y: 1 }, { x: 3, y: 0 })
    expect(round(result, 2)).toBe(63.43)
  })

  it('gets the angle for directly right', () => {
    const result = angle({ x: 1, y: 1 }, { x: 2, y: 1 })
    expect(round(result, 2)).toBe(90)
  })

  it('gets the angle between the base and the target for lower right quadrant', () => {
    expect(angle({ x: 1, y: 1 }, { x: 2, y: 2 })).toBe(135)
  })

  it('gets the angle for directly down', () => {
    const result = angle({ x: 1, y: 1 }, { x: 1, y: 2 })
    expect(round(result, 2)).toBe(180)
  })

  it('gets the angle between the base and the target for lower left quadrant', () => {
    const result = angle({ x: 1, y: 1 }, { x: 0, y: 2 })
    expect(round(result, 2)).toBe(225)
  })

  it('gets the angle for directly left', () => {
    const result = angle({ x: 1, y: 1 }, { x: 0, y: 1 })
    expect(round(result, 2)).toBe(270)
  })

  it('gets the angle between the base and the target for upper left quadrant', () => {
    const result = angle({ x: 1, y: 1 }, { x: 0, y: 0 })
    expect(round(result, 2)).toBe(315)
  })

  it('gets the same result as example 1', () => {
    const map = [
      '.#....#####...#..',
      '##...##.#####..##',
      '##...#...#.#####.',
      '..#.....#...###..',
      '..#.#.....#....##'
    ]
    const vaporised = vaporise(map).slice(0, 9)

    expect(vaporised).toEqual([
      { x: 8, y: 1 },
      { x: 9, y: 0 },
      { x: 9, y: 1 },
      { x: 10, y: 0 },
      { x: 9, y: 2 },
      { x: 11, y: 1 },
      { x: 12, y: 1 },
      { x: 11, y: 2 },
      { x: 15, y: 1 }
    ])
  })

  it('gets the same result as example 2', () => {
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
    const vaporised = vaporise(map)

    expect(vaporised[0]).toEqual({ x: 11, y: 12 })
    expect(vaporised[1]).toEqual({ x: 12, y: 1 })
    expect(vaporised[2]).toEqual({ x: 12, y: 2 })
    expect(vaporised[9]).toEqual({ x: 12, y: 8 })
    expect(vaporised[19]).toEqual({ x: 16, y: 0 })
    expect(vaporised[199]).toEqual({ x: 8, y: 2 })
  })
})
