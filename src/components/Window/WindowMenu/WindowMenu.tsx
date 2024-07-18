import React from 'react'
import style from './WindowMenu.module.scss'
import Dropdown from '@/ui/Dropdown'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { nanoid } from 'nanoid'

export const WindowMenu: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useAppStore(
    useShallow((state) => ({
      addContentToItem: state.addContentToItem,
    })),
  )
  return (
    <div className={style.wrapper}>
      <Dropdown.Menu
        id="dropdown-window-button"
        SelectedOption={() => <p>New</p>}
        Options={[
          <Dropdown.Item
            onClick={() => {
              state.addContentToItem(id, {
                content: 'New Text',
                type: 'text',
                id: nanoid(),
              })
            }}
            key={'Text'}
            label1="Text Block"
            isChecked={false}
          />,
          <Dropdown.Item
            onClick={() => {
              state.addContentToItem(id, {
                type: 'canvas',
                content: {
                  blob: '',
                },
                id: nanoid(),
              })
            }}
            key={'Canvas'}
            label1="Canvas"
            isChecked={false}
          />,
        ]}
      />
    </div>
  )
}
