import React from 'react'

export const useOnLoad = (fn: () => void) => {
  const hasRan = React.useRef(false)

  React.useEffect(() => {
    if (hasRan.current) return
    hasRan.current = true
    fn()
  }, [fn])
}
