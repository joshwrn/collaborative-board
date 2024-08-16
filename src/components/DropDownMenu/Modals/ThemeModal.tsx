import React from 'react'
import style from './ThemeModal.module.scss'
import { useStore } from '@/state/gen-state'

export const ThemeModal: React.FC = () => {
  const state = useStore([
    'setState',
    'hue',
    'saturation',
    'lightness',
    'updateTheme',
    'resetTheme',
  ])
  return (
    <div className={'modalContainer'}>
      <div
        className={'modalBackdrop'}
        style={{
          opacity: 0,
        }}
        onClick={() =>
          state.setState((draft) => {
            draft.showThemeModal = false
          })
        }
      />
      <div className={style.modal}>
        <div className={style.header}>
          <h1>Adjust Theme</h1>
        </div>
        <div className={style.content}>
          <div className={style.slider}>
            <label htmlFor="hue">
              Hue <span>{state.hue}</span>
            </label>
            <input
              id="hue"
              type="range"
              min="0"
              max="360"
              value={state.hue}
              onChange={(e) => {
                state.updateTheme({
                  hue: parseInt(e.target.value),
                })
              }}
            />
          </div>
          <div className={style.slider}>
            <label htmlFor="saturation">
              Saturation
              <span>{state.saturation}</span>
            </label>
            <input
              id="saturation"
              type="range"
              min="-100"
              max="100"
              value={parseInt(state.saturation)}
              onChange={(e) => {
                state.updateTheme({
                  saturation: e.target.value + '%',
                })
              }}
            />
          </div>
          <div className={style.slider}>
            <label htmlFor="lightness">
              Lightness
              <span>{state.lightness}</span>
            </label>
            <input
              id="lightness"
              type="range"
              min="-20"
              max="20"
              value={parseInt(state.lightness)}
              onChange={(e) => {
                state.updateTheme({
                  lightness: e.target.value + '%',
                })
              }}
            />
          </div>
          <button
            className={style.resetButton}
            onClick={() => {
              state.resetTheme()
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
