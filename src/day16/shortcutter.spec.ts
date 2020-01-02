import { shortCut, getCode } from './shorcutter'
import { multiPhase } from './flawedFrequenctTransmission'

describe('shortcutter', () => {
  it('gets doesnt repeat for the very end of the string', () => {
    let actualInput = ''
    const lifter = (input: string, _phases: number) => {
      actualInput = input
      return ''
    }
    expect(shortCut(lifter)('43865972', 3, 2, 20, 4))

    expect(actualInput).toBe('43865972')
  })

  it('can short cut to the middle', () => {
    let actualInput = ''
    const lifter = (input: string, _phases: number) => {
      actualInput = input
      return ''
    }
    expect(shortCut(lifter)('43865972', 3, 2, 19, 4))

    expect(actualInput).toBe('4386597243865972')
  })

  it('can put it all together', () => {
    expect(shortCut(multiPhase)('43865972', 4, 2, 24, 8)).toBe('28812912')
  })

  it.each`
    start                                 | expected
    ${'03036732577212944063491565474664'} | ${'84462026'}
  `('agrees with the examples', ({ start, expected }) => {
    expect(getCode(start)).toEqual(expected)
  })
})
