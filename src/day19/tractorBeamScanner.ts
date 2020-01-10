import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'

export const scanBeam = (program: string) => {
  let total = 0
  const print = true
  let line = ''
  let min = Number.MAX_SAFE_INTEGER
  let max = 0

  // for (let y = 1100; y < 1210; y++) {
  //   for (let x = 1370; x < 1480; x++) {
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      const stack = [x, y]
      interpretCode(
        program,
        () => stack.shift(),
        (num: number) => {
          total += num
          line += num + ','
          const grad = x / y
          if (grad > max && num === 1) max = grad
          if (grad < min && num === 1) min = grad
        }
      )
    }
    if (print) {
      console.log(line, total)
      line = ''
      total = 0
    }
  }
  console.log(max, min)
  return total
}

const nextSpace = (x: number, y: number, program: string) => {
  y++
  x++
  const result = { x, y }

  let inBeam = true
  do {
    const stack = [x, y]
    interpretCode(
      program,
      () => stack.shift(),
      (num: number) => {
        if (num === 0) {
          inBeam = false
          x--
          result.x = x
        } else {
          x++
          result.x = x
        }
      }
    )
  } while (inBeam)
  return { x, y }
}

export const checkBeam = (program: string, size: number) => {
  let keepGoing = true
  let x = 3,
    y = 2
  while (keepGoing) {
    const next = nextSpace(x, y, program)
    y = next.y
    x = next.x

    if (y - size > 0) {
      const stack = [x - size + 1, y + size - 1]
      interpretCode(
        program,
        () => stack.shift(),
        (num: number) => {
          // console.log(x - size, y + size, num)
          if (num === 1) {
            keepGoing = false
            console.log('found it', x, y, [x - size + 1, y + size - 1])
          }
        }
      )
      const stack2 = [x, y]
      interpretCode(
        program,
        () => stack2.shift(),
        (num: number) => {
          // console.log('-', x, y, num)
        }
      )
    }
  }
}
