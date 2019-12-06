const hasDouble = (candidate: number) => {
  const regex = /(\d)\1/
  return regex.test(candidate.toString())
}

function* generate(
  digits: number,
  start: number,
  accumulator: number
): Iterable<number> {
  for (let i = start; i <= 9; i++) {
    if (digits > 1) {
      yield* generate(digits - 1, i, i + accumulator * 10)
    } else {
      const result = i + accumulator * 10
      if (hasDouble(result)) yield result
    }
  }
}

export const enumerate = (
  digits: number,
  start: number,
  end: number
): number[] => {
  const candidates = Array.from(generate(digits, 1, 0))
  const result = candidates.filter(
    candidate => start <= candidate && candidate <= end
  )
  return result
}

export const count = (digits: number, start: number, end: number): number => {
  return enumerate(digits, start, end).length
}
