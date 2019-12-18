import { interpretCode } from '../intCodeInterpreter/intCodeInterpreter'

interface Dictionary<TVal> {
  [key: number]: TVal
}

export class HullPainter {
  private program: string
  private hull: Dictionary<Dictionary<number>> = {}
  private x: number = 0
  private y: number = 0
  private dir: number = 0
  constructor(program: string) {
    this.program = program
  }

  public run() {
    let i = 0
    const receiveInstructions = (num: number) => {
      if (i === 0) {
        this.paint(num)
        i++
      } else {
        this.move(num)
        i--
      }
    }

    interpretCode(this.program, this.getPanelColour(), receiveInstructions)
  }

  private getPanelColour() {
    return () => {
      const row = this.hull[this.y]
      if (!row) {
        return 1
      }
      const space = row[this.x]
      if (!space) {
        return 1
      }
      return space
    }
  }

  private paint(num: number) {
    let row = this.hull[this.y]
    if (!row) {
      row = {}
      this.hull[this.y] = row
    }

    row[this.x] = num
  }

  private move(num: number) {
    const change = num * 2 - 1
    this.dir = (4 + this.dir + change) % 4
    switch (this.dir) {
      case 0: // up
        this.y--
        break
      case 1: // right
        this.x++
        break
      case 2: // down
        this.y++
        break
      case 3: // left
        this.x--
        break
    }
  }

  public colourOf(x: number, y: number) {
    const row = this.hull[y]
    if (!row) {
      return 1
    }
    const space = row[x]
    if (!space) {
      return 1
    }
    return space
  }

  public numberOfPaintedPanels() {
    return Object.values(this.hull)
      .map(row => Object.keys(row).length)
      .reduce((a, b) => a + b, 0)
  }

  public getBounds() {
    const max = (arr: number[]) =>
      arr.reduce(
        (prev, curr) => (curr > prev ? curr : prev),
        Number.MIN_SAFE_INTEGER
      )
    const min = (arr: number[]) =>
      arr.reduce(
        (prev, curr) => (curr < prev ? curr : prev),
        Number.MAX_SAFE_INTEGER
      )

    const top = min(Object.keys(this.hull).map(Number))
    const bottom = max(Object.keys(this.hull).map(Number))

    const left = min(
      Object.values(this.hull).map(row => min(Object.keys(row).map(Number)))
    )
    const right = max(
      Object.values(this.hull).map(row => max(Object.keys(row).map(Number)))
    )

    return {
      top,
      bottom,
      left,
      right
    }
  }

  public print() {
    const { top, bottom, left, right } = this.getBounds()

    for (let y = top; y <= bottom; y++) {
      let line = ''
      for (let x = left; x <= right; x++) {
        line += this.hull[y][x] === 1 ? '**' : '  '
      }
      console.log(line)
    }
  }
}
