function* patternGenerator(repeats: number) {
  while (true) {
    for (let i = 0; i <= repeats; i++) {
      yield 0
    }
    for (let i = 0; i <= repeats; i++) {
      yield 1
    }
    for (let i = 0; i <= repeats; i++) {
      yield 0
    }
    for (let i = 0; i <= repeats; i++) {
      yield -1
    }
  }
}

const round = (num: number) => 10 * Math.floor(num / 10)

export const pattern = (position: number, length: number) => {
  const gen = patternGenerator(position)
  gen.next()
  return Array.apply(null, Array(length)).map(_ => gen.next().value)
}

export const calculateOutputDigit = (position: number, all: number[]) => {
  const patternForPosition = pattern(position, all.length)
  let sum = all
    .map((digit, i) => digit * patternForPosition[i])
    .reduce((prev, curr) => prev + curr)

  sum = Math.abs(sum)
  return sum - round(sum)
}

export const phase = (input: string) => {
  const digits = input.split('').map(digit => Number(digit))

  const result = digits
    .map((_, i) => calculateOutputDigit(i, digits))
    .reduce((curr, prev) => curr + prev, '')

  return '0'.repeat(input.length - result.length) + result
}

export type MultiPhase = (input: string, phases: number) => string

export const multiPhase: MultiPhase = (input: string, phases: number) =>
  Array.apply(null, Array(phases)).reduce(phase, input)

export const finalMessage = (offset: number, fftOutput: string) =>
  fftOutput.substring(offset, offset + 8)
