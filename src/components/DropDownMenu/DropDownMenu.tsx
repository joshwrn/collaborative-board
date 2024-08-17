import React from 'react'

import style from './DropDownMenu.module.scss'
import { AIMenu } from './Menus/AiMenu'
import { DevMenu } from './Menus/DevMenu'
import { FileMenu } from './Menus/FileMenu'
import { SpaceMenu } from './Menus/SpaceMenu'
import { WindowsMenu } from './Menus/WindowsMenu'

export const DropDownMenu = () => {
  return (
    <wrapper className={style.wrapper}>
      <FileMenu />
      <SpaceMenu />
      <WindowsMenu />
      <AIMenu />
      <DevMenu />
    </wrapper>
  )
}
