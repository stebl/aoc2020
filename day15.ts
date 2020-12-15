
import { readlines } from "./io"
import { range } from "./util"

type SpokenOn = { [n: number]: number[] }
const speakPrevious = (lastSpoken: number, spokenOn: SpokenOn): number => {
  const turns = spokenOn[lastSpoken]
  if (!turns || turns.length < 2) return 0

  return turns[turns.length - 1] - turns[turns.length - 2]
}

(async () => {
  const raw = await readlines('day15.txt')

  const numbers = raw[0].split(',').map((v) => parseInt(v))

  const spokenOn: SpokenOn = numbers
    .reduce((p, c, i) => ({ ...p, [c]: [i + 1] }), {})

  const iterations = 30000000
  const result = range(numbers.length + 1, iterations + 1).reduce((pi, turnNumber) => {
    const thisNumber = speakPrevious(pi, spokenOn)

    // console.log(`Evaluating T${turnNumber}`, `previous`, pi, spokenOn)
    // console.log(`Speaking ${thisNumber} on T${turnNumber}`)

    let turnCount = spokenOn[thisNumber] ?? [] as number[]
    turnCount.push(turnNumber)
    if (turnCount.length > 2) turnCount = turnCount.slice(1)
    spokenOn[thisNumber] = turnCount

    if (turnNumber % 1500000 === 0) console.log(`${(turnNumber / iterations) * 100}%`)

    return thisNumber

  }, numbers[numbers.length - 1])

  console.log(result)

})()
