declare module 'array-flatten' {
  type ArrayFlatten = <T>(array: T[][]) => T[]

  const arrayFlatten: ArrayFlatten
  export default arrayFlatten
}
