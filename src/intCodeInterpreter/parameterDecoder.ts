type ParameterMode = 'read' | 'write'

export const decodeParameter = (
  modes: string,
  operands: number[],
  type: ParameterMode[],
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
      result.push(type[i] === 'read' ? program[op] : op)
    } else if (modeCodes[i] === 1) {
      // immeadiate
      result.push(op)
    } else if (modeCodes[i] === 2) {
      // relative
      result.push(
        type[i] === 'read' ? program[op + basePointer] : op + basePointer
      )
    }
  }
  return result
}
