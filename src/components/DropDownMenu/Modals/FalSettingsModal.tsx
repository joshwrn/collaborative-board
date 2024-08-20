import React from 'react'
import style from './FalSettingsModal.module.scss'
import { useStore } from '@/state/gen-state'
import { AnimatePresence } from 'framer-motion'
import Modal from '@/ui/TopBarModal'
import { Slider } from '@/ui/Slider'

const FalSettingsModal: React.FC = () => {
  const state = useStore([
    `fal_num_inference_steps`,
    `setState`,
    `resetFalSettings`,
  ])
  return (
    <Modal.Container
      modalClassName={style.wrapper}
      onClose={() => {
        state.setState((draft) => {
          draft.showFalSettingsModal = false
        })
      }}
    >
      <Modal.Header title="AI Settings">
        <Modal.Button onClick={() => state.resetFalSettings()}>
          Reset
        </Modal.Button>
      </Modal.Header>
      <Modal.Content>
        <Slider
          label="Inference Steps"
          value={state.fal_num_inference_steps}
          min={1}
          max={200}
          onChange={(value) => {
            state.setState((draft) => {
              draft.fal_num_inference_steps = value
            })
          }}
        />
      </Modal.Content>
    </Modal.Container>
  )
}

export const FalSettingsModalGuard: React.FC = () => {
  const state = useStore([`showFalSettingsModal`])
  return (
    <AnimatePresence>
      {state.showFalSettingsModal && <FalSettingsModal />}
    </AnimatePresence>
  )
}
