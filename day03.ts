import { readlines } from "./io"

type IsSafe = boolean
const countTrees = (slope: {x: number, y: number}, map: IsSafe[][]): number => {
  const yLim = map.length
  const xLim = map[0].length

  let x = 0
  let y = 0
  let treeCount = 0
  while (y < yLim) {
    const isSafe = map[y % yLim][x % xLim]
    if (!isSafe) treeCount++
    x += slope.x
    y += slope.y
  }
  return treeCount
}

(async () => {
  const raw = await readlines('day03.txt')

  const map: IsSafe[][] = raw.map((v) => {
    const line = v.trim().split('')
    return line.map((tile) => tile === '.' ? true : false)
  })

  const counts = [
    countTrees({ x: 1, y: 1 }, map),
    countTrees({ x: 3, y: 1 }, map),
    countTrees({ x: 5, y: 1 }, map),
    countTrees({ x: 7, y: 1 }, map),
    countTrees({ x: 1, y: 2 }, map)
  ]

  console.log(counts)

  const product = counts.reduce((acc, v) => acc * v, 1)

  console.log(product)

})()