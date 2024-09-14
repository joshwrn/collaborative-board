import { useFullStore } from '@/state/gen-state'
import { DEFAULT_WINDOW } from '@/state/windows'
import { useOnLoad } from '@/utils/useInitial'

export const useInitialScene = () => {
  useOnLoad(async () => {
    const s = useFullStore.getState()
    const windowId = s.createNewWindow()
    const [newWindow] = useFullStore.getState().windows
    s.setOneWindow(windowId, {
      x: newWindow.x - DEFAULT_WINDOW.width / 2.5,
    })
    const nodeId = s.createFalSettingsNode({
      falSettingsWindow: {
        x: newWindow.x - DEFAULT_WINDOW.width / 2.5 - 600,
        y: newWindow.y + 80,
      },
    })
    s.makeFalSettingsConnection(nodeId, windowId)
    await s.generateInitialWindow(windowId, true)
  })
}
