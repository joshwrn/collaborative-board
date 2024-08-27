import React from 'react'

import { useFullStore } from '@/state/gen-state'

export const useScenario = () => {
  const hasRan = React.useRef(false)

  React.useEffect(() => {
    if (hasRan.current) return
    hasRan.current = true
    const state = useFullStore.getState()
    state.createNewWindow()
  }, [])
}
