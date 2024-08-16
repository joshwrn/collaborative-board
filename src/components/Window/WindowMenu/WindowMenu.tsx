import React from 'react'
import style from './WindowMenu.module.scss'
import Dropdown from '@/ui/Dropdown'
import { useStore } from '@/state/gen-state'
import { nanoid } from 'nanoid'
import { TiPinOutline as PinIcon } from 'react-icons/ti'

import { BsTrash3 as TrashIcon } from 'react-icons/bs'

export const WindowMenu_Internal: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useStore(['setState', 'pinnedWindow', 'deleteItem'])
  return (
    <div className={style.wrapper}>
      <Dropdown.Menu
        id="dropdown-window-button"
        SelectedOption={() => <p>Menu</p>}
        Options={[
          <Dropdown.Item
            Icon={() => (
              <PinIcon
                style={{
                  fill: 'var(--white)',
                }}
                size={21}
              />
            )}
            onClick={() => {
              state.setState((draft) => {
                draft.pinnedWindow = draft.pinnedWindow === id ? null : id
              })
            }}
            key={'Pin'}
            isChecked={state.pinnedWindow === id}
            label1={'Pin'}
          />,
          <Dropdown.Item
            Icon={() => (
              <TrashIcon
                style={{
                  fill: 'var(--white)',
                }}
              />
            )}
            onClick={() => {
              state.deleteItem(id)
            }}
            key={'Delete'}
            label1={'Delete'}
          />,
        ]}
      />
    </div>
  )
}

export const WindowMenu = React.memo(WindowMenu_Internal)
