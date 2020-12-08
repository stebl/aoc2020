import { readlines, parseProgram } from "./io"
import { Instruction, State, runInstruction, isComplete, runProgram } from "./util"




const isInfinite = (prog: Instruction[]): boolean => {
  let state: State = { instructionPtr: 0, acc: 0 }
  let seenPtrs: number[] = []
  while (true) {
    state = runInstruction(prog, state)

    if (seenPtrs.includes(state.instructionPtr)) return true
    if (isComplete(prog, state)) return false

    seenPtrs.push(state.instructionPtr)
  }
}

(async () => {
  const raw = await readlines('day08.txt')
  const prog = parseProgram(raw)

  prog.forEach((instr, ptr) => {
    const testProg = [...prog]
    if (instr.op === 'jmp') testProg[ptr] = { ...instr, op: 'nop' }
    else if (instr.op === 'nop') testProg[ptr] = { ...instr, op: 'jmp' }
    else return

    if (isInfinite(testProg)) return

    const result = runProgram(testProg)
    console.log(`${JSON.stringify(result)}`)
  })

})()