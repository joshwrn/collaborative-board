import React from 'react'
import style from './DropDownMenu.module.scss'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '@/state-signia/store'

const MockItem = () => {
  const [open, setOpen] = React.useState(false)
  const [ref1, ref2] = useOutsideClick<HTMLButtonElement, HTMLUListElement>({
    action: () => {
      setOpen(false)
    },
  })

  const [amount, setAmount] = React.useState(0)

  const state = useStore()

  return (
    <item className={style.item}>
      <button
        id={'dropdown-create-mocks-button'}
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
              state.mocks.createMocks(100)
              setOpen(false)
            }}
          >
            Create (100)
          </li>
          <li
            onClick={() => {
              state.mocks.createMocks(26)
              setOpen(false)
            }}
          >
            Create (26)
          </li>
          <li
            id={'dropdown-create-mocks-10'}
            onClick={() => {
              state.mocks.createMocks(10)
              setOpen(false)
            }}
          >
            Create (10)
          </li>
          <li
            id={'dropdown-create-mocks-1'}
            onClick={() => {
              // state.mocks.createOneMock()
              setOpen(false)
            }}
          >
            Create (1)
          </li>
          <li>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                state.mocks.createMocks(amount)
                setOpen(false)
              }}
              onClick={() => {
                state.mocks.createMocks(amount)
                setOpen(false)
              }}
              className={style.customCreate}
            >
              Create (
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                placeholder="Custom"
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              )
            </form>
          </li>
          <li
            onClick={() => {
              state.mocks.clear()
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
