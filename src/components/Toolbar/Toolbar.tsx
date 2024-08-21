import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { PiPaintBrushThin } from 'react-icons/pi'

import { useStore } from '@/state/gen-state'
import { Slider } from '@/ui/Slider'
import { joinClasses } from '@/utils/joinClasses'
import { useOutsideClick } from '@/utils/useOutsideClick'

import style from './Toolbar.module.scss'

export const Toolbar: React.FC = () => {
  const state = useStore([
    `drawColor`,
    `tool`,
    `drawSize`,
    `setState`,
    `selectedWindow`,
  ])

  const [open, setOpen] = React.useState<boolean>(false)
  const brushSizeRef = React.useRef<HTMLInputElement>(null)
  const brushButtonRef = React.useRef<HTMLButtonElement>(null)
  useOutsideClick({
    refs: [brushSizeRef, brushButtonRef],
    action: () => setOpen(false),
  })

  return (
    <AnimatePresence>
      {state.selectedWindow && (
        <motion.div
          className={style.wrapper}
          id="toolbar"
          initial={{ opacity: 0, y: 40, x: `-50%` }}
          animate={{ opacity: 1, y: 0, x: `-50%` }}
          exit={{ opacity: 0, y: 40, x: `-50%` }}
        >
          <button>
            <PiPaintBrushThin
              size={20}
              onClick={() =>
                state.setState((draft) => {
                  draft.tool = `draw`
                })
              }
            />
          </button>
          <button>
            <div
              className={style.colorButton}
              style={{ backgroundColor: state.drawColor }}
            />
            <input
              className={style.colorInput}
              type="color"
              value={state.drawColor}
              onChange={(e) =>
                state.setState((draft) => {
                  draft.drawColor = e.target.value
                })
              }
            />
          </button>
          <button onClick={() => setOpen(!open)} ref={brushButtonRef}>
            <p>{state.drawSize}</p>
          </button>
          {open && (
            <section
              ref={brushSizeRef}
              className={joinClasses(
                `modal`,
                style.sliderWrapper,
                `dropdown-list`,
              )}
            >
              <Slider
                label="Brush Size"
                // className={style.slider}
                value={state.drawSize}
                max={100}
                min={1}
                onChange={(num) =>
                  state.setState((draft) => {
                    draft.drawSize = num
                  })
                }
              />
            </section>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
