import { Store, useStore } from '@/state/gen-state'
import { SavedState } from '@/state/general'
import React from 'react'

const debounceTime = 3000

export const useAutoSave = () => {
  const state: Omit<SavedState, 'pan' | 'zoom'> &
    Pick<Store, 'successNotification' | 'saveToLocalStorage'> = useStore([
    'windows',
    'items',
    'connections',
    'successNotification',
    'saveToLocalStorage',
    'autoSaveEnabled',
  ])
  const lastSavedAtRef = React.useRef(Date.now())
  const [isDirty, setIsDirty] = React.useState(false)

  React.useEffect(() => {
    setIsDirty(true)
    const timer = setTimeout(() => {
      if (!state.autoSaveEnabled) return
      const now = Date.now()
      if (now - lastSavedAtRef.current > debounceTime) {
        setIsDirty(false)
        lastSavedAtRef.current = now
        state.saveToLocalStorage()
      }
    }, debounceTime)
    return () => {
      clearTimeout(timer)
    }
  }, [state])

  return {
    isDirty,
  }
}
