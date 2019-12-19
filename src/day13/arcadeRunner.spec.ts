import { drawScreen } from './arcadeRunner'

describe('arcade runner', () => {
  it('can draw a screen', () => {
    const program = '104,0,104,0,104,1,104,1,104,0,104,2,99'
    expect(drawScreen(program)[0][0]).toBe(1)
    expect(drawScreen(program)[0][1]).toBe(2)
  })
})
