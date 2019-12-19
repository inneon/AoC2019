interface Moon {
  x: number
  y: number
  z: number
  dx: number
  dy: number
  dz: number
}

export const parse = (raw: string): Moon => {
  const [_, x, y, z] = raw.match(/<x=([-0-9]+), y=([-0-9]+), z=([-0-9]+)>/)
  return {
    x: Number(x),
    y: Number(y),
    z: Number(z),
    dx: 0,
    dy: 0,
    dz: 0
  }
}

export const applyGravityForPair = (subject: Moon, affector: Moon) => {
  if (affector.x > subject.x) {
    subject.dx++
  } else if (affector.x < subject.x) {
    subject.dx--
  }

  if (affector.y > subject.y) {
    subject.dy++
  } else if (affector.y < subject.y) {
    subject.dy--
  }

  if (affector.z > subject.z) {
    subject.dz++
  } else if (affector.z < subject.z) {
    subject.dz--
  }
}

export const applyGravity = (moons: Moon[]) => {
  for (let i = 0; i < moons.length; i++) {
    for (let j = 0; j < moons.length; j++) {
      if (i !== j) {
        applyGravityForPair(moons[i], moons[j])
      }
    }
  }
}

export const applyVelocity = (moons: Moon[]) => {
  moons.forEach(moon => {
    moon.x += moon.dx
    moon.y += moon.dy
    moon.z += moon.dz
  })
}

export const energy = (moons: Moon[]) => {
  return moons
    .map(
      ({ x, y, z, dx, dy, dz }: Moon) =>
        (Math.abs(x) + Math.abs(y) + Math.abs(z)) *
        (Math.abs(dx) + Math.abs(dy) + Math.abs(dz))
    )
    .reduce((prev, curr) => prev + curr)
}

const print = (moons: Moon[]) => {
  let line = ''
  moons.forEach(({ x, y, z, dx, dy, dz }: Moon) => {
    line += `${x},${y},${z},${dx},${dy},${dz},`
  })
  line += energy(moons)

  return line
}

export const simulate = (raw: string[], steps: number) => {
  const moons = raw.map(parse)

  const states = []
  for (let i = 0; i < steps; i++) {
    states.push(print(moons))
    applyGravity(moons)
    applyVelocity(moons)
  }
  console.log(states.join('\n'))
  return moons
}
