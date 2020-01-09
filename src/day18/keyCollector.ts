import arrayFlatten from 'array-flatten'

interface Coord {
  x: number
  y: number
}
interface Space extends Coord {
  token: string
}
interface Adjacency {
  dist: number
  to: string
}
interface Dictionary<TValue> {
  [key: string]: TValue
}

const toTokenisedMap = (map: string): Space[][] =>
  map
    .split('\n')
    .map((line, y) => line.split('').map((token, x) => ({ token, x, y })))

export const getCoord = (map: string | Space[][], toFind: string) => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  const { x, y } = arrayFlatten(map).filter(
    ({ token }: Space) => token === toFind
  )[0]
  return { x, y }
}

export const allKeys = (map: string | Space[][]): string[] => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  return arrayFlatten(map)
    .filter(({ token }: Space) => 'a' <= token && token <= 'z')
    .map(({ token }) => token)
}

const allDoors = (map: string | Space[][]): string[] => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  return arrayFlatten(map)
    .filter(({ token }: Space) => 'A' <= token && token <= 'Z')
    .map(({ token }) => token)
}

export const getAdjacentItems = (from: string, map: string | Space[][]) => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  const { x, y } = getCoord(map, from)

  const workingCopy = map.map(line => line.map(({ token }) => token))
  let distance = 0

  const keys: Adjacency[] = []

  const toExplore: (Coord | 'increment')[] = [{ x, y }, 'increment']
  const enqueue = ({ x, y }) => {
    ;[
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ].forEach(({ dx, dy }) => {
      toExplore.push({ x: x + dx, y: y + dy })
    })
  }
  const exploreSpace = ({ x, y }) => {
    const current = workingCopy[y][x]
    if (current === '#') {
      // do nothing
    } else if (current === '.' || current === from) {
      enqueue({ x, y })
    } else {
      keys.push({ dist: distance, to: current })
    }
    workingCopy[y][x] = '#'
  }

  while (toExplore.length > 1) {
    const current = toExplore.shift()
    if (current === 'increment') {
      distance++
      toExplore.push('increment')
    } else {
      exploreSpace(current)
    }
  }

  return keys
}

export const buildAdjacencyMap = (
  map: string | Space[][]
): Dictionary<Adjacency[]> => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  return [...allKeys(map), ...allDoors(map), '@'].reduce(
    (prev: object, token: string) => {
      let result = {
        ...prev
      }
      result[token] = getAdjacentItems(token, map)
      return result
    },
    {}
  )
}

const isKey = (toCheck: string) => toCheck !== toCheck.toUpperCase()
const isDoor = (toCheck: string) => toCheck !== toCheck.toLowerCase()

export const shouldExpand = (
  token: string,
  keys: string[],
  visited: Dictionary<number>,
  distance: number
) => {
  if (isDoor(token)) {
    return keys.indexOf(token.toLowerCase()) !== -1
  }
  if (!visited[token]) return true

  return distance < visited[token]
}

const getAllKeysRecursively = (
  adjencies: Dictionary<Adjacency[]>,
  toGet: string[],
  visited: string[],
  keys: string[],
  at: string,
  current: number,
  depth: number
) => {
  if (toGet.length === 0) {
    return current
  }
  const dist = adjencies[at]
  return (
    dist
      // .filter(({ dist, to }) => shouldExpand(to, keys))
      .reduce((prev, { dist, to }) => {
        if (current + dist > prev) {
          return prev
        }
        if (isKey(at)) {
          keys = [...keys, at]
        }
        const subDistance = getAllKeysRecursively(
          adjencies,
          toGet.filter(k => k !== to),
          [...visited, to],
          keys,
          to,
          current + dist,
          depth + 1
        )
        return subDistance < prev ? subDistance : prev
      }, Number.MAX_SAFE_INTEGER)
  )
}

export const getAllKeys = (map: string | Space[][]) => {
  if (typeof map === 'string') map = toTokenisedMap(map)
  const remaining = allKeys(map)
  return getAllKeysRecursively(
    buildAdjacencyMap(map),
    remaining,
    [],
    [],
    '@',
    0,
    0
  )
}
