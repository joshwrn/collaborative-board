import React from 'react'
import style from './WindowMenu.module.scss'
import Dropdown from '@/ui/Dropdown'
import { useStore } from '@/state/gen-state'
import { nanoid } from 'nanoid'
import { BsFillPinAngleFill as PinIcon } from 'react-icons/bs'

export const WindowMenu: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useStore(['setState', 'pinnedWindow'])
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
                  stroke: 'white',
                }}
              />
            )}
            onClick={() => {
              state.setState((draft) => {
                draft.pinnedWindow = draft.pinnedWindow === id ? null : id
              })
            }}
            key={'Pin'}
            label1={state.pinnedWindow === id ? 'Unpin' : 'Pin'}
            isChecked={false}
          />,
        ]}
      />
    </div>
  )
}
