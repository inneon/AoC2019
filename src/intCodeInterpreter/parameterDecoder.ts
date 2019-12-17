export const decodeParameter = (
  modes: string,
  operands: number[],
  program: number[],
  basePointer: number
) => {
  const modeCodes = ('000' + modes)
    .substr(modes.length + 3 - operands.length)
    .split('')
    .map(Number)
    .reverse()

  const result = []
  for (let i = 0; i < operands.length; i++) {
    const op = operands[i]
    if (modeCodes[i] === 0) {
      // address
      result.push(program[op])
    } else if (modeCodes[i] === 1) {
      // immeadiate
      result.push(op)
    }
  }
  return result
}
