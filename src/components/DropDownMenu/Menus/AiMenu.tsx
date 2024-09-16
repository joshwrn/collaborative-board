import React from 'react'

import { useZ } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'
import { FalSettingsModalGuard } from '../Modals/FalSettingsModal'

export const AIMenu = () => {
  const state = useZ([`setState`, `createFalSettingsNode`])
  return (
    <div className={style.item}>
      <Dropdown.Menu
        id="dropdown-ai-button"
        SelectedOption={() => <p>AI</p>}
        Options={[
          <Dropdown.Item
            onClick={() => {
              state.setState((draft) => {
                draft.showFalSettingsModal = true
              })
            }}
            key={`Global Settings`}
            label1="Global Settings"
          />,
          <Dropdown.Item
            onClick={() => {
              state.createFalSettingsNode()
            }}
            key={`New AI Settings Node`}
            label1="New AI Settings Node"
          />,
        ]}
      />
      <FalSettingsModalGuard />
    </div>
  )
}
