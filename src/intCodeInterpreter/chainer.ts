import { interpretCode } from './intCodeInterpreter'

export const chainInterpreter = (raw: string | number[], phases: number[]) => {
  let intermediates

  return phases.reduce((input, phase) => {
    const output = (val: number) => (intermediates = val)
    const phaseInputs = [phase, input]
    const getInput = () => {
      return phaseInputs.shift()
    }
    interpretCode(raw, getInput, output)
    return intermediates
  }, 0)
}

export function* generateChains(phases: number): Generator<number[]> {
  if (phases === 0) {
    return yield []
  }
  const subChains = generateChains(phases - 1)
  for (const chain of subChains) {
    for (let i = 0; i < phases; i++) {
      yield [...chain.slice(0, i), phases - 1, ...chain.slice(i)]
    }
  }
}

export const maximiseChain = (raw: string | number[], phases: number) => {
  return Array.from(generateChains(phases)).reduce((max, phases) => {
    const curr = chainInterpreter(raw, phases)
    if (curr > max) return curr
    return max
  }, 0)
}
