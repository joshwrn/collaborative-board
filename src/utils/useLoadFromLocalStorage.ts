import { Store, useStore } from '@/state/gen-state'
import React from 'react'

export const useLoadFromLocalStorage = () => {
  const state = useStore(['setState'])
  React.useEffect(() => {
    const savedState = localStorage.getItem('ai-sketch-app')
    if (savedState) {
      state.setState((draft) => {
        const parsedState = JSON.parse(savedState)
        for (const key in parsedState) {
          // @ts-expect-error
          draft[key as keyof Store] = parsedState[key]
        }
      })
    }
  }, [])
}
