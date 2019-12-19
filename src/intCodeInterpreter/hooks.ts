export type Hook = (ops: number[]) => number[]
export type HookLibrary = { [key: string]: Hook }
const nullHook: Hook = (ops: number[]) => ops

export const nullHooksLibrary: HookLibrary = {
  '1': nullHook,
  '2': nullHook,
  '3': nullHook,
  '4': nullHook,
  '5': nullHook,
  '6': nullHook,
  '7': nullHook,
  '8': nullHook,
  '9': nullHook,
  '99': nullHook
}
