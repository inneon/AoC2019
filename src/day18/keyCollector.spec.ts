import {
  getCoord,
  getAllKeys,
  allKeys,
  getAdjacentItems,
  buildAdjacencyMap,
  shouldExpand
} from './keyCollector'

describe('key collector', () => {
  it('can find the entrance', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(getCoord(map, '@')).toEqual({ x: 5, y: 1 })
  })

  it('can get a list of all keys', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(allKeys(map)).toContain('a')
    expect(allKeys(map)).toContain('b')
  })

  it('can get the list of object and distances from the entrance', () => {
    const map = `#########
#b.A.@.a#
#########`

    expect(getAdjacentItems('@', map)).toContainEqual({
      to: 'a',
      dist: 2
    })
    expect(getAdjacentItems('@', map)).toContainEqual({
      to: 'A',
      dist: 2
    })
  })

  it('can build an adjacency map', () => {
    const map = `#########
#b.A..@a#
#########`

    const adjacency = buildAdjacencyMap(map)
    expect(adjacency).toEqual({
      a: [{ to: '@', dist: 1 }],
      A: [
        { to: 'b', dist: 2 },
        { to: '@', dist: 3 }
      ],
      b: [{ to: 'A', dist: 2 }],
      '@': [
        { to: 'a', dist: 1 },
        { to: 'A', dist: 3 }
      ]
    })
  })

  it('should expand a node with a key', () => {
    expect(shouldExpand('a', [], {}, 0)).toBe(true)
  })

  it('should expand a node with a open door', () => {
    expect(shouldExpand('A', ['a'], {}, 0)).toBe(true)
  })

  it('should not expand a node with a locked door', () => {
    expect(shouldExpand('A', [], {}, 0)).toBe(false)
  })

  it('should not expand a node that it has already explored more cheaply', () => {
    expect(shouldExpand('a', [], { a: 2 }, 3)).toBe(false)
  })

  it.skip('can get all keys', () => {
    const map = `#########
#b.A.@.a#
#########`
    expect(getAllKeys(map)).toBe(8)
  })

  it.skip('agrees with example 2', () => {
    const map = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`

    expect(getAllKeys(map)).toBe(86)
  })
})
