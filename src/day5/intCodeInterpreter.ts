const verbose = false
const log = (message: string) => {
  if (verbose) {
    console.log(message)
  }
}

const getParameters = (parameterBlock: number) => {
  let stringRep = parameterBlock.toString()
  if (parameterBlock < 100) stringRep = '0' + stringRep
  if (parameterBlock < 10) stringRep = '0' + stringRep
  return stringRep.toString().split('')
}

const doInstruction = (
  code: number[],
  programCounter: number,
  input: number,
  output: (val: number) => void
) => {
  let [instruction, op1, op2, op3] = code.slice(
    programCounter,
    programCounter + 4
  )
  const parametersBlock = Math.floor(instruction / 100)
  instruction -= 100 * parametersBlock
  const parameters = getParameters(parametersBlock)
  const operand1 = parameters[2] === '1' ? op1 : code[op1]
  const operand2 = parameters[1] === '1' ? op2 : code[op2]
  switch (instruction) {
    case 1:
      log(`add ${operand1} ${op1} to ${operand2} ${op2}, store in ${op3}`)
      code[op3] = operand1 + operand2
      return { halt: false, inc: 4 }
    case 2:
      log(`mult ${operand1} ${op1} to ${operand2} ${op2}, store in ${op3}`)
      code[op3] = operand1 * operand2
      return { halt: false, inc: 4 }
    case 3:
      log(`read input into ${op1}`)
      code[op1] = input
      return { halt: false, inc: 2 }
    case 4:
      if (parametersBlock === 1) {
        log(`output ${op1}`)
        output(op1)
      } else {
        log(`output from ${op1}`)
        output(code[op1])
      }
      return { halt: false, inc: 2 }
    case 99:
      return { halt: true, inc: 1 }
    default:
      throw new Error(`Unrecognised instruction ${instruction}`)
  }
}

export const interpretCode = (
  raw: string | number[],
  input: number,
  output: (val: number) => void
) => {
  let code: number[]
  if (typeof raw === 'string') {
    code = raw.split(',').map(Number)
  } else {
    code = raw
  }
  let programCounter = 0
  let halt = false

  while (!halt) {
    const instrResult = doInstruction(code, programCounter, input, output)
    halt = instrResult.halt
    programCounter += instrResult.inc
  }

  return code.map(num => `${num}`).join(',')
}
