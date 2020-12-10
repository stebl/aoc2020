

/**
 * Solves the common reformatting task of turning,
 * [
 *   'a',
 *   'b',
 *   '',
 *   'x',
 *   'y'
 * ]
 * Into,
 * [
 *   [ 'a', 'b' ],
 *   [ 'x', 'y' ]
 * ]
 */
export const groupLines = (lines: readonly string[], separator: string = ''): string[][] => {
  let result = [[]]

  lines.forEach(line => {
    if (line === separator) result.push([])
    else result[result.length - 1].push(line)
  })

  return result
}

/**
 * Program execution
 */

export const operations = ['acc', 'jmp', 'nop'] as const
export type Operation = typeof operations[number]
export type Instruction = {
  op: Operation
  arg: number
}

export type State = {
  acc: number
  instructionPtr: number
}

export const runProgram = (prog: readonly Instruction[], state: State = { instructionPtr: 0, acc: 0 }): State => {
  while (!isComplete(prog, state)) {
    state = runInstruction(prog, state)
  }
  return state
}

export const isComplete = (prog: readonly Instruction[], state: State): boolean =>
  state.instructionPtr === prog.length

export const runInstruction = (prog: readonly Instruction[], state: State = { instructionPtr: 0, acc: 0 }): State => {
  if (isComplete(prog, state)) return state

  const inst = prog[state.instructionPtr]

  // console.log(`Running: ${inst.op} ${inst.arg}. ${JSON.stringify(state)}`)

  let newState: State = { ...state }

  if (inst.op === 'nop') newState.instructionPtr += 1
  if (inst.op === 'jmp') newState.instructionPtr += inst.arg
  if (inst.op === 'acc') {
    newState.acc += inst.arg
    newState.instructionPtr += 1
  }

  return newState
}

