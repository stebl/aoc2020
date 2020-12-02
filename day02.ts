import { readlines } from './io'

(async () => {
  // const raw = [
  //   '1-3 a: abcde',
  //   '1-3 b: cdefg',
  //   '2-9 c: ccccccccc'
  // ]

  const raw = await readlines('day02.txt')

  const mapped = raw.map((v) => {
    const splits = v.split(' ')
    const range = splits[0].split('-')
    return {
      firstIndex: parseInt(range[0]) - 1,
      secondIndex: parseInt(range[1]) - 1,
      char: splits[1][0],
      password: splits[2]
    }
  })

  const valid = mapped.filter((v) => {
    // const regexp = new RegExp(`${v.char}`, 'g')
    // const match = v.password.match(regexp)
    // const count = match?.length ?? 0
    // return v.min <= count && count <= v.max
    const c1 = v.password[v.firstIndex]
    const c2 = v.password[v.secondIndex]
    const c = v.char
    if (c1 === c && c2 !== c) return true
    if (c1 !== c && c2 === c) return true
    return false

  })

  console.log(`Valid: ${valid.length}`)

})()

