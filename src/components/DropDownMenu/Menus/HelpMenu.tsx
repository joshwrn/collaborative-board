import React from 'react'
import { PiGearLight } from 'react-icons/pi'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'
import { AboutModalGuard } from '../Modals/AboutModal'
import { TutorialModalGuard } from '../Modals/TutorialModal'

export const HelpMenu: React.FC = () => {
  const state = useStore([`setState`])
  return (
    <div className={style.item}>
      <Dropdown.Menu
        SelectedOption={() => <p>Help</p>}
        Options={[
          <Dropdown.Item
            onClick={() => {
              state.setState((draft) => {
                draft.showTutorialModal = true
              })
            }}
            key={`Tutorial`}
            label1="Tutorial"
          />,
          <Dropdown.Item
            onClick={() => {
              state.setState((draft) => {
                draft.showAboutModal = true
              })
            }}
            key={`About`}
            label1="About Scribble AI"
          />,
        ]}
      />
      <AboutModalGuard />
      <TutorialModalGuard />
    </div>
  )
}
