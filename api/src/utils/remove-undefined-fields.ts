export default function removeUndefineds(obj: any) {
  return Object.keys(obj)
    .filter((key) => typeof obj[key] !== 'undefined')
    .reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {} as any)
}
