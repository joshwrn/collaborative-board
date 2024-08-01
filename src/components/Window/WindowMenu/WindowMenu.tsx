import React from 'react'
import style from './WindowMenu.module.scss'
import Dropdown from '@/ui/Dropdown'
import { useStore } from '@/state/gen-state'
import { nanoid } from 'nanoid'

export const WindowMenu: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useStore(['addContentToItem'])
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
                  base64: '',
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
