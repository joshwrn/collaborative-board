import type { AppStateCreator } from './state'

export interface FalStore {
  showFalSettingsModal: boolean
  fal_num_inference_steps: number
  resetFalSettings: () => void
}

const DEFAULT_FAL_SETTINGS = {
  fal_num_inference_steps: 20,
}

export const falStore: AppStateCreator<FalStore> = (set, get) => ({
  fal_num_inference_steps: 20,
  showFalSettingsModal: false,
  resetFalSettings: () => {
    const state = get()
    state.setState((draft) => {
      draft.fal_num_inference_steps =
        DEFAULT_FAL_SETTINGS.fal_num_inference_steps
    })
  },
})
