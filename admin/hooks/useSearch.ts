import { useCallback, useRef } from 'react'

export default function useSearch(fetchMoreFn: (searchTerms: string) => void, timeout = 300) {
  const timeoutRef = useRef<any>(null)

  const search = useCallback((terms: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      fetchMoreFn(terms)
    }, timeout)
  }, [])

  return search
}
