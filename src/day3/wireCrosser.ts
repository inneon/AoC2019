import e = require('express')

const buildPath = (wirePath: string): Path[] => {
  let x = 0,
    y = 0,
    length = 0
  return wirePath.split(',').map(command => {
    const currX = x
    const currY = y
    const currLength = length

    const distance = Number(command.slice(1))
    length += distance
    switch (command[0]) {
      case 'U':
        y += distance
        break
      case 'D':
        y -= distance
        break
      case 'L':
        x -= distance
        break
      case 'R':
        x += distance
        break
      default:
        break
    }
    return {
      currX,
      currY,
      currLength,
      nextX: x,
      nextY: y,
      nextLength: length
    }
  })
}

interface Path {
  currX: number
  currY: number
  nextX: number
  nextY: number
  currLength: number
}

function* getCrossingPoints(path1: Path[], path2: Path[]) {
  for (let i = 0; i < path1.length; i++) {
    const path1Segment = path1[i]
    for (let j = 0; j < path2.length; j++) {
      const path2Segment = path2[j]
      const xCross =
        path1Segment.currX > path2Segment.currX !==
        path1Segment.nextX > path2Segment.nextX
      const yCross =
        path1Segment.currY > path2Segment.currY !==
        path1Segment.nextY > path2Segment.nextY

      if (xCross && yCross) {
        if (path1Segment.currX === path1Segment.nextX) {
          yield {
            x: path1Segment.currX,
            y: path2Segment.currY,
            path1Distance:
              path1Segment.currLength +
              Math.abs(path1Segment.currY - path2Segment.currY),
            path2Distance:
              path2Segment.currLength +
              Math.abs(path1Segment.currX - path2Segment.currX)
          }
        } else {
          yield {
            x: path2Segment.currX,
            y: path1Segment.currY,
            path1Distance:
              path1Segment.currLength +
              Math.abs(path1Segment.currX - path2Segment.currX),
            path2Distance:
              path2Segment.currLength +
              Math.abs(path1Segment.currY - path2Segment.currY)
          }
        }
      }
    }
  }
}

export const getClosestCrossingPoint = (wire1: string, wire2: string) => {
  const wire1Path = buildPath(wire1)
  const wire2Path = buildPath(wire2)

  const crossingPoints = Array.from(getCrossingPoints(wire1Path, wire2Path))
  return crossingPoints
    .map(coord => Math.abs(coord.x) + Math.abs(coord.y))
    .sort((a, b) => a - b)[0]
}

export const getQuickestCrossingPoint = (wire1: string, wire2: string) => {
  const wire1Path = buildPath(wire1)
  const wire2Path = buildPath(wire2)

  const crossingPoints = Array.from(getCrossingPoints(wire1Path, wire2Path))
  return crossingPoints
    .map(coord => coord.path1Distance + coord.path2Distance)
    .sort((a, b) => a - b)[0]
}
