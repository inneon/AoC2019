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
    addBlock(num)
  }
}

export const drawScreen = (program: string) => {
  interpretCode(program, () => 0, output)
  return screen
}

export const printScreen = (program: string) => {
  let string = ''
  let count = 0
  drawScreen(program)
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
          count++
          break
        case 3:
          string += '_'
          break
        case 4:
          string += '*'
          break

        default:
          break
      }
    }
    string += '\r\n'
  }
  console.log(string)
  console.log(count)
}
