'use client'
import React from 'react'
import { ZustandDevTools } from 'zustand-state-inspector'

import { store } from '@/state/gen-state'

export const DevTools: React.FC = () => {
  const state = store()
  return (
    <ZustandDevTools
      state={state}
      showDevTools={state.debug_showZustandDevTools}
      setShowDevTools={state.debug_setShowZustandDevTools}
    />
  )
}

export default DevTools
