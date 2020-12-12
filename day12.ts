
import { readlines } from "./io"
import { mapping, Coord, range } from "./util"

type Maneuver = { move: string, value: number }
const parseManeuver = (s: string): Maneuver => {
  const match = /^(?<move>.)(?<value>\d+)$/.exec(s)

  return {
    move: match.groups.move,
    value: parseInt(match.groups.value)
  }
}

const headings = ['N', 'E', 'S', 'W'] as const
type Heading = typeof headings[number]
type Orientation = {
  ship: Coord
  waypoint: Coord
}

const doRotate = (h: Heading, { move, value }: Maneuver): Heading => {
  const normalizedValue = value / 90
  const currentIndex = headings.indexOf(h)
  if (move === 'R') return headings[(currentIndex + normalizedValue) % 4]
  if (move === 'L') return headings[(currentIndex - normalizedValue + 4) % 4]
}

const cos = (deg: number): number => Math.cos(deg * Math.PI / 180)
const sin = (deg: number): number => Math.sin(deg * Math.PI / 180)

const rotateAboutOrigin = ({ x, y }: Coord, maneuver: Maneuver): Coord => {
  const value = maneuver.move === 'L' ? maneuver.value : -maneuver.value
  // Negative y values are to account for the upside down y-axis we've been using
  return {
    x: Math.round(cos(value) * x - sin(value) * (-y)),
    y: -Math.round(sin(value) * x + cos(value) * (-y))
  }
}

const holonomicMove = ({ y, x }: Coord, { move, value }: Maneuver): Coord => {
  if (move === 'N') return { y: y - value, x }
  if (move === 'S') return { y: y + value, x }
  if (move === 'W') return { y, x: x - value }
  if (move === 'E') return { y, x: x + value }
}

const moveTowards = (origin: Coord, relative: Coord): Coord => {
  return { x: origin.x + relative.x, y: origin.y + relative.y }
}

/** We have a holonomic ship :P */
const doMove = ({ ship, waypoint }: Orientation, { move, value }: Maneuver): Orientation => {

  if (move === 'N') return { ship, waypoint: holonomicMove(waypoint, { move, value }) }
  if (move === 'S') return { ship, waypoint: holonomicMove(waypoint, { move, value }) }
  if (move === 'W') return { ship, waypoint: holonomicMove(waypoint, { move, value }) }
  if (move === 'E') return { ship, waypoint: holonomicMove(waypoint, { move, value }) }

  if (move === 'F') {
    return {
      ship: range(0, value).reduce((p) => moveTowards(p, waypoint), ship),
      waypoint
    }
  }

  if (move === 'L' || move === 'R') {
    return {
      ship,
      waypoint: rotateAboutOrigin(waypoint, { move, value })
    }
  }
}


(async () => {
  const raw = await readlines('day12.txt')

  const key = mapping({
    'N': 'move-north',
    'S': 'move-south',
    'E': 'move-east',
    'W': 'move-west',
    'F': 'move-forward',
    'L': 'turn-left',
    'R': 'turn-right',
  })

  const moves = raw.map(parseManeuver)

  let loc: Orientation = {
    ship: {
      y: 0,
      x: 0,
    },
    waypoint: {
      y: -1, // 1  N
      x: 10  // 10 E
    }
  }
  moves.forEach((maneuver) => {
    console.log(loc, maneuver)
    loc = doMove(loc, maneuver)
  })
  console.log(loc)

  console.log(`${Math.abs(loc.ship.x) + Math.abs(loc.ship.y)}`)

})()
