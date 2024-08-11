import React from 'react'
import style from './DropDownMenu.module.scss'
import { SpaceMenu } from './Menus/SpaceMenu'
import { WindowsMenu } from './Menus/WindowsMenu'
import { AIMenu } from './Menus/AiMenu'
import { DevMenu } from './Menus/DevMenu'
import { FileMenu } from './Menus/FileMenu'

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
