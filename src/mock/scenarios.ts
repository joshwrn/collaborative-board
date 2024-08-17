import React from 'react'

import { useStore } from '@/state/gen-state'

export const useScenario = () => {
  const state = useStore([`createNewWindow`])
  const hasRan = React.useRef(false)

  React.useEffect(() => {
    if (hasRan.current) return
    hasRan.current = true
    state.createNewWindow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
