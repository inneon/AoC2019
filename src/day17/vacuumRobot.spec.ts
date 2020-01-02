import { toRendered, alignmentParameters, toPath } from './vacuumRobot'

describe('the vacuuming robot', () => {
  it('get the outputs from the robot', () => {
    const program = `104,${'.'.charCodeAt(0)},104,${'#'.charCodeAt(
      0
    )},104,${'<'.charCodeAt(0)},99`
    const actual = toRendered(program)

    expect(actual).toBe('.#<')
  })

  it('gets the alignment parameters', () => {
    const map = [
      '.#...'.split(''),
      '.#...'.split(''),
      '#####'.split(''),
      '.#...'.split('')
    ]

    expect(alignmentParameters(map)).toBe(2)
  })

  it('can make a path', () => {
    const map = `.....
.##..
.#...
.>...`
      .split('\n')
      .map(line => line.split(''))

    expect(toPath(map)).toBe('L,2,R,1,')
  })
})
