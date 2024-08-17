'use client'
import React from 'react'
import { ZustandDevTools } from 'zustand-state-inspector'

import { useFullStore } from '@/state/gen-state'

export const DevTools: React.FC = () => {
  const store = useFullStore()
  return (
    <ZustandDevTools
      state={store}
      showDevTools={store.debug_showZustandDevTools}
      setShowDevTools={store.debug_setShowZustandDevTools}
    />
  )
}

export default DevTools
