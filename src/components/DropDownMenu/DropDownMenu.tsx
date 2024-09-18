import React from 'react'

import style from './DropDownMenu.module.scss'
import { AIMenu } from './Menus/AiMenu'
import { DevMenu } from './Menus/DevMenu'
import { FileMenu } from './Menus/FileMenu'
import { HelpMenu } from './Menus/HelpMenu'
import { SpaceMenu } from './Menus/SpaceMenu'
import { WindowsMenu } from './Menus/WindowsMenu'

const DropDownMenu_Internal: React.FC = () => {
  return (
    <nav className={style.wrapper}>
      <FileMenu />
      <SpaceMenu />
      <WindowsMenu />
      <AIMenu />
      <HelpMenu />
      <DevMenu />
    </nav>
  )
}
export const DropDownMenu = React.memo(DropDownMenu_Internal)
