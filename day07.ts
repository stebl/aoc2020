import { readlines } from "./io"

type Child = {
  count: number
  name: BagType
}
type BagType = string
type Node = {
  name: BagType
  parents: BagType[]
  contains: Child[]
}
type Graph = {
  [s: string]: Node
}

const defaultNode = (name: BagType): Node => ({
  name,
  parents: [],
  contains: []
})

const addNode = (graph: Graph, parent: BagType, children: Child[]): Graph => {
  const copy = { ...graph }

  // Create a shell for the parent if it doesn't already exist
  const current: Node = copy[parent] ?? defaultNode(parent)

  children.forEach(c => {
    if (current.contains.includes(c)) throw new Error(`Unexpected duplicate`)
  })

  // Add the children to the parent
  current.contains = current.contains.concat(children)

  // Create the child nodes with references to the parent if they don't already exist
  children.forEach(child => {
    const currentChild: Node = copy[child.name] ?? defaultNode(child.name)

    if (currentChild.parents.includes(parent)) throw new Error(`Unexpected duplicate`)

    currentChild.parents.push(parent)

    copy[child.name] = currentChild
  })

  copy[parent] = current
  return copy
}

const parseTree = (rules: string[]): Graph => {
  let tree = {}

  rules.forEach((rule) => {
    const match = /^(?<parent>.*) bags? contain (?<children>.*)\./.exec(rule)

    const parent = match.groups.parent as BagType // e.g. "light silver bags"
    const children = match.groups.children.split(', ')

    const parsedChildren: Child[] = children.map((child: string) => {
      const match = /^(?<count>\d+) (?<name>.*) bags?/.exec(child)

      return match?.groups?.count ? { count: parseInt(match.groups.count), name: match.groups.name as BagType } : undefined
    }).filter((v) => v !== undefined)

    tree = addNode(tree, parent, parsedChildren)
  })

  return tree
}

const validateGraph = (tree: Graph, raw: string[]): void => {
  const keys = Object.keys(tree)

  if (keys.length !== raw.length) throw new Error(`Need a node for every rule`)

  keys.forEach((k) => {
    // Check each node has the correct parent/child linkages
    const { name, contains, parents } = tree[k]
    // For each of my children, they should have me as a parent
    contains.forEach((child) => {
      if (!tree[child.name].parents.includes(name)) throw new Error(`Expected parent-child linkage`)
    })
    // For each of my parents, they should have me as a child
    parents.forEach((parent) => {
      const parentsChildren = tree[parent].contains.map(c => c.name)
      if (!parentsChildren.includes(name)) throw new Error(`Expected parent-child linkage`)
    })
  })
}

const collectParents = (graph: Graph, name: BagType): BagType[] => {
  const parents = graph[name].parents
  const nParents = parents.length

  const grandParents = nParents === 0
    ? [name]
    : parents
      .map((p) => collectParents(graph, p))
      .reduce((p, c) => [...p, ...c], [])

  return [...parents, ...grandParents]
}

const countBags = (graph: Graph, name: BagType): number => {
  const { contains } = graph[name]

  return contains.reduce((p, c) => p + (c.count + c.count * countBags(graph, c.name)), 0)
}

(async () => {
  const raw = await readlines('day07.txt')

  const tree = parseTree(raw)

  validateGraph(tree, raw)

  const parents = collectParents(tree, 'shiny gold')
  console.log(`Count: ${new Set(parents).size}`)

  const count = countBags(tree, 'shiny gold')
  console.log(`Count: ${count}`)

})()