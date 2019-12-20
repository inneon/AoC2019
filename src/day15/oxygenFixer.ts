import fs from 'fs'

import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'

interface Dictionary<TVal> {
  [key: number]: TVal
}

const pad = (num: number) => {
  if (num < 10) {
    return '00' + num
  } else if (num < 100) {
    return '0' + num
  } else {
    return '' + num
  }
}

class OxygenFixer {
  private ship: Dictionary<Dictionary<string>> = { 0: { 0: '...' } }
  private x = 0
  private y = 0
  private t = 0
  private b = 0
  private l = 0
  private r = 0
  private direction: number
  private controller: () => number

  constructor(controller: (controllee: OxygenFixer) => () => number) {
    this.controller = () => {
      this.direction = controller(this)()
      return this.direction
    }
  }

  public load = (serialised: string) => {
    const { ship, t, b, l, r } = JSON.parse(serialised)
    this.ship = ship
    this.l = l
    this.r = r
    this.t = t
    this.b = b
    this.distanceToGrate()
  }

  private distanceToGrate = () => {
    let queue: (
      | { type: 'coord'; x: number; y: number }
      | { type: 'increment'; dist: number }
    )[] = [
      { type: 'coord', x: 0, y: 0 },
      { type: 'increment', dist: 1 }
    ]

    let dist = 0

    while (queue.length > 1) {
      console.log(queue, queue.length)
      let curr = queue.shift()
      if (curr.type === 'coord') {
        const { x: currX, y: currY } = curr
        queue.push(
          ...[
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
          ]
            .map(({ x, y }) => ({
              type: 'coord' as 'coord',
              x: currX + x,
              y: currY + y
            }))
            .filter(
              ({ x, y }) =>
                this.ship[y][x] === '...' || this.ship[y][x] === 'DDD'
            )
        )
        if (this.ship[currY][currX] === 'DDD') {
          queue = []
        }
        this.ship[currY][currX] = pad(dist)
      } else if (curr.type === 'increment') {
        dist = curr.dist
        queue.push({ type: 'increment', dist: dist + 1 })
      }
    }
    this.print()
  }

  public print = () => {
    let map = ''
    for (let i = this.t; i <= this.b; i++) {
      for (let j = this.l; j <= this.r; j++) {
        if (j === this.x && i === this.y) {
          map += 'DDD'
        } else {
          const char = this.ship[i][j]
          if (char) {
            map += char
          } else {
            map += '   '
          }
        }
      }
      map += '\r\n'
    }
    return map
  }

  private addToMap = (symbol: string, x: number, y: number) => {
    let row = this.ship[y]
    if (!row) {
      row = {}
      this.ship[y] = row
    }

    row[x] = symbol

    if (y > this.b) {
      this.b = y
    }
    if (y < this.t) {
      this.t = y
    }
    if (x > this.r) {
      this.r = x
    }
    if (x < this.l) {
      this.l = x
    }
  }

  private movementResult = () => {
    return (res: number) => {
      let x = this.x
      let y = this.y

      switch (this.direction) {
        case 1:
          y--
          break
        case 2:
          y++
          break
        case 3:
          x++
          break
        case 4:
          x--
          break
      }

      switch (res) {
        case 0:
          this.addToMap('###', x, y)
          break
        case 1:
          this.addToMap('...', x, y)
          this.x = x
          this.y = y
          break
        case 2:
          this.addToMap('!!!', x, y)
          fs.writeFileSync(
            'ship.json',
            JSON.stringify({
              ship: this.ship,
              t: this.t,
              b: this.b,
              l: this.l,
              r: this.r
            })
          )
          this.x = x
          this.y = y
          this.distanceToGrate()
          this.controller = () => -1
          break
      }
    }
  }

  public run = (program: string) => {
    interpretCode(program, this.controller, this.movementResult())
  }
}

export default OxygenFixer
