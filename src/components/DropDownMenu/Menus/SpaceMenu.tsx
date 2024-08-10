import React from 'react'
import style from '../DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'
import { SPACE_ATTRS } from '@/state/space'

export const SpaceMenu = () => {
  const state = useStore([
    'zoom',
    'setZoom',
    'setPan',
    'setState',
    'showItemList',
    'debug_showZustandDevTools',
    'debug_showFps',
  ])
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-space-button"
        SelectedOption={() => <p>Space</p>}
        Options={[
          <div className={style.zoom} key={'Zoom'}>
            <p>Zoom</p>
            <section onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => state.setZoom(state.zoom - 0.05)}
                id="dropdown-space-zoom-out-button"
                disabled={state.zoom <= SPACE_ATTRS.min.zoom}
              >
                <p>-</p>
              </button>
              <p>{state.zoom.toFixed(2)}</p>
              <button
                onClick={() => state.setZoom(state.zoom + 0.05)}
                disabled={state.zoom >= SPACE_ATTRS.max.zoom}
                id="dropdown-space-zoom-in-button"
              >
                <p>+</p>
              </button>
            </section>
            <button
              className={style.reset}
              onClick={() => {
                state.setZoom(SPACE_ATTRS.default.zoom)
                state.setPan(() => ({
                  x: SPACE_ATTRS.default.pan.x,
                  y: SPACE_ATTRS.default.pan.y,
                }))
              }}
            >
              <p>Reset</p>
            </button>
          </div>,
          <Dropdown.Item
            key={'Show Item List'}
            onClick={() => {
              state.setState((draft) => {
                draft.showItemList = !draft.showItemList
              })
            }}
            label1={'Show Item List'}
            isChecked={state.showItemList}
          />,
        ]}
      />
    </item>
  )
}