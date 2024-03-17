import React from 'react'
import style from './DropDownMenu.module.scss'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'

const MockItem = () => {
  const [open, setOpen] = React.useState(false)
  const [ref1, ref2] = useOutsideClick<HTMLButtonElement, HTMLUListElement>({
    action: () => {
      setOpen(false)
    },
  })
  const state = useAppStore(
    useShallow((state) => ({
      createMocks: state.createAllMocks,
      clear: state.clearMocks,
    })),
  )
  return (
    <item className={style.item}>
      <button
        ref={ref1}
        onClick={() => {
          setOpen(!open)
        }}
      >
        Mocks
      </button>
      {open && (
        <ul className={style.submenu} ref={ref2}>
          <li
            onClick={() => {
              state.createMocks(100)
              setOpen(false)
            }}
          >
            Create (100)
          </li>
          <li
            onClick={() => {
              state.createMocks(26)
              setOpen(false)
            }}
          >
            Create (26)
          </li>
          <li
            onClick={() => {
              state.createMocks(10)
              setOpen(false)
            }}
          >
            Create (10)
          </li>
          <li
            onClick={() => {
              state.clear()
              setOpen(false)
            }}
          >
            Clear
          </li>
        </ul>
      )}
    </item>
  )
}

export const DropDownMenu = () => {
  return (
    <wrapper className={style.wrapper}>
      <MockItem />
    </wrapper>
  )
}
