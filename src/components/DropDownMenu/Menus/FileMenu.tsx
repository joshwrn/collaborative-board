import React from 'react'
import style from '../DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'
import { WindowType } from '@/state/windows'
import { Item } from '@/state/items'
import { Connection } from '@/state/connections'

import { IoSaveOutline } from 'react-icons/io5'
import { FiTrash } from 'react-icons/fi'
import { Point2d } from '@/state'

const saveToLocalStorage = (state: {
  windows: WindowType[]
  items: Item[]
  connections: Connection[]
  zoom: number
  pan: Point2d
}) => {
  localStorage.setItem('ai-sketch-app', JSON.stringify(state))
}

export const FileMenu: React.FC = () => {
  const state = useStore([
    'windows',
    'items',
    'connections',
    'zoom',
    'pan',
    'setState',
    'successNotification',
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
              saveToLocalStorage({
                windows: state.windows,
                items: state.items,
                connections: state.connections,
                zoom: state.zoom,
                pan: state.pan,
              })
              state.successNotification('Saved!')
            }}
            isChecked={false}
            Icon={() => <IoSaveOutline />}
            label1="Save"
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
