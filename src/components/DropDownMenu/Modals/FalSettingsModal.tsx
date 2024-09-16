import { AnimatePresence } from 'framer-motion'
import React from 'react'

import { falSettingsSchema } from '@/state/fal'
import { useZ } from '@/state/gen-state'
import { Slider } from '@/ui/Slider'
import Modal from '@/ui/TopBarModal'

import style from './FalSettingsModal.module.scss'

const FalSettingsModal: React.FC = () => {
  const state = useZ([
    `setState`,
    `updateFalSettings`,
    `resetFalSettings`,
    `globalFalSettings`,
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
      <Modal.Header title="Global AI Settings">
        <Modal.Button onClick={() => state.resetFalSettings()}>
          Reset
        </Modal.Button>
      </Modal.Header>
      <Modal.Content>
        <Slider
          description={falSettingsSchema.shape.num_inference_steps.description}
          label="Inference Steps"
          step="1"
          value={state.globalFalSettings.num_inference_steps}
          min={falSettingsSchema.shape.num_inference_steps.minValue}
          max={falSettingsSchema.shape.num_inference_steps.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              num_inference_steps: value,
            })
          }}
        />
        <Slider
          description={falSettingsSchema.shape.guidance_scale.description}
          label="Guidance Scale"
          step={0.5}
          value={state.globalFalSettings.guidance_scale}
          min={falSettingsSchema.shape.guidance_scale.minValue}
          max={falSettingsSchema.shape.guidance_scale.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              guidance_scale: value,
            })
          }}
        />
        <Slider
          description={falSettingsSchema.shape.strength.description}
          label="Strength"
          value={state.globalFalSettings.strength}
          min={falSettingsSchema.shape.strength.minValue}
          max={falSettingsSchema.shape.strength.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              strength: value,
            })
          }}
        />
      </Modal.Content>
    </Modal.Container>
  )
}

export const FalSettingsModalGuard: React.FC = () => {
  const state = useZ([`showFalSettingsModal`])
  return (
    <AnimatePresence>
      {state.showFalSettingsModal && <FalSettingsModal />}
    </AnimatePresence>
  )
}
