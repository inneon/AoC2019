import { getStart, distances, getAllKeys, allKeys } from './keyCollector'

describe('key collector', () => {
  it('can find the entrance', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(getStart(map)).toEqual({ x: 5, y: 1 })
  })

  it('can get a list of all keys', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(allKeys(map)).toContain('a')
    expect(allKeys(map)).toContain('b')
  })

  it('can find the distance to the nearest key', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(distances(map, 5, 1, [])[0]).toEqual({
      key: 'a',
      dist: 2,
      x: 7,
      y: 1
    })
  })

  it('can find the distance to keys passed a door', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(distances(map, 5, 1, ['a'])).toContainEqual({
      key: 'b',
      dist: 4,
      x: 1,
      y: 1
    })
  })

  it('can get all keys', () => {
    const map = `#########
#b.A.@.a#
#########`
    expect(getAllKeys(map)).toBe(8)
  })
})
