const debounce = (callback: Function, wait: number) => {
  let timeoutId: number
  return (...args: any) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}

export default debounce
