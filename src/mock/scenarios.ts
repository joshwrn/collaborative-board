import { useAppStore } from '@/state/gen-state'
import React from 'react'
import { useShallow } from 'zustand/react/shallow'

const SCENARIOS = ['rotation'] as const

type Scenario = (typeof SCENARIOS)[number]

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const useScenario = ({ scenario }: { scenario: Scenario }) => {
  const state = useAppStore(
    useShallow((s) => ({
      createMocks: s.createAllMocks,
      setZoom: s.setZoom,
      setIsSnappingOn: s.setIsSnappingOn,
      windows: s.windows,
      setWindow: s.setOneWindow,
    })),
  )

  const hasRan = React.useRef(false)

  React.useEffect(() => {
    switch (scenario) {
      case 'rotation':
        state.createMocks(3)
        state.setZoom(0.25)
        state.setIsSnappingOn(true)
        break
      default:
        break
    }
  }, [scenario])

  React.useEffect(() => {
    if (hasRan.current) return

    switch (scenario) {
      case 'rotation':
        if (state.windows.length === 0) return
        hasRan.current = true
        state.setWindow(state.windows[0]?.id, { rotation: randomNumber(0, 360) })
        break
      default:
        break
    }
  }, [scenario, state])
}
