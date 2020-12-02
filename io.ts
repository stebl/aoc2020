import {createReadStream } from 'fs'
import { createInterface } from 'readline'

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