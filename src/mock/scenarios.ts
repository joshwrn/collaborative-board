import { useStore } from '@/state/gen-state'
import React from 'react'

export const useScenario = () => {
  const state = useStore(['createNewWindow'])
  const hasRan = React.useRef(false)

  React.useEffect(() => {
    if (hasRan.current) return
    hasRan.current = true
    state.createNewWindow()
  }, [])
}
