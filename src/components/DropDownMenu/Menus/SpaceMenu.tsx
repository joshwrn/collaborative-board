import React from 'react'

import { useStore } from '@/state/gen-state'
import { SPACE_ATTRS } from '@/state/space'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'
import { ThemeModal } from '../Modals/ThemeModal'

export const SpaceMenu = () => {
  const state = useStore([
    `zoom`,
    `setZoom`,
    `setPan`,
    `setState`,
    `showItemList`,
    `debug_showZustandDevTools`,
    `debug_showFps`,
    `showThemeModal`,
    `incrementZoom`,
  ])
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-space-button"
        SelectedOption={() => <p>Space</p>}
        Options={[
          <div className={style.zoom} key={`Zoom`}>
            <p>Zoom</p>
            <section onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => state.incrementZoom(-0.05)}
                id="dropdown-space-zoom-out-button"
                disabled={state.zoom <= SPACE_ATTRS.zoom.min}
              >
                <p>-</p>
              </button>
              <p>{state.zoom.toFixed(2)}</p>
              <button
                onClick={() => state.incrementZoom(0.05)}
                disabled={state.zoom >= SPACE_ATTRS.zoom.max}
                id="dropdown-space-zoom-in-button"
              >
                <p>+</p>
              </button>
            </section>
            <button
              className={style.reset}
              onClick={() => {
                state.setZoom(SPACE_ATTRS.zoom.default)
                state.setPan(() => SPACE_ATTRS.pan.default)
              }}
            >
              <p>Reset</p>
            </button>
          </div>,
          <Dropdown.Item
            key={`Show Item List`}
            onClick={() => {
              state.setState((draft) => {
                draft.showItemList = !draft.showItemList
              })
            }}
            label1={`Show Item List`}
            isChecked={state.showItemList}
          />,
          <Dropdown.Item
            key={`Theme`}
            onClick={() => {
              state.setState((draft) => {
                draft.showThemeModal = !draft.showThemeModal
              })
            }}
            label1={`Theme`}
          />,
        ]}
      />
      {state.showThemeModal && <ThemeModal />}
    </item>
  )
}
