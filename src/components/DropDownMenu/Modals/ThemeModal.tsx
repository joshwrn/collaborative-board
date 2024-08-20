import React from 'react'

import { useStore } from '@/state/gen-state'

import Modal from '@/ui/TopBarModal'
import { AnimatePresence } from 'framer-motion'
import { Slider } from '@/ui/Slider'

const ThemeModal: React.FC = () => {
  const state = useStore([
    `setState`,
    `hue`,
    `saturation`,
    `lightness`,
    `updateTheme`,
    `resetTheme`,
  ])
  return (
    <Modal.Container
      onClose={() =>
        state.setState((draft) => {
          draft.showThemeModal = false
        })
      }
    >
      <Modal.Header title="Adjust Theme">
        <Modal.Button
          onClick={() => {
            state.resetTheme()
          }}
        >
          Reset
        </Modal.Button>
      </Modal.Header>
      <Modal.Content>
        <Slider
          label="Hue"
          value={state.hue}
          min={0}
          max={360}
          onChange={(num) => state.updateTheme({ hue: num })}
        />
        <Slider
          label="Saturation"
          value={parseInt(state.saturation)}
          min={-100}
          max={100}
          onChange={(num) => state.updateTheme({ saturation: num + `%` })}
        />
        <Slider
          label="Lightness"
          value={parseInt(state.lightness)}
          min={-20}
          max={20}
          onChange={(num) => state.updateTheme({ lightness: num + `%` })}
        />
      </Modal.Content>
    </Modal.Container>
  )
}

export const ThemeModalGuard = () => {
  const state = useStore([`showThemeModal`])
  return (
    <AnimatePresence>{state.showThemeModal && <ThemeModal />}</AnimatePresence>
  )
}
