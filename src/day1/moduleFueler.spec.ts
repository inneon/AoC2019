import { getFuel, tyrannicGetFuel } from './moduleFueler'

describe('module fueler', () => {
  it('should fuel example 1 correctly', () => {
    expect(getFuel(12)).toBe(2)
  })
  it('should fuel example 4 correctly', () => {
    expect(getFuel(100756)).toBe(33583)
  })
})

describe('tyrranic module fueler', () => {
  it('should fuel example 1 correctly', () => {
    expect(tyrannicGetFuel(12)).toBe(2)
  })
  it('should fuel example 4 correctly', () => {
    expect(tyrannicGetFuel(100756)).toBe(50346)
  })
})
