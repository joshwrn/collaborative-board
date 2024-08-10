import React from 'react'
import style from './DropDownMenu.module.scss'
import { SpaceMenu } from './Menus/SpaceMenu'
import { WindowsMenu } from './Menus/WindowsMenu'
import { AIMenu } from './Menus/AiMenu'
import { DevMenu } from './Menus/DevMenu'

export const DropDownMenu = () => {
  return (
    <wrapper className={style.wrapper}>
      <SpaceMenu />
      <WindowsMenu />
      <AIMenu />
      <DevMenu />
    </wrapper>
  )
}
