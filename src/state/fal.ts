import type { AppStateCreator } from './state'

export interface FalStore {
  fal_num_inference_steps: number
}

export const falStore: AppStateCreator<FalStore> = (set, get) => ({
  fal_num_inference_steps: 20,
})
