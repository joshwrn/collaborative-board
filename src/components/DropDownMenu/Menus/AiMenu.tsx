import React from 'react'
import { PiGearLight } from 'react-icons/pi'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'
import { FalSettingsModalGuard } from '../Modals/FalSettingsModal'

export const AIMenu = () => {
  const state = useStore([`setState`])
  return (
    <div className={style.item}>
      <Dropdown.Menu
        id="dropdown-ai-button"
        SelectedOption={() => <p>AI</p>}
        Options={[
          <Dropdown.Item
            Icon={() => <PiGearLight size={22} fill="var(--white)" />}
            onClick={() => {
              state.setState((draft) => {
                draft.showFalSettingsModal = true
              })
            }}
            key={`Create (Custom)`}
            label1="Settings"
          ></Dropdown.Item>,
        ]}
      />
      <FalSettingsModalGuard />
    </div>
  )
}
