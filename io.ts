import {createReadStream } from 'fs'
import { createInterface } from 'readline'
import { operations, Instruction, Operation } from './util';

export const readlines = async (file: string): Promise<string[]> => {
  const fileStream = createReadStream(file);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let result = []
  for await (const line of rl) {
    result.push(line)
  }
  return result
}

export const parseProgram = (lines: string[]): Instruction[] => {
  const validOps = operations.join('|')
  // You could do this in one regex across the entire file
  const re = new RegExp(`^(?<op>(${validOps})) (?<arg>[-+]\\d+)$`)

  return lines.map(line => {
    const match = re.exec(line)

    const op = match.groups.op
    const arg = match.groups.arg

    // TODO: assert

    return {
      op: op as Operation,
      arg: parseInt(arg)
    }
  })
}