
import { readlines } from "./io"

type MaskInstr = {
  op: 'mask'
  shouldBeOnes: bigint
  shouldBeUnchanged: bigint
  floating: bigint
}
type MemInstr = {
  op: 'mem'
  address: bigint
  value: bigint
}
type Instruction = MaskInstr | MemInstr

const parseLine = (s: string): Instruction => {
  const mask = /^(?<op>mask) = (?<value>[X10]+)$/.exec(s)
  const mem = /^(?<op>mem)\[(?<address>[\d|X]+)\] = (?<value>\d+)$/.exec(s)

  return mask?.groups ? {
    op: 'mask',
    shouldBeOnes: BigInt(parseInt(mask.groups.value.split('').map(v => v === '1' ? '1' : '0').join(''), 2)),
    shouldBeUnchanged: BigInt(parseInt(mask.groups.value.split('').map(v => v === '0' ? '1' : '0').join(''), 2)),
    floating: BigInt(parseInt(mask.groups.value.split('').map(v => v === 'X' ? '1' : '0').join(''), 2))
  } : {
    op: 'mem',
    address: BigInt(parseInt(mem.groups.address)),
    value: BigInt(parseInt(mem.groups.value))
  }
}

type Memory = { [s: string]: bigint }
const writeFloatingAddresses = (mem: Memory, mask: MaskInstr, memInstr: MemInstr): Memory => {
  const copy = { ...mem }
  const baseAddress = (memInstr.address | mask.shouldBeOnes)

  const addresses = getAddresses(mask.floating, BigInt(1), [baseAddress])

  addresses.forEach((address) => {
    copy[String(address)] = memInstr.value
  })

  return copy
}

const getAddresses = (floating: bigint, n: bigint, addresses: bigint[]): bigint[] => {
  if (n > BigInt(2**35)) return addresses

  const thisBitFloats = floating & n

  const newAddresses = thisBitFloats ?
    addresses.map((add) => [add | n, add & (~n)]).flat()
    : addresses

  return getAddresses(floating, n * BigInt(2), newAddresses)
}

(async () => {
  const raw = await readlines('day14.txt')
  const instr = raw.map(parseLine)
  console.log(instr)


  let memory: Memory = {}
  let mask: MaskInstr
  for (const inst of instr) {
    if (inst.op === 'mask') {
      mask = inst
      continue
    }

    memory = writeFloatingAddresses(memory, mask, inst)
  }

  const result = Object.entries(memory).reduce((p, [_address, value]) => p + value, BigInt(0))
  console.log(result)
})()
