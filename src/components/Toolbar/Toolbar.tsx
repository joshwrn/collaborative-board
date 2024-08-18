import {
  autoUpdate,
  FloatingPortal,
  offset,
  useFloating,
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { PiPaintBrushThin } from 'react-icons/pi'

import { useStore } from '@/state/gen-state'
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
  const { refs, strategy, x, y } = useFloating({
    open,
    whileElementsMounted: autoUpdate,
    strategy: `absolute`,
    placement: `bottom`,
    middleware: [
      offset({
        mainAxis: -160,
        crossAxis: 0,
      }),
    ],
  })
  useOutsideClick({
    refs: [
      refs.reference as React.MutableRefObject<HTMLElement | null>,
      refs.floating,
    ],
    action: () => setOpen(false),
  })

  return (
    <AnimatePresence>
      {state.selectedWindow && (
        <motion.div
          className={style.wrapper}
          id="toolbar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
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
          <button ref={refs.setReference} onClick={() => setOpen(!open)}>
            {open && (
              <FloatingPortal>
                <section
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    left: refs.reference.current?.getBoundingClientRect().left,
                    top: y,
                    width: `fit-content`,
                  }}
                  className={joinClasses(style.slider, `dropdown-list`)}
                  onClick={() => setOpen(false)}
                >
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={state.drawSize}
                    onChange={(e) =>
                      state.setState((draft) => {
                        draft.drawSize = +e.target.value
                      })
                    }
                  />
                </section>
              </FloatingPortal>
            )}
            <p>{state.drawSize}</p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
