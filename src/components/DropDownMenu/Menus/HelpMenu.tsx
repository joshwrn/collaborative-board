import React from 'react'
import { PiGearLight } from 'react-icons/pi'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'
import { AboutModalGuard } from '../Modals/AboutModal'

export const HelpMenu: React.FC = () => {
  const state = useStore([`setState`])
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-ai-button"
        SelectedOption={() => <p>About</p>}
        Options={[
          <Dropdown.Item
            onClick={() => {
              state.setState((draft) => {
                draft.showAboutModal = true
              })
            }}
            key={`About`}
            label1="About Scribble AI"
          ></Dropdown.Item>,
        ]}
      />
      <AboutModalGuard />
    </item>
  )
}
