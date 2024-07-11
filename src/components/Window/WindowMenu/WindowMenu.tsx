import React from 'react'
import style from './WindowMenu.module.scss'
import Dropdown from '@/ui/Dropdown'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'

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
              state.addContentToItem(id, 'New Text')
            }}
            key={'Text'}
            label1="Text Block"
            isChecked={false}
          />,
          <Dropdown.Item
            onClick={() => {
              state.addContentToItem(id, { blob: '' })
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
