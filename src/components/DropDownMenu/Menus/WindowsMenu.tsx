import React from 'react'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'

export const WindowsMenu = () => {
  const state = useStore([
    `isSnappingOn`,
    `showConnections`,
    `setShowConnections`,
    `setState`,
    `createNewWindow`,
  ])
  return (
    <item className={style.item} id="dropdown-windows-button">
      <Dropdown.Menu
        SelectedOption={() => <p>Windows</p>}
        Options={[
          <Dropdown.Item
            key={`New Window`}
            onClick={() => {
              state.createNewWindow()
            }}
            label1={`New Window`}
            isChecked={false}
          />,
          <Dropdown.Item
            key={`Snapping`}
            onClick={() => {
              state.setState((draft) => {
                draft.isSnappingOn = !draft.isSnappingOn
              })
            }}
            label1={`Snapping`}
            isChecked={state.isSnappingOn}
          />,
          <Dropdown.Item
            key={`Show Connections`}
            onClick={() => {
              state.setShowConnections(!state.showConnections)
            }}
            label1={`Show Connections`}
            isChecked={state.showConnections}
          />,
        ]}
      />
    </item>
  )
}
