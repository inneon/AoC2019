interface Space {
  token: string
  x: number
  y: number
}

interface Portal {
  name: string
  x: number
  y: number
  z: number
  from: {
    x: number
    y: number
  }
}

const getPortals = (map: Space[][]) => {
  const result: Portal[] = []

  const boundRight = map[0].length - 3
  const boundBottom = map.length - 3
  let boundInnerLeft = -1
  let boundInnerRight = -1
  let boundInnerTop = -1
  let boundInnerBottom = -1

  for (let x = 2; x < boundRight; x++) {
    if (map[2][x].token === '.') {
      result.push({
        name: map[0][x].token + map[1][x].token,
        x,
        y: 2,
        z: -1,
        from: {
          x,
          y: 1
        }
      })
    }

    if (map[boundBottom][x].token === '.') {
      result.push({
        name: map[boundBottom + 1][x].token + map[boundBottom + 2][x].token,
        x,
        y: boundBottom,
        z: -1,
        from: {
          x,
          y: boundBottom + 1
        }
      })
    }

    for (let y = 2; y < boundBottom; y++) {
      if (map[y][x].token === ' ') boundInnerRight = x
      if (map[y][x].token === ' ' && boundInnerLeft === -1) boundInnerLeft = x
    }
  }

  for (let y = 2; y < boundBottom; y++) {
    if (map[y][2].token === '.') {
      result.push({
        name: map[y][0].token + map[y][1].token,
        x: 2,
        y,
        z: -1,
        from: {
          x: 1,
          y
        }
      })
    }

    if (map[y][boundRight].token === '.') {
      result.push({
        name: map[y][boundRight + 1].token + map[y][boundRight + 2].token,
        x: boundRight,
        y: y,
        z: -1,
        from: {
          x: boundRight + 1,
          y
        }
      })
    }
    for (let x = 2; x < boundRight; x++) {
      if (map[y][x].token === ' ') boundInnerBottom = y
      if (map[y][x].token === ' ' && boundInnerTop === -1) boundInnerTop = y
    }
  }

  boundInnerLeft--
  boundInnerRight++
  boundInnerTop--
  boundInnerBottom++

  for (let x = boundInnerLeft; x <= boundInnerRight; x++) {
    if (map[boundInnerTop][x].token === '.') {
      result.push({
        name: map[boundInnerTop + 1][x].token + map[boundInnerTop + 2][x].token,
        x,
        y: boundInnerTop,
        z: 1,
        from: {
          x,
          y: boundInnerTop + 1
        }
      })
    }

    if (map[boundInnerBottom][x].token === '.') {
      result.push({
        name:
          map[boundInnerBottom - 2][x].token +
          map[boundInnerBottom - 1][x].token,
        x,
        y: boundInnerBottom,
        z: 1,
        from: {
          x,
          y: boundInnerBottom - 1
        }
      })
    }
  }

  for (let y = boundInnerTop; y <= boundInnerBottom; y++) {
    if (map[y][boundInnerLeft].token === '.') {
      result.push({
        name:
          map[y][boundInnerLeft + 1].token + map[y][boundInnerLeft + 2].token,
        x: boundInnerLeft,
        y,
        z: 1,
        from: {
          x: boundInnerLeft + 1,
          y
        }
      })
    }

    if (map[y][boundInnerRight].token === '.') {
      result.push({
        name:
          map[y][boundInnerRight - 2].token + map[y][boundInnerRight - 1].token,
        x: boundInnerRight,
        y,
        z: 1,
        from: {
          x: boundInnerRight - 1,
          y
        }
      })
    }
  }

  return result.sort((a, b) => a.y * 1000 + a.x - b.y * 1000 - b.x)
}

export const parseMap = (map: string) => {
  const tokens: Space[][] = map
    .split('\n')
    .map((line, y) => line.split('').map((token, x) => ({ token, x, y })))

  const portals = getPortals(tokens)

  const start = portals.filter(token => token.name == 'AA')[0]
  const end = portals.filter(token => token.name == 'ZZ')[0]
  return {
    start: { x: start.x, y: start.y },
    end: { x: end.x, y: end.y },
    portals,
    tokens
  }
}

const print = (map: Space[][]) => {
  let line = ''
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      line += map[y][x].token
    }
    line += '\n'
  }
  console.log(line)
}

const clone = (map: Space[][]) =>
  map.map(line => line.map(space => ({ ...space })))

export const getToEnd = (map: string, recursive: boolean) => {
  const { start, end, portals, tokens } = parseMap(map)
  const fresh = clone(tokens)
  const levels = [clone(fresh)]

  let queue: (
    | { type: 'coord'; x: number; y: number; z: number }
    | { type: 'increment'; myToken: string; otherToken: string }
  )[] = [
    { type: 'coord', ...start, z: 0 },
    { type: 'increment', myToken: 'o', otherToken: 'x' },
    { type: 'coord', ...end, z: 0 },
    { type: 'increment', myToken: 'x', otherToken: 'o' }
  ]

  let dist = 0
  let myToken = 'x'
  let otherToken = 'o'

  while (queue.length > 2) {
    const curr = queue.shift()
    if (curr.type === 'coord') {
      const { x, y, z } = curr
      if (levels[z][y][x].token === otherToken) {
        return dist - 1
      }
      queue.push(
        ...[
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 }
        ]
          .map(({ x: dx, y: dy }) => {
            return {
              type: 'coord' as 'coord',
              x: dx + x,
              y: dy + y,
              z
            }
          })
          .map(({ x, y }) => {
            const portal = portals.filter(
              p => p.from.x === x && p.from.y === y
            )[0]
            if (portal) {
              const otherEnd = portals.filter(
                p =>
                  p.name === portal.name && p.x !== portal.x && p.y != portal.y
              )[0]
              if (otherEnd) {
                const nextZ = recursive ? z - otherEnd.z : z
                if (nextZ === -1) {
                  return { x: 0, y: 0, z: 0, type: 'coord' as 'coord' }
                }
                if (nextZ === levels.length) {
                  levels.push(clone(fresh))
                }

                return {
                  type: 'coord' as 'coord',
                  x: otherEnd.x,
                  y: otherEnd.y,
                  z: nextZ
                }
              }
            }
            return {
              type: 'coord' as 'coord',
              x,
              y,
              z
            }
          })
          .filter(({ x, y, z }) => levels[z][y][x].token === '.')
      )

      levels[z][y][x].token = myToken
    } else if (curr.type === 'increment') {
      dist++
      myToken = curr.myToken
      otherToken = curr.otherToken
      queue.push(curr)
    }
  }
  return -1
}
