import { readlines } from "./io"
import { groupLines } from "./util"


type GroupAnswers = {
  nPeople: number
  answers: Record<string, undefined | number>
}
const parseGroup = (people: string[]): GroupAnswers => {

  let answers = {}
  people.forEach(person => {
    person.split('').forEach(question => {
      const count = answers[question] ?? 0
      answers[question] = count + 1
    })
  })

  return {
    answers,
    nPeople: people.length
  }
}

(async () => {
  const raw = await readlines('day06.txt')

  const groups = groupLines(raw, '')
  const groupAnswers = groups.map(parseGroup)

  const yesCountsPerGroup = groupAnswers.map(g => Object.keys(g.answers).length)
  const sumAnyYesPerGroup = yesCountsPerGroup.reduce((p, c) => p + c, 0)
  console.log(sumAnyYesPerGroup)

  const sumAllYesPerGroup = groupAnswers.reduce((p, c) => {
    const allAnsweredYes = Object.values(c.answers).filter((v) => v === c.nPeople).length
    return p + allAnsweredYes
  }, 0)

  console.log(sumAllYesPerGroup)

})()