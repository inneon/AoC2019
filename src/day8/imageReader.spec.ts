import {
  getLayers,
  getInstances,
  layerWithMost,
  stack,
  reduceStack
} from './imageReader'

describe('image reader', () => {
  it('can get the right layers', () => {
    expect(getLayers(3, 2, '123456789012')).toEqual(['123456', '789012'])
  })

  it('counts the characters within the layer', () => {
    expect(getInstances('123456789012', '2')).toBe(2)
  })

  it('gets the layer with the fewest 0s', () => {
    expect(layerWithMost('123456789012', '0', 3, 2)).toBe('123456')
  })

  it('can stack the layers', () => {
    expect(stack('0222112222120000', 2, 2)).toEqual([
      ['0', '1'],
      ['1', '0']
    ])
  })

  it('can reduce one stack of pixels', () => {
    expect(reduceStack(['2', '1', '0'])).toBe('1')
  })
})
