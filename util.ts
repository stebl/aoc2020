

/**
 * Solves the common reformatting task of turning,
 * [
 *   'a',
 *   'b',
 *   '',
 *   'x',
 *   'y'
 * ]
 * Into,
 * [
 *   [ 'a', 'b' ],
 *   [ 'x', 'y' ]
 * ]
 */
export const groupLines = (lines: readonly string[], separator: string = ''): string[][] => {
  let result = [[]]

  lines.forEach(line => {
    if (line === separator) result.push([])
    else result[result.length - 1].push(line)
  })

  return result
}