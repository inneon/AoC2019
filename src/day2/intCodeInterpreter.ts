const doInstruction = (code: number[], programCounter: number) => {
  const [instruction, op1, op2, op3] = code.slice(
    programCounter,
    programCounter + 4
  )
  switch (instruction) {
    case 1:
      code[op3] = code[op1] + code[op2]
      return false
    case 2:
      code[op3] = code[op1] * code[op2]
      return false
    case 99:
      return true
    default:
      throw new Error(`Unrecognised instruction ${instruction}`)
  }
}

export const interpretCode = (raw: string | number[]) => {
  let code: number[]
  if (typeof raw === 'string') {
    code = raw.split(',').map(Number)
  } else {
    code = raw
  }
  let programCounter = 0
  let halt = false

  while (!halt) {
    halt = doInstruction(code, programCounter)
    programCounter += 4
  }

  return code.map(num => `${num}`).join(',')
}

export const searchCombinations = (raw: string) => {
  let code: number[] = raw.split(',').map(Number)

  let keepGoing = true
  for (let i = 1; i < 1024; i *= 2) {
    for (let j = 1; keepGoing; j *= 2) {
      const trial = [...code]
      trial[1] = i
      trial[2] = j
      const result = Number(interpretCode(trial).split(',')[0])

      if (result > 19690720) {
        keepGoing = false
      }

      console.log(`${i} ${j} ${result}`)
    }

    keepGoing = true
  }
}
