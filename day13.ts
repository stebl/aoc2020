
import { readlines } from "./io"
import assert from 'assert'

/**
 * ax + by = 1
 */
const extendedEuclidean = (a: bigint, b: bigint): { x: bigint, y: bigint } => {
  if (a < b) throw new Error(`${a} must be > ${b} to compute bezout coefficients`)
  let r0 = a
  let r1 = b

  let s0 = BigInt(1)
  let s1 = BigInt(0)

  let t0 = BigInt(0)
  let t1 = BigInt(1)

  const _assign = (a: bigint, b: bigint): bigint[] => { return [a, b] }

  while (r1 !== BigInt(0)) {
    const quotient = r0 / r1;

    [r0, r1] = _assign(r1, r0 - quotient * r1);
    [s0, s1] = _assign(s1, s0 - quotient * s1);
    [t0, t1] = _assign(t1, t0 - quotient * t1);
  }

  const x = s0
  const y = t0

  if (a*x + b*y !== BigInt(1)) throw new Error(`Extended euclidean failed ${a}*${x} + ${b}*${y} = ${a*x + b*y}`)

  return { x: s0, y: t0 }
}


type RemainderEquation = { a: number, n: number }
/**
 *
 * ax + by = 1
 * ax = 1 mod b
 * x = modInverse(a)
 * @param m
 */
const modInverse = (a: bigint, m: bigint): bigint => {
  const { x } = extendedEuclidean(a, m)
  return x
}

const chineseRemainderTheorem = (equations: RemainderEquation[]): bigint => {
  const N = equations.reduce((p, v) => {
    return BigInt(p)*BigInt(v.n)
  }, BigInt(1))

  let result = BigInt(0)
  for (const eq of equations) {
    const ni = BigInt(eq.n)
    const Ni = N / ni

    // Mi*Ni + mi*ni = 1
    const Mi = modInverse(Ni, ni)

    result += BigInt(eq.a) * Mi * Ni // safeMult(safeMult(eq.a, Mi), Ni)
  }

  // result = result % N
  while (result <= 0) result += N
  result = result % N

  console.log(`0 <= ${result} < ${N}`)

  equations.forEach((v) =>
    assert.strictEqual(result % BigInt(v.n), BigInt(v.a), `${result} % ${v.n} != ${v.a}`)
  )

  return result
}

const parseConstraints = (s: string): RemainderEquation[] => {
  const schedule = s
    .split(',')
    .map(v => v === 'x' ? undefined : parseInt(v))

  const constraints: RemainderEquation[] = schedule
    .reduce((p, busId, index) => {
      return busId
      // Extra modulos to ensure 0 <= a < n
        ? [...p, { a: (busId - (index % busId)) % busId, n: busId }]
        : p
    }, [])

  return constraints
}

(async () => {
  const raw = await readlines('day13.txt')

  assert.strictEqual(
    chineseRemainderTheorem(parseConstraints('17,x,13,19')), BigInt(3417)
  )
  assert.strictEqual(
    chineseRemainderTheorem(parseConstraints('67,7,59,61')), BigInt(754018)
  )
  assert.strictEqual(
    chineseRemainderTheorem(parseConstraints('67,x,7,59,61')), BigInt(779210)
  )
  assert.strictEqual(
    chineseRemainderTheorem(parseConstraints('67,7,x,59,61')), BigInt(1261476)
  )
  assert.strictEqual(
    chineseRemainderTheorem(parseConstraints('1789,37,47,1889')), BigInt(1202161486)
  )

  // RIP little-ints
  // correct: 836024966345345
  chineseRemainderTheorem(parseConstraints(raw[1]))
})()
