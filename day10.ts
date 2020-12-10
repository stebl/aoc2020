import { readlines } from "./io"

type Adapter = number

export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start }, (_, i) => i + start)
}

export const count = (adapters: readonly Adapter[], index: number): number => {
  const seen: Record<number, number> = {}

  const _count = (adapters: readonly Adapter[], index: number): number => {
    if (index in seen) return seen[index]
    if (index === adapters.length - 1) return 1

    let totalRemovable = 0
    const current = adapters[index]

    for (const jIndex of range(index + 1, adapters.length)) {
      const candidateNext = adapters[jIndex]

      const canBranch = candidateNext - current <= 3
      if (canBranch) totalRemovable += _count(adapters, jIndex)
    }

    seen[index] = totalRemovable
    return totalRemovable
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

  console.log(count(realTotal, 0))

})()