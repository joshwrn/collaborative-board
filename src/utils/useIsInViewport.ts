import { useLayoutEffect, useState } from 'react'

export function useIsInViewport(
  ref: React.MutableRefObject<HTMLElement | null>,
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    })
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return isIntersecting
}

export const useHasBeenInViewport = (
  ref: React.MutableRefObject<HTMLElement | null>,
) => {
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasBeenSeen(true)
        observer.disconnect()
      }
    })
    if (ref.current) {
      observer.observe(ref.current)
    }
  }, [ref])

  return hasBeenSeen
}
