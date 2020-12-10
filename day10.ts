import { readlines } from "./io"
import { range } from "./util"

type Adapter = number

export const count = (adapters: readonly Adapter[], index: number): number => {
  const seen: Record<number, number> = {}

  const _count = (adapters: readonly Adapter[], index: number): number => {
    if (index in seen) return seen[index]
    if (index === adapters.length - 1) return 1

    let branches = 0
    const current = adapters[index]

    for (const jIndex of range(index + 1, adapters.length)) {
      const candidateNext = adapters[jIndex]

      const canBranch = candidateNext - current <= 3
      // console.log(`Observing ${current} - ${j}: canBranch ${canBranch}`)

      if (canBranch) branches += _count(adapters, jIndex)
    }

    seen[index] = branches
    return branches
  }

  return _count(adapters, index)
}

(async () => {
  const raw = await readlines('day10.txt')

  const adapters = raw.map((v) => parseInt(v)).sort((a, b) => a-b)

  const wall = 0
  const device = Math.max(...adapters) + 3
  const total = [...adapters, device]

  // console.log(total)

  let diffs: number[] = []
  total.reduce((p, c) => {
    diffs.push(c - p)
    return c
  }, wall)


  const ones = diffs.filter(v => v === 1).length
  const threes = diffs.filter(v => v === 3).length

  console.log(`${ones * threes}`)

  const realTotal = [wall, ...adapters, device]
  console.log(realTotal)
  console.log(count(realTotal, 0))

})()