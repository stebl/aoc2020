
import { readlines } from "./io"
import { groupLines, sumReducer, range, productReducer } from "./util"

type Range = { min: number, max: number }
type Rule = {
  name: string
  conditions: Range[]
}
const parseRule = (s: string): Rule => {
  const match = /^(?<name>.*): (?<conditions>.*)$/.exec(s)


  const name = match.groups.name
  const stringConditions = match.groups.conditions

  const conditions = stringConditions.split(' or ').map((c) => {
    const range = /^(?<min>\d+)-(?<max>\d+)$/.exec(c)
    return {
      min: parseInt(range.groups.min),
      max: parseInt(range.groups.max)
    }
  })

  return {
    name,
    conditions
  }
}

type TicketValues = number[]
const parseTicket = (s: string): TicketValues => {
  return s.split(',').map(n => parseInt(n))
}

const matchesRule = (value: number, rule: Rule): boolean => {
  for (const con of rule.conditions) {
    const matches = con.min <= value && value <= con.max
    if (matches) return true
  }
  return false
}

const matchesRules = (value: number, rules: Rule[]): boolean => {
  for (const rule of rules) {
    const matches = matchesRule(value, rule)
    if (matches) return true
  }
  return false
}

const findInvalidValues = (values: TicketValues, rules: Rule[]): number[] => {
  return values.filter((v) => !matchesRules(v, rules))
}

type Order = { name: string, column: number }
const findOrder = (candidateRuleNamesByColumn: string[][], order: Order[]): Order[] => {

  for (const idx of range(0, candidateRuleNamesByColumn.length)) {
    const candidates = candidateRuleNamesByColumn[idx]
    if (candidates.length === 1) {
      // If this is our next rule, remove it from the rest of the possibilities and recurse

      const nextRule = candidates[0]

      const newCandidateRuleNamesByColumn = candidateRuleNamesByColumn
        .map(ruleNames => ruleNames.filter(name => name != nextRule))

      console.log(`Rule ${nextRule} is for col ${idx}`)
      const nextOrder = {
        name: nextRule,
        column: idx
      }
      return findOrder(newCandidateRuleNamesByColumn, [...order, nextOrder])
    }
  }

  // If we didn't find anything, we're probably done
  return order
}


(async () => {
  const raw = await readlines('day16.txt')

  const grouped = groupLines(raw)

  const rules = grouped[0].map(parseRule)

  const yourTicket = parseTicket(grouped[1][1])
  const nearby = grouped[2].slice(1).map(parseTicket)

  const validTickets = nearby.filter((ticket) => {
    const invalidFields = findInvalidValues(ticket, rules)
    return invalidFields.length === 0
  })


  // All tickets have the same length
  const candidateRuleNamesByColumn: string[][] = range(0, yourTicket.length).map(idx => {
    // Check each rule against this range of values
    const potentialRules = rules.filter((rule) => {
      // return this rule if it's valid for each column
      const validColumns = validTickets.filter((t) => matchesRule(t[idx], rule))
      return validColumns.length === validTickets.length
    }).map((r) => r.name)

    console.log(`Column ${idx} is potentially valid for ${potentialRules}`)
    return potentialRules
  })

  const order = findOrder(candidateRuleNamesByColumn, [])


  const result = order
    .filter((o) => o.name.includes('departure'))
    .map((o) => yourTicket[o.column])
    .reduce(productReducer, 1)
  console.log(result)


})()
