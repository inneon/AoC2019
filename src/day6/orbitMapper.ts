interface Planet {
  name: string
  children: Planet[]
}

const build = (orbits: string[], current: string): Planet => {
  const directOrbitFinder = RegExp(`${current}\\)([A-Z0-9]+)`)
  const children = orbits
    .map(orbit => directOrbitFinder.exec(orbit))
    .filter(regexRes => regexRes && regexRes.length > 0)
    .map(regexRes => regexRes[1])

  return {
    name: current,
    children: children.map(child => build(orbits, child))
  }
}

const nestedOrbits = (planet: Planet, depth: number) => {
  const childrenNested = planet.children
    .map(child => nestedOrbits(child, depth + 1))
    .reduce((curr, next) => curr + next, 0)

  return depth + childrenNested
}

export const count = (orbits: string[]) => {
  const system = build(orbits, 'COM')

  return nestedOrbits(system, 0)
}
