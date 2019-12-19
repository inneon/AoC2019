import * as fs from 'fs'

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

export const resetLeftovers = () => {
  leftovers = {}
}

export const synthesise = (recipes: string[], target: string = 'FUEL') => {
  const parsed = parse(recipes)

  let fuel = parsed[target]
  let result = 0

  while (fuel.inputs.length > 0) {
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

export const maximiesFuel = (ore: number, recipes: string[]) => {
  let fuel = 0
  const unitCost = synthesise(recipes)

  let approximation = Math.floor(ore / unitCost)
  let iterating = true
  while (iterating) {
    const oreUsed = synthesise(
      [...recipes, `${approximation} FUEL => 1 MAX`],
      'MAX'
    )
    const nextApproximation =
      approximation + Math.floor((ore - oreUsed) / unitCost)
    if (nextApproximation === approximation) {
      iterating = false
      fuel = approximation
    } else {
      approximation = nextApproximation
    }
  }
  return fuel
}
