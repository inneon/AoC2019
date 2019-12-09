const verbose = false
const log = (message: string) => {
  if (verbose) {
    console.log(message)
  }
}
interface InterpreterResult {
  newProgramCounter: number
  halt: boolean
}
5
type InstructionInterpreter = (
  code: number[],
  programCounter: number,
  parameters: string
) => InterpreterResult

const addInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]
  const op2Value = /1.$/.exec(parameters) ? op2 : code[op2]

  log(
    `add ${op1Value} (${op1}) to ${op2Value} (${op2}), store in ${op3} - ${parameters}`
  )
  code[op3] = op1Value + op2Value
  return {
    halt: false,
    newProgramCounter: programCounter + 4
  }
}

const multInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]
  const op2Value = /1.$/.exec(parameters) ? op2 : code[op2]
  log(`mult ${op1Value} (${op1}) to ${op2Value} (${op2}), store in ${op3}`)
  code[op3] = op1Value * op2Value
  return {
    halt: false,
    newProgramCounter: programCounter + 4
  }
}

const inputInterpreter = (input: () => number): InstructionInterpreter => (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const inputVal = input()
  code[op1] = inputVal
  log(`read input ${inputVal} into ${op1}`)
  return {
    halt: false,
    newProgramCounter: programCounter + 2
  }
}
const outputInterpreter = (
  output: (val: number) => void
): InstructionInterpreter => (code, programCounter, parameters) => {
  const op1 = code[programCounter + 1]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]

  log(`Output ${op1Value} (${op1})`)
  output(op1Value)
  return {
    halt: false,
    newProgramCounter: programCounter + 2
  }
}

const haltInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  log(`halt`)
  return {
    halt: true,
    newProgramCounter: programCounter
  }
}

const jtInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]
  const op2Value = /1.$/.exec(parameters) ? op2 : code[op2]
  log(`jump if ${op1Value} (${op1}) to ${op2Value} (${op2})`)
  return {
    halt: false,
    newProgramCounter: op1Value === 0 ? programCounter + 3 : op2Value
  }
}

const jfInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]
  const op2Value = /1.$/.exec(parameters) ? op2 : code[op2]
  log(`jump if not ${op1Value} (${op1}) to ${op2Value} (${op2})`)
  return {
    halt: false,
    newProgramCounter: op1Value !== 0 ? programCounter + 3 : op2Value
  }
}

const ltInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]
  const op2Value = /1.$/.exec(parameters) ? op2 : code[op2]
  log(`check ${op1Value} (${op1}) < ${op2Value} (${op2}), store in ${op3}`)
  code[op3] = op1Value < op2Value ? 1 : 0
  return {
    halt: false,
    newProgramCounter: programCounter + 4
  }
}

const eqInterpreter: InstructionInterpreter = (
  code,
  programCounter,
  parameters
) => {
  const op1 = code[programCounter + 1]
  const op2 = code[programCounter + 2]
  const op3 = code[programCounter + 3]
  const op1Value = /1$/.exec(parameters) ? op1 : code[op1]
  const op2Value = /1.$/.exec(parameters) ? op2 : code[op2]
  log(`check ${op1Value} (${op1}) == ${op2Value} (${op2}), store in ${op3}`)
  code[op3] = op1Value === op2Value ? 1 : 0
  return {
    halt: false,
    newProgramCounter: programCounter + 4
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
  '99': haltInterpreter
})

const doInstruction = (
  code: number[],
  programCounter: number,
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
  return interpreter(code, programCounter, parametersBlock.toString())
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
  let halt = false

  while (!halt) {
    const instrResult = doInstruction(code, programCounter, input, output)
    halt = instrResult.halt
    programCounter = instrResult.newProgramCounter
  }

  return code.map(num => `${num}`).join(',')
}

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
