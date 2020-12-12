

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
 * Produces a range of numbers from start (inclusive) to end (exclu
 * Most useful for iterating arrays by index
 *
 * for (i in range(0, arr.length)) { arr[i] }
 */
export const range = (start: number, end: number): number[] => Array.from({ length: end - start }, (_, i) => i + start)

export const sumReducer = (p: number, c: number) => p + c
export const productReducer = (p: number, c: number) => p * c

/**
 *
 * Virtual machine
 *
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


/**
 *
 * Grids and map manipulation
 *
 */


/**
 * Map problems use ascii tiles illegible to the average human.
 *
 * Converts a map key,
 * {
 *   '#': 'occupied',
 *   '.': 'space'
 * }
 *
 * into a quick and dirty bidirectional map,
 * {
 *   '#': 'occupied',
 *   '.': 'space',
 *   'occupied': '#',
 *   'space': '.'
 * }
 */
export const mapping = (key: { [s: string]: string }) => {
  const result = {}
  for (const [k, v] of Object.entries(key)) {
    result[k] = v
    result[v] = k
  }
  return result
}

export class Grid<T extends string> {

  grid: T[][]

  /**
   *
   * An input file of,
   *  ABC
   *  DEF
   *
   * Should be parsed into,
   *  ['ABC', 'DEF']
   *
   * And will be indexed as,
   *  this.grid[y][x]
   *
   * where [0,0] is the top left corner
   *
   */
  constructor(lines: string[]) {
    this.grid = lines.map((line) => line.split('')) as T[][]
  }

  flat(): T[] {
    return this.grid.flat()
  }

  forEach(callback: (t: T, y: number, x: number) => void) {
    for (const y of range(0, this.grid.length)) {
      for (const x of range(0, this.grid[y].length)) {
        callback(this.grid[y][x], y, x)
      }
    }
  }

  adjacentOcta(y: number, x: number): (T | undefined)[] {
    return [
      this.get(y - 1, x - 1),
      this.get(y - 1, x),
      this.get(y - 1, x + 1),
      this.get(y,     x + 1),
      this.get(y + 1, x + 1),
      this.get(y + 1, x),
      this.get(y + 1, x - 1),
      this.get(y,     x - 1),
    ]
  }

  findFirstAlong(
    y: number, x: number,
    dy: number, dx: number,
    criteria: T[]
  ): T | undefined {
    while (true) {
      y += dy
      x += dx
      if (!this.validTile(y, x)) break
      const t = this.get(y, x)
      if (criteria.includes(t)) return t
    }
  }

  findInLineOfSight(y: number, x: number, criteria: T[]): (T | undefined)[] {
    return [
      this.findFirstAlong(y, x, -1, -1, criteria),
      this.findFirstAlong(y, x, -1, 0, criteria),
      this.findFirstAlong(y, x, -1, 1, criteria),
      this.findFirstAlong(y, x, 0,  1, criteria),
      this.findFirstAlong(y, x, 1,  1, criteria),
      this.findFirstAlong(y, x, 1,  0, criteria),
      this.findFirstAlong(y, x, 1, -1, criteria),
      this.findFirstAlong(y, x, 0, -1, criteria),
    ]
  }

  set(y: number, x: number, t: T): void {
    if (!this.validTile(y, x)) throw new Error(`Index out of bounds (${y}, ${x})`)
    this.grid[y][x] = t
  }

  get(y: number, x: number): T | undefined {
    return this.validTile(y, x) ? this.grid[y][x] : undefined
  }

  validTile(y: number, x: number): boolean {
    return 0 <= y && y < this.grid.length && 0 <= x && x < this.grid[y].length
  }

  print(): void {
    this.grid.forEach(line => console.log(line.join('')))
  }
}