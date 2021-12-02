export default function parseQueryToWordArray(q: string): string[] {
  const queryDeleteParenthesis = q?.replace(/\([^\)]*\)/gms, '')
  const formatQuery = queryDeleteParenthesis?.replace('\n', ',')
  const tableauMots = []
  const matches = formatQuery?.matchAll(/(['a-zA-Z\s-]+)/gms)
  if (!matches) {
    return []
  }
  for (const match of matches) {
    const val = match?.[1]?.trim()
    if (val) tableauMots.push(val)
  }
  return tableauMots
}
