import { HullPainter } from './hullPainter'

describe('hull painter', () => {
  let hullPainter: HullPainter

  it('can execute the program', () => {
    hullPainter = new HullPainter('99')
    hullPainter.run()
  })

  it('can paint white', () => {
    hullPainter = new HullPainter('3,0,104,1,99')
    hullPainter.run()

    expect(hullPainter.colourOf(0, 0)).toBe(1)
  })

  it('can move and then paint white', () => {
    hullPainter = new HullPainter('3,0,104,0,104,1,3,0,104,1,99')
    hullPainter.run()

    expect(hullPainter.colourOf(1, 0)).toBe(1)
  })

  it('can count how many panels are painted', () => {
    hullPainter = new HullPainter(
      '3,0,104,1,104,1,3,0,104,1,104,1,3,0,104,1,104,1,3,0,104,1,104,1,3,0,104,1,104,1,99'
    )
    hullPainter.run()

    expect(hullPainter.numberOfPaintedPanels()).toBe(4)
  })
})
