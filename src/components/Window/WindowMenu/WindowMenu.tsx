import React from 'react'
import style from './WindowMenu.module.scss'
import Dropdown from '@/ui/Dropdown'
import { useStore } from '@/state/gen-state'
import { nanoid } from 'nanoid'

export const WindowMenu: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useStore([])
  return (
    <div className={style.wrapper}>
      <Dropdown.Menu
        id="dropdown-window-button"
        SelectedOption={() => <p>New</p>}
        Options={[
          <Dropdown.Item
            onClick={() => {}}
            key={'Pin'}
            label1="Pin"
            isChecked={false}
          />,
        ]}
      />
    </div>
  )
}
