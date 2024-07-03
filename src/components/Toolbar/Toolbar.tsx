import React from 'react'
import style from './Toolbar.module.scss'

export const Toolbar: React.FC = () => {
  return (
    <div className={style.wrapper}>
      <button>Button 1</button>
      <button>Button 2</button>
    </div>
  )
}
