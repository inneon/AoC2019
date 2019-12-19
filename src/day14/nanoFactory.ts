interface Dictionary<TVal> {
  [key: string]: TVal
}

interface Input {
  name: string
  quantity: number
}

interface Recipe {
  quantity: number
  inputs: Input[]
}

const parse = (recipes: string[]) => {
  const arrayed = recipes.map(recipe => {
    const [_, inputs, quantity, name] = recipe.match(/(.+) => (\d+) ([A-Z]+)/)
    return {
      name,
      quantity: Number(quantity),
      inputs: inputs.split(', ').map(input => {
        const [_, quantity, name] = input.match(/(\d+) ([A-Z]+)/)
        return {
          name,
          quantity: Number(quantity)
        }
      })
    }
  })
  const objected = arrayed.reduce((prev, curr) => {
    if (prev[curr.name]) {
      throw new Error(`Two ways to make ${curr.name}`)
    }
    prev[curr.name] = {
      quantity: curr.quantity,
      inputs: curr.inputs
    } as Recipe
    return prev as Dictionary<Recipe>
  }, {})
  return objected as Dictionary<Recipe>
}

let leftovers: Dictionary<number> = {}

const addLeftovers = (name: string, quantity: number) => {
  if (!leftovers[name]) {
    leftovers[name] = quantity
  } else {
    leftovers[name] += quantity
  }
}

const removeLeftovers = (name: string, desiredQuantity: number) => {
  if (!leftovers[name]) {
    return 0
  } else {
    const availble = leftovers[name]
    const got = Math.min(desiredQuantity, availble)
    leftovers[name] -= got
    return got
  }
}

export const synthesise = (recipes: string[]) => {
  leftovers = {}
  const parsed = parse(recipes)

  let fuel = parsed['FUEL']
  let result = 0

  while (fuel.inputs.length > 0) {
    //console.log(fuel.inputs)
    const targetChemical = fuel.inputs.shift()
    if (targetChemical.name === 'ORE') {
      result += targetChemical.quantity
    } else {
      const nextRecipe = parsed[targetChemical.name]
      const toSynthesise =
        targetChemical.quantity -
        removeLeftovers(targetChemical.name, targetChemical.quantity)
      if (toSynthesise > 0) {
        const repitions = Math.ceil(toSynthesise / nextRecipe.quantity)
        const extras = repitions * nextRecipe.quantity - toSynthesise
        fuel.inputs.push(
          ...nextRecipe.inputs.map(({ name, quantity }) => ({
            name,
            quantity: Math.ceil(quantity * repitions)
          }))
        )
        addLeftovers(targetChemical.name, extras)
      }
    }
  }

  return result
}
