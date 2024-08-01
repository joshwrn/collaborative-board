import { useStore } from '@/state/gen-state'
import React from 'react'

const SCENARIOS = ['rotation'] as const

type Scenario = (typeof SCENARIOS)[number]

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const useScenario = ({ scenario }: { scenario: Scenario }) => {
  const state = useStore([
    'createAllMocks',
    'setZoom',
    'setIsSnappingOn',
    'windows',
    'setOneWindow',
  ])

  const hasRan = React.useRef(false)

  React.useEffect(() => {
    switch (scenario) {
      case 'rotation':
        state.createAllMocks(3)
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
        state.setOneWindow(state.windows[0]?.id, {
          rotation: randomNumber(0, 360),
        })
        break
      default:
        break
    }
  }, [scenario, state])
}
