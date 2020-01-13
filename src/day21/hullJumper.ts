import { asciiBot } from '../intCodeInterpreter/asciiBot'

export const hullJumper = (program: string) => {
  return asciiBot(program, [
    'OR A J',
    'AND B J',
    'AND C J',
    'NOT J J',
    'AND D J',
    'WALK'
  ])
}

export const hullRunner = (program: string) => {
  return asciiBot(program, [
    'OR A J',
    'AND B J',
    'AND C J',
    'NOT J J',
    'AND D J',
    'OR E T',
    'OR H T',
    'AND T J',
    'RUN'
  ])
}
