import { readlines } from "./io"


const getValidValues = (preamble: number[]): number[] =>
  preamble.map(i =>
    preamble.map(j => i !== j ? i + j : undefined)
  )
  .flat()
  .filter((v) => v !== undefined);

const findInvalid = (code: number[]): number => {
  const preambleIndex = 25
  for (const [i, v] of code.entries()) {
    if (i < preambleIndex) continue

    const preamble = code.slice(i - preambleIndex, i)

    const validValues = getValidValues(preamble)

    if (!validValues.includes(v)) return v
  }
}

const findContiguousSumRange = (code: number[], invalid: number): number[] => {
  for (const [indexI, _vi] of code.entries()) {
    for (const [indexJ, _vj] of code.entries()) {
      if (indexI === indexJ) continue
      const candidate = code.slice(indexI, indexJ)
      if (candidate.reduce((p, v) => p + v, 0) === invalid) return candidate
    }
  }
}

(async () => {
  const raw = await readlines('day09.txt')

  const code = raw.map((v) => parseInt(v))

  const invalid = findInvalid(code)
  console.log(invalid)

  const range = findContiguousSumRange(code, invalid)
  console.log(Math.min(...range) + Math.max(...range))




})()