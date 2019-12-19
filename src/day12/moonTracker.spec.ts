import {
  parse,
  applyGravityForPair,
  applyGravity,
  applyVelocity,
  energy,
  simulate
} from './moonTracker'

describe('moon tracking', () => {
  it('can parse the input', () => {
    const input = '<x=-7, y=-8, z=9>'
    expect(parse(input)).toEqual({ x: -7, y: -8, z: 9, dx: 0, dy: 0, dz: 0 })
  })

  it('can apply gravity to a single moon', () => {
    const input1 = parse('<x=1, y=0, z=0>')
    const input2 = parse('<x=5, y=0, z=0>')
    applyGravityForPair(input1, input2)

    expect(input1.dx).toBe(1)
  })

  it('can apply gravity to a system', () => {
    const input1 = parse('<x=1, y=2, z=0>')
    const input2 = parse('<x=5, y=2, z=-3>')
    const input3 = parse('<x=5, y=0, z=1>')

    applyGravity([input1, input2, input3])

    expect(input1.dx).toBe(2)
    expect(input1.dy).toBe(-1)
    expect(input1.dz).toBe(0)

    expect(input2.dx).toBe(-1)
    expect(input2.dy).toBe(-1)
    expect(input2.dz).toBe(2)

    expect(input3.dx).toBe(-1)
    expect(input3.dy).toBe(2)
    expect(input3.dz).toBe(-2)
  })

  it('can apply velocity', () => {
    const moon = {
      x: 0,
      y: 0,
      z: 0,
      dx: 2,
      dy: -4,
      dz: 0
    }
    applyVelocity([moon])

    expect(moon).toEqual({
      x: 2,
      y: -4,
      z: 0,
      dx: 2,
      dy: -4,
      dz: 0
    })
  })

  it('can calculate the total energy', () => {
    const moon = { x: 8, y: 12, z: 9, dx: 7, dy: 3, dz: 0 }

    expect(energy([moon])).toBe(290)
  })

  it('gets the same result as example 2', () => {
    const moons = simulate(
      [
        '<x=-8, y=-10, z=0>',
        '<x=5, y=5, z=10>',
        '<x=2, y=-7, z=3>',
        '<x=9, y=-8, z=-3>)'
      ],
      100
    )

    expect(energy(moons)).toBe(1940)
  })
})
