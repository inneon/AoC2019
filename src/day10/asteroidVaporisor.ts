import { Coord, difference, bestAsteroid, readMap } from './asteroidMapper'

export const angle = (base: Coord, target: Coord) => {
  const vector = difference(target, base)
  const partialResult = (Math.atan(vector.y / vector.x) * 180) / Math.PI
  const baseAngle = vector.x > 0 ? 90 : vector.x < 0 ? 270 : 90
  return baseAngle + partialResult
}

const sortByDistance = (base: Coord) => (a: Coord, b: Coord) =>
  Math.abs(base.x - a.x) -
  Math.abs(base.x - b.x) +
  (Math.abs(base.y - a.y) - Math.abs(base.y - b.y))

interface Bucket {
  [key: number]: Coord[]
}
export const toBucketedList = (base: Coord, others: Coord[]) => {
  const bucket: Bucket = {}
  others
    .filter(target => !(base.x === target.x && base.y === target.y))
    .map(target => ({
      ...target,
      angle: angle(base, target)
    }))
    .forEach(asteroid => {
      if (bucket[asteroid.angle]) {
        bucket[asteroid.angle].push({ x: asteroid.x, y: asteroid.y })
      } else {
        bucket[asteroid.angle] = [{ x: asteroid.x, y: asteroid.y }]
      }
    })
  return Object.keys(bucket)
    .map(angle => ({
      angle: Number(angle),
      asteroids: bucket[angle].sort(sortByDistance(base))
    }))
    .sort((a, b) => (Number(a.angle) > Number(b.angle) ? 1 : -1))
}

export const vaporise = (map: string[]) => {
  const base = bestAsteroid(map)
  const others = readMap(map)
  const buckets = toBucketedList(base, others)

  const order = []

  while (buckets.length > 0) {
    const current = buckets.shift()
    order.push(current.asteroids.shift())
    if (current.asteroids.length > 0) {
      buckets.push(current)
    }
  }

  return order
}
