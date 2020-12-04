import { readlines } from "./io"

type Passport = {
  byr?: string
  iyr?: string
  eyr?: string
  hgt?: string
  hcl?: string
  ecl?: string
  pid?: string
  cid?: string
}
const parsePassport = (passport: string): Passport => {
  const keyPairs = passport.split(' ').map((p) => {
    const [key, value] = p.trim().split(':')
    return { key, value }
  })
  return keyPairs.reduce((acc, v) => ({ ...acc, [v.key]: v.value }), {})
}

const isValid = (p: Passport): boolean => {
  // A lot of this should be parsing rather than validation :shrug:
  const byr = parseInt(p.byr)
  const iyr = parseInt(p.iyr)
  const eyr = parseInt(p.eyr)

  const match = /^(?<num>\d+)(?<units>cm|in)$/.exec(p.hgt)
  const unit = match?.groups?.units
  const num = parseInt(match?.groups?.num)
  const hgtValid = unit === 'cm'
    ? 150 <= num && num <= 193
    : unit === 'in'
    ? 59 <= num && num <= 76
    : false


  return (p.byr && 1920 <= byr && byr <= 2002 &&
    p.iyr && 2010 <= iyr && iyr <= 2020 &&
    p.eyr && 2020 <= eyr && eyr <= 2030 &&
    p.hgt && hgtValid &&
    p.hcl && /^\#[a-f|0-9]{6}$/.test(p.hcl) &&
    p.ecl && ['amb','blu','brn','gry','grn','hzl','oth'].includes(p.ecl) &&
    p.pid && /^\d{9}$/.test(p.pid)) as unknown as boolean
}


(async () => {
  const raw = await readlines('day04.txt')

  const placeholder = '&&&'
  const passports: string[] = raw.map((v) => v === '' ? placeholder : v).join(' ').split(placeholder)

  const valid = passports.filter((p) => {
    const parsed = parsePassport(p)
    return isValid(parsed)
  })

  console.log(valid.length)

})()