interface Planet {
  name: string
  children: Planet[]
  parents: string[]
}

const all: {
  [key: string]: Planet
} = {}

const build = (
  orbits: string[],
  current: string,
  parents: string[] = []
): Planet => {
  const directOrbitFinder = RegExp(`${current}\\)([A-Z0-9]+)`)
  const children = orbits
    .map(orbit => directOrbitFinder.exec(orbit))
    .filter(regexRes => regexRes && regexRes.length > 0)
    .map(regexRes => regexRes[1])

  const result = {
    name: current,
    children: children.map(child =>
      build(orbits, child, [...parents, current])
    ),
    parents
  }
  all[current] = result
  return result
}

const nestedOrbits = (planet: Planet, depth: number) => {
  const childrenNested = planet.children
    .map(child => nestedOrbits(child, depth + 1))
    .reduce((curr, next) => curr + next, 0)

  return depth + childrenNested
}

export const transfers = (orbits: string[]) => {
  build(orbits, 'COM', [])
  const you = [...all['YOU'].parents]
  const san = [...all['SAN'].parents]

  let match = true
  while (match) {
    if (you[0] === san[0]) {
      you.splice(0, 1)
      san.splice(0, 1)
    } else {
      match = false
    }
  }
  return you.length + san.length
}

export const count = (orbits: string[]) => {
  const system = build(orbits, 'COM')

  return nestedOrbits(system, 0)
}
