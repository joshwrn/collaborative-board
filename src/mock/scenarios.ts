import { z } from 'zod'

import { fetchScenario } from '@/server/scenario/fetchScenario'
import { store } from '@/state/gen-state'
import { saveStateSchema } from '@/state/general'
import { useOnLoad } from '@/utils/useInitial'

export const loadScenario = async (scenario: string) => {
  const state = store.getState()
  const data = await fetchScenario({
    scenario: scenario,
  })
  try {
    const saveObject = saveStateSchema.parse(data.scenario)
    state.setState((draft) => {
      draft.windows = saveObject.windows
      draft.items = saveObject.items
      draft.itemConnections = saveObject.connections
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors)
      return
    }
    console.error(error)
  }
}

export const useScenario = () => {
  useOnLoad(async () => {
    if (process.env.NEXT_PUBLIC_SHOW_DEBUG !== `true`) {
      return
    }
    await loadScenario(`data-2`)
  })
}
