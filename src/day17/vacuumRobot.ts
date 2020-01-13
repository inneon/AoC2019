import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'
import { asciiBot } from '../intCodeInterpreter/asciiBot'

const cartesian = <T>(as: T[], bs: T[]): T[][] =>
  [].concat(...as.map(a => bs.map(b => [].concat(a, b))))
const generateCoords = (map: string[][]) => {
  return cartesian(
    [...Array(map[0].length).keys()],
    [...Array(map.length).keys()]
  )
}

const read = (program: string) => {
  let currentRow: string[] = []
  const map: string[][] = [currentRow]

  const output = (num: number) => {
    if (num === 10) {
      currentRow = []
      map.push(currentRow)
    } else {
      currentRow.push(String.fromCharCode(num))
    }
  }

  interpretCode(program, () => 0, output)

  return map
}

export const toRendered = (program: string) => {
  const map = read(program)

  const rendered = map
    .filter(row => row.length > 0)
    .reduce((prevRow, currentRow) => {
      return `${prevRow}\n${currentRow.reduce((prev, curr) => prev + curr)}`
    }, '')
  return rendered.trimLeft()
}

export const alignmentParameters = (map: string[][] | string) => {
  if (typeof map === 'string') {
    map = read(map)
  }
  const coords = generateCoords(map)
  const offsets = [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }
  ]
  const isIntersection = (x: number, y: number) => {
    return (
      offsets.filter(({ dx, dy }) => map[y + dy] && map[y + dy][x + dx] === '#')
        .length === 5
    )
  }
  const intersections = coords.filter(coord => {
    const [x, y] = coord
    return isIntersection(x, y)
  })

  return intersections.reduce((prev, [x, y]) => prev + x * y, 0)
}

type dir = 'l' | 'r' | 'u' | 'd'
const startLoc = (map: string[][]) => {
  let x = 0,
    y = 0,
    facing: dir

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const index = ['<', '>', '^', 'v'].indexOf(map[i][j])
      if (index !== -1) {
        x = j
        y = i
        facing = ['l', 'r', 'u', 'd'][index] as dir
      }
    }
  }

  return {
    x,
    y,
    facing
  }
}

interface Direction {
  f: {
    x: number
    y: number
  }
  l: {
    x: number
    y: number
    d: dir
  }
  r: {
    x: number
    y: number
    d: dir
  }
}

const directions = {
  l: {
    f: {
      x: -1,
      y: 0
    },
    l: {
      y: 1,
      x: 0,
      d: 'd'
    },
    r: {
      y: -1,
      x: 0,
      d: 'u'
    }
  } as Direction,
  r: {
    f: {
      x: 1,
      y: 0
    },
    r: {
      y: 1,
      x: 0,
      d: 'd' as dir
    },
    l: {
      y: -1,
      x: 0,
      d: 'u' as dir
    }
  } as Direction,
  u: {
    f: {
      x: 0,
      y: -1
    },
    r: {
      y: 0,
      x: 1,
      d: 'r' as dir
    },
    l: {
      y: 0,
      x: -1,
      d: 'l' as dir
    }
  } as Direction,
  d: {
    f: {
      x: 0,
      y: 1
    },
    l: {
      y: 0,
      x: 1,
      d: 'r' as dir
    },
    r: {
      y: 0,
      x: -1,
      d: 'l' as dir
    }
  } as Direction
}

const turn = (
  map: string[][],
  facing: dir,
  x: number,
  y: number,
  path: string[]
): dir | 'finished' => {
  const direction = directions[facing] as Direction
  if (
    map[y + direction.l.y] &&
    map[y + direction.l.y][x + direction.l.x] === '#'
  ) {
    path.push('L')
    return direction.l.d
  } else if (
    map[y + direction.r.y] &&
    map[y + direction.r.y][x + direction.r.x] === '#'
  ) {
    path.push('R')
    return direction.r.d
  }

  return 'finished'
}

const forward = (
  map: string[][],
  facing: dir,
  x: number,
  y: number,
  path: string[]
) => {
  const dx = (directions[facing] as Direction).f.x
  const dy = (directions[facing] as Direction).f.y

  let steps = 0

  while (map[y + dy] && map[y + dy][x + dx] === '#') {
    steps++
    y += dy
    x += dx
  }
  path.push(steps.toString())
  return {
    nextX: x,
    nextY: y
  }
}

export const toPath = (map: string[][] | string) => {
  if (typeof map === 'string') {
    map = read(map)
  }
  let { x, y, facing } = startLoc(map)
  const path = []

  let finished = false

  while (!finished) {
    const turnInstr = turn(map, facing, x, y, path)
    if (turnInstr === 'finished') {
      finished = true
    } else {
      facing = turnInstr
    }
    if (!finished) {
      const { nextX, nextY } = forward(map, facing, x, y, path)
      x = nextX
      y = nextY
    }
  }

  return path.join(',') + ','
}

export const getDust = (program: string, instructions: string[]) => {
  return asciiBot(program, instructions)
}
