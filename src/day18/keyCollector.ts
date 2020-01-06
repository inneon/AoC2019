import arrayFlatten from 'array-flatten'

interface Coord {
  x: number
  y: number
}
interface Space extends Coord {
  token: string
}

const toTokenisedMap = (map: string): Space[][] =>
  map
    .split('\n')
    .map((line, y) => line.split('').map((token, x) => ({ token, x, y })))

export const getStart = (map: string | Space[][]) => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  const { x, y } = arrayFlatten(map).filter(
    ({ token }: Space) => token === '@'
  )[0]
  return { x, y }
}

export const allKeys = (map: string | Space[][]): string[] => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  return arrayFlatten(map)
    .filter(({ token }: Space) => 'a' <= token && token <= 'z')
    .map(({ token }) => token)
}

export const distances = (
  map: string | Space[][],
  x: number,
  y: number,
  gotKeys: string[]
) => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  const workingCopy = map.map(line => line.map(({ token }) => token))
  let distance = 0
  const passableSpaces = ['.', '@', ...gotKeys.map(key => key.toUpperCase())]

  const keys: { dist: number; key: string; x: number; y: number }[] = []

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
    if ('a' <= current && current <= 'z') {
      if (gotKeys.indexOf(current) === -1) {
        keys.push({ dist: distance, key: current, x, y })
      }
      enqueue({ x, y })
    } else if (passableSpaces.indexOf(current) !== -1) {
      enqueue({ x, y })
    }
    workingCopy[y][x] = distance.toString()
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

export const getAllKeys = (map: string | Space[][]) => {
  if (typeof map === 'string') map = toTokenisedMap(map)

  let total = 0
  const gotKeys = []
  const remaining = allKeys(map)
  let { x, y } = getStart(map)
  while (remaining.length > 0) {
    const dist = distances(map, x, y, gotKeys)[0]
    gotKeys.push(dist.key)
    remaining.splice(remaining.indexOf(dist.key), 1)
    total += dist.dist
    x = dist.x
    y = dist.y
  }

  return total
}
