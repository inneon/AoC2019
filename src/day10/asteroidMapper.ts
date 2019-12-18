export interface Coord {
  x: number
  y: number
}

const greatestCommonFactor = (x: number, y: number) => {
  x = Math.abs(x)
  y = Math.abs(y)
  while (y) {
    var temp = y
    y = x % y
    x = temp
  }
  return x
}

export const readMap = (map: string[]): Coord[] =>
  map
    .map((row, y) =>
      row.split('').map((col, x) => {
        if (col === '#') return { x, y }
      })
    )
    .reduce((acc, val) => acc.concat(val), [])
    .filter(coord => coord !== undefined)

export const difference = (start: Coord, end: Coord) => ({
  x: start.x - end.x,
  y: start.y - end.y
})

export const intermediateSpaces = (start: Coord, end: Coord) => {
  const vector = difference(end, start)
  const gcf = greatestCommonFactor(vector.x, vector.y)
  vector.x = vector.x / gcf
  vector.y = vector.y / gcf

  const result: Coord[] = []
  for (let i = 1; i < gcf; i++) {
    result.push({
      x: start.x + i * vector.x,
      y: start.y + i * vector.y
    })
  }

  return result
}

export const blocked = (start: Coord, end: Coord, map: string[]) =>
  intermediateSpaces(start, end)
    .map(coord => map[coord.y][coord.x] === '#')
    .reduce((prev, curr) => prev || curr, false)

export const countAsteroidsInSight = (
  current: Coord,
  all: Coord[],
  map: string[]
) =>
  all
    .filter(coord => coord.x !== current.x || coord.y !== current.y)
    .map(target => blocked(current, target, map))
    .filter(blocked => !blocked).length

export const bestAsteroid = (map: string[]) => {
  const all = readMap(map)
  return all
    .map(current => ({
      ...current,
      count: countAsteroidsInSight(current, all, map)
    }))
    .reduce((prev, curr) => {
      if (curr.count > prev.count) {
        return curr
      }
      return prev
    })
}
