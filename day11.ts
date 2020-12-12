
import { readlines } from "./io"
import { Grid, mapping, sumReducer } from "./util"

(async () => {
  const raw = await readlines('day11.txt')

  const key = mapping({
    '.': 'floor',
    'L': 'empty',
    '#': 'occupied'
  })

  const grid = new Grid(raw)

  while (true) {
    const swaps = []

    grid.forEach((t, y, x) => {
      const criteria = [key['occupied'], key['empty']]
      const adjacents = grid.findInLineOfSight(y, x, criteria)

      const occupiedAdjacents = adjacents.filter((t) => key[t] === 'occupied').length

      if (key[t] === 'empty' && occupiedAdjacents === 0) {
        swaps.push([y, x, key['occupied']])
      }

      if (key[t] === 'occupied' && occupiedAdjacents >= 5) {
        swaps.push([y, x, key['empty']])
      }
    })

    if (swaps.length === 0) break

    swaps.forEach(([y, x, t]) => grid.set(y, x, t))
  }


  console.log(grid.flat().map((t) => key[t] === 'occupied' ? 1 : 0).reduce(sumReducer, 0))
})()
