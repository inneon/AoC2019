import { decodeParameter } from './parameterDecoder'

const verbose = false
const log = (message: string) => {
  if (verbose) {
    console.log(message)
  }
}
interface InterpreterResult {
  newProgramCounter: number
  basePointer: number
  halt: boolean
}

type InstructionInterpreter = (
  code: number[],
  programCounter: number,
  basePointer: number,
  parameters: string
) => InterpreterResult

const addInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const [op1Value, op2Value, op3Value] = decodeParameter(
    parameters,
    [op1, op2, op3],
    ['read', 'read', 'write'],
    code,
    basePointer
  )

  log(
    `add ${op1Value} (${op1}) to ${op2Value} (${op2}), store in ${op3Value} (${op3})`
  )
  code[op3Value] = op1Value + op2Value
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 4
  }
}

const multInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const [op1Value, op2Value, op3Value] = decodeParameter(
    parameters,
    [op1, op2, op3],
    ['read', 'read', 'write'],
    code,
    basePointer
  )
  log(
    `mult ${op1Value} (${op1}) to ${op2Value} (${op2}), store in ${op3Value} (${op3})`
  )
  code[op3Value] = op1Value * op2Value
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 4
  }
}

const inputInterpreter = (input: () => number): InstructionInterpreter => (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const [op1Value] = decodeParameter(
    parameters,
    [op1],
    ['write'],
    code,
    basePointer
  )
  const inputVal = input()
  code[op1Value] = inputVal
  log(`read input ${inputVal} into ${op1Value} (${op1})`)
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 2
  }
}
const outputInterpreter = (
  output: (val: number) => void
): InstructionInterpreter => (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const [op1Value] = decodeParameter(
    parameters,
    [op1],
    ['read'],
    code,
    basePointer
  )

  log(`Output ${op1Value} (${op1})`)
  output(op1Value)
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 2
  }
}

const haltInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  log(`halt`)
  return {
    halt: true,
    basePointer,
    newProgramCounter: programCounter
  }
}

const jtInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const [op1Value, op2Value] = decodeParameter(
    parameters,
    [op1, op2],
    ['read', 'read'],
    code,
    basePointer
  )
  log(`jump if ${op1Value} (${op1}) to ${op2Value} (${op2})`)
  return {
    halt: false,
    basePointer,
    newProgramCounter: op1Value === 0 ? programCounter + 3 : op2Value
  }
}

const jfInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const [op1Value, op2Value] = decodeParameter(
    parameters,
    [op1, op2],
    ['read', 'read'],
    code,
    basePointer
  )
  log(`jump if not ${op1Value} (${op1}) to ${op2Value} (${op2})`)
  return {
    halt: false,
    basePointer,
    newProgramCounter: op1Value !== 0 ? programCounter + 3 : op2Value
  }
}

const ltInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const [op1Value, op2Value, op3Value] = decodeParameter(
    parameters,
    [op1, op2, op3],
    ['read', 'read', 'write'],
    code,
    basePointer
  )
  log(
    `check ${op1Value} (${op1}) < ${op2Value} (${op2}), store in ${op3Value} (${op3})}`
  )
  code[op3Value] = op1Value < op2Value ? 1 : 0
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 4
  }
}

const eqInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const [op1Value, op2Value, op3Value] = decodeParameter(
    parameters,
    [op1, op2, op3],
    ['read', 'read', 'write'],
    code,
    basePointer
  )
  log(`check ${op1Value} (${op1}) == ${op2Value} (${op2}), store in ${op3}`)
  code[op3Value] = op1Value === op2Value ? 1 : 0
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 4
  }
}

const basePointerInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  basePointer,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const [op1Value] = decodeParameter(
    parameters,
    [op1],
    ['read'],
    code,
    basePointer
  )
  basePointer += op1Value
  log(`change the base pointer by ${op1Value} (${op1}) to ${basePointer}`)
  return {
    halt: false,
    basePointer,
    newProgramCounter: programCounter + 2
  }
}

const interpreters = (input: () => number, output: (val: number) => void) => ({
  '1': addInterpreter,
  '2': multInterpreter,
  '3': inputInterpreter(input),
  '4': outputInterpreter(output),
  '5': jtInterpreter,
  '6': jfInterpreter,
  '7': ltInterpreter,
  '8': eqInterpreter,
  '9': basePointerInterpreter,
  '99': haltInterpreter
})

const doInstruction = (
  code: number[],
  programCounter: number,
  basePointer: number,
  input: () => number,
  output: (val: number) => void
) => {
  let instruction = code[programCounter]
  const parametersBlock = Math.floor(instruction / 100)
  instruction -= 100 * parametersBlock
  const interpreter: InstructionInterpreter | undefined = interpreters(
    input,
    output
  )[instruction.toString()]
  if (!interpreter) throw new Error(`Unrecognised instruction ${instruction}`)
  return interpreter(
    code,
    programCounter,
    basePointer,
    parametersBlock.toString()
  )
}

export const interpretCode = (
  raw: string | number[],
  input: () => number = () => 0,
  output: (val: number) => void = () => {}
) => {
  let code: number[]
  if (typeof raw === 'string') {
    code = raw.split(',').map(Number)
  } else {
    code = raw
  }
  let programCounter = 0
  let basePointer = 0
  let halt = false

  while (!halt) {
    const instrResult = doInstruction(
      code,
      programCounter,
      basePointer,
      input,
      output
    )
    halt = instrResult.halt
    programCounter = instrResult.newProgramCounter
    basePointer = instrResult.basePointer
  }

  return code.map(num => `${num}`).join(',')
}
