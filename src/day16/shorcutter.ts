import { MultiPhase, multiPhase } from './flawedFrequenctTransmission'

export const shortCut = (heavyLifter: MultiPhase) => (
  input: string,
  repititions: number,
  phases: number,
  offset: number,
  length: number
) => {
  const niaveLen = input.length * repititions
  const fromEnd = niaveLen - offset
  const actualRepititions = Math.ceil((2 * fromEnd) / input.length)
  console.log(actualRepititions)
  const full = heavyLifter(input.repeat(actualRepititions), phases)
  const skipped = (repititions - actualRepititions) * input.length
  return full.substr(offset - skipped, length)
}

export const getCode = (input: string) => {
  const offset = Number(input.substr(0, 7))
  return shortCut(multiPhase)(input, 10000, 100, offset, 8)
}
