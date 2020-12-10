import { writeFile as writeFileCallback, access as accessCallback } from 'fs'
import { promisify } from 'util'
import { get as getCallback } from 'https'

const writeFile = promisify(writeFileCallback);
const access = promisify(accessCallback);

export const fileExists = async (filename: string): Promise<boolean> => {
  try {
    await access(filename)
    return true
  } catch {
    return false
  }
}

export const safeWriteFile = async (filename: string, data: string): Promise<void> => {
  const exists = await fileExists(filename)
  if (exists) throw new Error(`${filename} exists and expected it not to`)
  return writeFile(filename, data)
}

export const get = (url: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    getCallback(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => data += chunk);
      resp.on('end', () => resolve(data));
      resp.on("error", (err) => reject(err));
    })
  })
}

/**
 * Usage:
 * ts-node template.ts [dayNumber]
 *
 * ex. ts-node template.ts 07
 */
(async () => {
  const dayNumber = process.argv[2]

  const inputFile = `day${dayNumber}.txt`
  const tsFile = `day${dayNumber}.ts`

  const filesExists = (await Promise.all([
    fileExists(inputFile),
    fileExists(tsFile)
  ])).every((v) => v)

  if (filesExists) {
    console.log(`\nOne or more files already exist for day${dayNumber}\n`)
    return
  }

  const template = `
import { readlines } from "./io"

(async () => {
  const raw = await readlines('${inputFile}')

})()
`

  await safeWriteFile(tsFile, template)
  await safeWriteFile(inputFile, '')

  // Could fetch this from the URL, but need to be logged in to get correct input
  // const data = await get(`https://adventofcode.com/2020/day/${day}/input`)
  // console.log(data)

})()
