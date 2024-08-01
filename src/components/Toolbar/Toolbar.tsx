import React from 'react'
import style from './Toolbar.module.scss'
import { useStore } from '@/state/gen-state'
import { PiPaintBrushThin } from 'react-icons/pi'
import {
  FloatingPortal,
  autoUpdate,
  offset,
  useFloating,
} from '@floating-ui/react'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { joinClasses } from '@/utils/joinClasses'

export const Toolbar: React.FC = () => {
  const state = useStore([
    'drawColor',
    'setDrawColor',
    'tool',
    'setTool',
    'drawSize',
    'setDrawSize',
    'canvasIsFocused',
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

  if (!state.canvasIsFocused) {
    return null
  }

  return (
    <div className={style.wrapper} id="toolbar">
      <button>
        <PiPaintBrushThin size={20} onClick={() => state.setTool('draw')} />
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
          onChange={(e) => state.setDrawColor(e.target.value)}
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
                width: 'fit-content',
                // refs.reference.current?.getBoundingClientRect().width ?? 0,
              }}
              className={joinClasses(style.slider, 'dropdown-list')}
              onClick={() => setOpen(false)}
            >
              <input
                type="range"
                min="1"
                max="100"
                value={state.drawSize}
                onChange={(e) => state.setDrawSize(+e.target.value)}
              />
            </section>
          </FloatingPortal>
        )}
        <p>{state.drawSize}</p>
      </button>
    </div>
  )
}
