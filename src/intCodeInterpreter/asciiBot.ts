import { interpretCode } from './intCodeInterpreter'

export const asciiBot = (program: string, instructions: string[]) => {
  const raw = [...instructions.join('\n').split(''), '\n'].map(char =>
    char.charCodeAt(0)
  )
  let lastOutput
  let line = ''
  let map = []
  const print = (num: number) => {
    lastOutput = num
    if (num === 10) {
      if (line === '') {
        console.log(map)
        map = []
      } else {
        map.push(line)
        line = ''
      }
    } else {
      line += String.fromCharCode(num)
    }
  }

  interpretCode(program, () => raw.shift(), print)

  return lastOutput
}
