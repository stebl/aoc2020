import { readlines } from "./io"

type Partition = 'upper' | 'lower'
type MinMax = { min: number, max: number }
const binaryPartition = ({ min, max }: MinMax, code: readonly Partition[]): number => {
  if (code.length === 0) throw new Error('Requires non-empty partition array')

  const partition = code[0]
  const remainder = code.slice(1)

  if (remainder.length === 0) {
    return partition === 'lower' ? min : max
  }

  // +1 for zero index
  const half = ((max - min + 1) / 2)

  const newRange = partition === 'lower'
    ? { min,             max: max - half }
    : { min: min + half, max             }

  return binaryPartition(newRange, remainder)
}

const parsePass = (p: string) => {
  const match = /^(?<row>[B|F]{7})(?<col>[R|L]{3})$/.exec(p)

  const rowCode = match.groups.row.split('').map((v) => v === 'B' ? 'upper' : 'lower')
  const colCode = match.groups.col.split('').map((v) => v === 'R' ? 'upper' : 'lower')

  const row = binaryPartition({ min: 0, max: 127 }, rowCode)
  const col = binaryPartition({ min: 0, max: 7 }, colCode)

  return { row, col }
}

(async () => {
  const raw = await readlines('day05.txt')

  const parsed = raw.map(parsePass)

  const seatIds = parsed.map((v) => v.row * 8 + v.col)

  console.log(Math.max(...seatIds))

  seatIds.sort((a, b) => a - b)

  seatIds.reduce((p, c) => {
    if (p + 1 !== c) {
      console.log(`Your seat: ${p+1}`)
    }
    return c
  })

})()