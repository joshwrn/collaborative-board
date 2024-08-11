import React from 'react'
import style from '../DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import { IoSaveOutline } from 'react-icons/io5'
import { FiTrash } from 'react-icons/fi'
import { RiRefreshLine } from 'react-icons/ri'

export const FileMenu: React.FC = () => {
  const state = useStore([
    'setState',
    'successNotification',
    'saveToLocalStorage',
    'autoSaveEnabled',
  ])
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-file-button"
        SelectedOption={() => <p>File</p>}
        Options={[
          <Dropdown.Item
            key={'Save'}
            onClick={() => {
              state.saveToLocalStorage()
              state.successNotification('Saved!')
            }}
            isChecked={false}
            Icon={() => <IoSaveOutline />}
            label1="Save"
          />,
          <Dropdown.Item
            key={'Auto Save'}
            onClick={() => {
              state.setState((draft) => {
                draft.autoSaveEnabled = !state.autoSaveEnabled
              })
            }}
            isChecked={state.autoSaveEnabled}
            Icon={() => <RiRefreshLine />}
            label1="Auto Save"
          />,
          <Dropdown.Item
            key={'Clear All'}
            onClick={() =>
              state.setState((draft) => {
                draft.windows = []
                draft.items = []
                draft.connections = []
              })
            }
            isChecked={false}
            Icon={() => <FiTrash />}
            label1="Clear All"
          />,
        ]}
      />
    </item>
  )
}
