import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'

interface Dictionary<TVal> {
  [key: number]: TVal
}

const screen: Dictionary<Dictionary<number>> = {}

const addBlock = (num: number) => {
  let row = screen[y]
  if (!row) {
    row = {}
    screen[y] = row
  }

  row[x] = num
}

let x: number
let y: number
let stage: 1 | 2 | 3 = 1
const output = (num: number) => {
  if (stage === 1) {
    stage = 2
    x = num
  } else if (stage === 2) {
    stage = 3
    y = num
  } else if (stage === 3) {
    stage = 1
    if (x === -1) {
      score = num
    } else {
      addBlock(num)
      if (num === 4) {
        if (ready) {
          printScreen()
        } else {
          ready = true
        }
      }
    }
  }
}

export const drawScreen = (program: string) => {
  interpretCode(program, joystick, output)
  return score
}

const joystick = () => {
  if (ballX < paddleX) {
    paddleX--
    return -1
  }
  if (ballX > paddleX) {
    paddleX++
    return 1
  }
  return 0
}

let score: number
let ballX: number
let paddleX: number
let blocks: number = 0
let ready = false
export const printScreen = () => {
  let string = ''
  for (let y = 0; y <= 22; y++) {
    for (let x = 0; x <= 43; x++) {
      switch (screen[y][x]) {
        case 0:
          string += ' '
          break
        case 1:
          string += '#'
          break
        case 2:
          string += '+'
          blocks++
          break
        case 3:
          string += '_'
          paddleX = x
          break
        case 4:
          string += '*'
          ballX = x
          break

        default:
          break
      }
    }
    string += '\r\n'
  }
  console.log(string)
  console.log(blocks, score)
}
