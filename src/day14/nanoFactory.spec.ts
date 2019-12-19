import { synthesise } from './nanoFactory'

describe('nano factory', () => {
  it('can produce fuel directly from ore', () => {
    const ore = synthesise(['1 ORE => 1 FUEL'])
    expect(ore).toBe(1)
  })

  it('warns when there is not a simple chain', () => {
    let warned = false
    try {
      synthesise([
        '1 A => 1 FUEL',
        '1 B => 1 FUEL',
        '1 ORE => 1 A',
        '1 ORE => 1 B'
      ])
    } catch (err) {
      warned = true
    }
    expect(warned).toBeTruthy()
  })

  it('can produce fuel from an intermediate', () => {
    const ore = synthesise(['2 A => 1 FUEL', '3 ORE => 1 A'])

    expect(ore).toBe(6)
  })

  it('can produce fuel from 2 intermediates', () => {
    const ore = synthesise([
      '1 A, 1 B => 1 FUEL',
      '1 ORE => 1 A',
      '1 ORE => 1 B'
    ])

    expect(ore).toBe(2)
  })

  it('gets the right amount of ore from an intermediate', () => {
    const ore = synthesise(['3 A => 1 FUEL', '1 ORE => 2 A'])

    expect(ore).toBe(2)
  })

  it('can use leftovers', () => {
    const ore1 = synthesise([
      '1 A, 1 B => 1 FUEL',
      '1 ORE => 2 A',
      '1 ORE, 1 A => 1 B'
    ])
    const ore2 = synthesise([
      '1 B, 1 A => 1 FUEL',
      '1 ORE => 2 A',
      '1 ORE, 1 A => 1 B'
    ])

    expect(ore1).toBe(2)
    expect(ore2).toBe(2)
  })

  it('agrees with example 1', () => {
    const ore = synthesise([
      '10 ORE => 10 A',
      '1 ORE => 1 B',
      '7 A, 1 B => 1 C',
      '7 A, 1 C => 1 D',
      '7 A, 1 D => 1 E',
      '7 A, 1 E => 1 FUEL'
    ])

    expect(ore).toBe(31)
  })

  it('agrees with example 2', () => {
    const ore = synthesise([
      '9 ORE => 2 A',
      '8 ORE => 3 B',
      '7 ORE => 5 C',
      '3 A, 4 B => 1 AB',
      '5 B, 7 C => 1 BC',
      '4 C, 1 A => 1 CA',
      '2 AB, 3 BC, 4 CA => 1 FUEL'
    ])

    expect(ore).toBe(165)
  })

  it('agrees with example 3', () => {
    const ore = synthesise([
      '157 ORE => 5 NZVS',
      '165 ORE => 6 DCFZ',
      '44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL',
      '12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ',
      '179 ORE => 7 PSHF',
      '177 ORE => 5 HKGWZ',
      '7 DCFZ, 7 PSHF => 2 XJWVT',
      '165 ORE => 2 GPVTF',
      '3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT'
    ])

    expect(ore).toBe(13312)
  })

  it('agrees with example 5', () => {
    const ore = synthesise([
      '171 ORE => 8 CNZTR',
      '7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL',
      '114 ORE => 4 BHXH',
      '14 VRPVC => 6 BMBT',
      '6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL',
      '6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT',
      '15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW',
      '13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW',
      '5 BMBT => 4 WPTQ',
      '189 ORE => 9 KTJDG',
      '1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP',
      '12 VRPVC, 27 CNZTR => 2 XDBXC',
      '15 KTJDG, 12 BHXH => 5 XCVML',
      '3 BHXH, 2 VRPVC => 7 MZWV',
      '121 ORE => 7 VRPVC',
      '7 XCVML => 6 RJRHP',
      '5 BHXH, 4 VRPVC => 5 LTCX'
    ])

    expect(ore).toBe(2210736)
  })
})
