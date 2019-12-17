export const layerWithMost = (
  raw: string,
  character: string,
  width: number,
  height: number
) => {
  const layers = getLayers(width, height, raw)
  return layers.reduce(
    (prev, curr) => {
      const count = getInstances(curr, character)
      if (count < prev.min) {
        return {
          layer: curr,
          min: count
        }
      }
      return prev
    },
    {
      layer: '',
      min: Number.MAX_SAFE_INTEGER
    }
  ).layer
}

export const getLayers = (width: number, height: number, raw: string) => {
  const layerSize = width * height
  const layers: string[] = []

  for (let i = 0; i < raw.length; i += layerSize) {
    layers.push(raw.slice(i, i + layerSize))
  }
  return layers
}

export const getInstances = (layer: string, character: string) => {
  const match = layer.match(new RegExp(character, 'g'))
  return match ? match.length : 0
}

export const checksum = (raw: string, width: number, height: number) => {
  const layer = layerWithMost(raw, '0', width, height)
  return getInstances(layer, '1') * getInstances(layer, '2')
}

export const reduceStack = (stack: string[]) => {
  let first = stack.shift()
  while (first === '2') {
    first = stack.shift()
  }
  return first
}

export const stack = (raw: string, width: number, height: number) => {
  const layers = getLayers(width, height, raw)
  const result: string[][] = []

  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const pixelVector = layers.map(layer => layer.charAt(y * width + x))
      row.push(reduceStack(pixelVector))
    }
    result.push(row)
  }

  return result
}

export const print = (raw: string, width: number, height: number) => {
  const pixels = stack(raw, width, height)

  for (let y = 0; y < height; y++) {
    let row = ''
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x] === '1' ? '*' : ' '
      row = `${row}${pixel}`
    }
    console.log(row)
  }
}
