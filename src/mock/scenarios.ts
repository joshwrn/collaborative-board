import { z } from 'zod'

import { fetchScenario } from '@/server/scenario/fetchScenario'
import { useFullStore } from '@/state/gen-state'
import { saveStateSchema } from '@/state/general'
import { useOnLoad } from '@/utils/useInitial'

export const useScenario = () => {
  useOnLoad(async () => {
    if (process.env.NEXT_PUBLIC_SHOW_DEBUG !== `true`) {
      return
    }
    const state = useFullStore.getState()
    const data = await fetchScenario({
      scenario: `data-1`,
    })
    try {
      const saveObject = saveStateSchema.parse(data.scenario)
      state.setState((draft) => {
        draft.windows = saveObject.windows
        draft.items = saveObject.items
        draft.connections = saveObject.connections
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors)
        return
      }
      console.error(error)
    }
  })
}
