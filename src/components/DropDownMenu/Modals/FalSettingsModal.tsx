import { AnimatePresence } from 'framer-motion'
import React from 'react'

import { falSettingsSchema } from '@/state/fal'
import { useStore } from '@/state/gen-state'
import { Slider } from '@/ui/Slider'
import Modal from '@/ui/TopBarModal'

import style from './FalSettingsModal.module.scss'

const FalSettingsModal: React.FC = () => {
  const state = useStore([
    `fal_num_inference_steps`,
    `setState`,
    `updateFalSettings`,
    `resetFalSettings`,
    `fal_creativity`,
    `fal_detail`,
    `fal_guidance_scale`,
    `fal_shape_preservation`,
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
          description={falSettingsSchema.shape.num_inference_steps.description}
          label="Inference Steps"
          step="1"
          value={state.fal_num_inference_steps}
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
          value={state.fal_guidance_scale}
          min={falSettingsSchema.shape.guidance_scale.minValue}
          max={falSettingsSchema.shape.guidance_scale.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              guidance_scale: value,
            })
          }}
        />
        <Slider
          description={falSettingsSchema.shape.shape_preservation.description}
          label="Shape Preservation"
          value={state.fal_shape_preservation}
          min={falSettingsSchema.shape.shape_preservation.minValue}
          max={falSettingsSchema.shape.shape_preservation.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              shape_preservation: value,
            })
          }}
        />
        <Slider
          description={falSettingsSchema.shape.creativity.description}
          label="Creativity"
          value={state.fal_creativity}
          min={falSettingsSchema.shape.creativity.minValue}
          max={falSettingsSchema.shape.creativity.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              creativity: value,
            })
          }}
        />
        <Slider
          description={falSettingsSchema.shape.detail.description}
          label="Detail"
          value={state.fal_detail}
          min={falSettingsSchema.shape.detail.minValue}
          max={falSettingsSchema.shape.detail.maxValue}
          onChange={(value) => {
            state.updateFalSettings({
              detail: value,
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
