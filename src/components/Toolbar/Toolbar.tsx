import React from 'react'
import style from './Toolbar.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'

export const Toolbar: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      color: state.drawColor,
      setColor: state.setDrawColor,
      tool: state.tool,
      setTool: state.setTool,
      selectedWindow: state.selectedWindow,
    })),
  )

  if (state.selectedWindow === null) {
    return null
  }

  return (
    <div className={style.wrapper} id="toolbar">
      <button>Draw</button>
      <button>
        <div
          className={style.colorButton}
          style={{ backgroundColor: state.color }}
        />
        <input
          className={style.colorInput}
          type="color"
          value={state.color}
          onChange={(e) => state.setColor(e.target.value)}
        />
      </button>
    </div>
  )
}
