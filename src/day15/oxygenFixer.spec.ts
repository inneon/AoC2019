import OxygenFixer from './oxygenFixer'

describe('oxygen fixer', () => {
  it('can print the initial ship', () => {
    const fixer = new OxygenFixer(() => () => 0)

    expect(fixer.print()).toBe('DDD')
  })

  it('can move left', () => {
    const fixer = new OxygenFixer(() => () => 4)
    const program = '03,0,104,1,99'
    fixer.run(program)

    expect(fixer.print()).toBe('DDD...')
  })

  it('can move get blocked right', () => {
    const fixer = new OxygenFixer(() => () => 3)
    const program = '03,0,104,0,99'
    fixer.run(program)

    expect(fixer.print()).toBe('DDD###')
  })
})
