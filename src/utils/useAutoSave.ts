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
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsDirty(true)
    const timer = setTimeout(async () => {
      if (!state.autoSaveEnabled) return
      const now = Date.now()
      if (now - lastSavedAtRef.current > debounceTime) {
        setIsDirty(false)
        lastSavedAtRef.current = now
        try {
          await state.saveToLocalStorage()
          setError(null)
        } catch (e: any) {
          setError(e.message || 'Failed to save')
        }
      }
    }, debounceTime)
    return () => {
      clearTimeout(timer)
    }
  }, [state])

  return {
    error,
    isDirty,
  }
}
