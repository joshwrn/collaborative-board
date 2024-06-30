import React from 'react'
import style from './DropDownMenu.module.scss'

import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import Dropdown from '@/ui/Dropdown'
import { SPACE_ATTRS } from '@/state/space'

const MockItem = () => {
  const state = useAppStore(
    useShallow((state) => ({
      createMocks: state.createAllMocks,
      createOneMock: state.createOneMock,
      clear: state.clearMocks,
    })),
  )
  const [amount, setAmount] = React.useState(0)
  const defaultAmounts = [100, 26, 10, 3]
  return (
    <item className={style.item}>
      <Dropdown.Menu
        SelectedOption={() => <p>Mocks</p>}
        id="dropdown-create-mocks-button"
        Options={[
          ...defaultAmounts.map((amount) => (
            <Dropdown.Item
              key={`Create (${amount})`}
              onClick={() => {
                state.createMocks(amount)
              }}
              label1={`Create (${amount})`}
              isChecked={false}
            />
          )),
          <Dropdown.Item
            key={'Create One'}
            onClick={() => {
              state.createOneMock()
            }}
            label1={'Create (1)'}
            isChecked={false}
            id="dropdown-create-mocks-1"
          />,
          <Dropdown.Item
            key={'Create (Custom)'}
            onClick={() => {
              state.createMocks(amount)
            }}
            isChecked={false}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                state.createMocks(amount)
              }}
              onClick={() => {
                state.createMocks(amount)
              }}
              className={style.customCreate}
            >
              <p>Create (</p>
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                placeholder="Custom"
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <p>)</p>
            </form>
          </Dropdown.Item>,
          <Dropdown.Item
            key={'Clear'}
            onClick={() => {
              state.clear()
            }}
            label1={'Clear'}
            isChecked={false}
          />,
        ]}
      />
    </item>
  )
}

const SnappingItem = () => {
  const state = useAppStore(
    useShallow((state) => ({
      isSnappingOn: state.isSnappingOn,
      setIsSnappingOn: state.setIsSnappingOn,
      showConnections: state.showConnections,
      setShowConnections: state.setShowConnections,
    })),
  )
  return (
    <item className={style.item}>
      <Dropdown.Menu
        SelectedOption={() => <p>Snapping</p>}
        Options={[
          <Dropdown.Item
            key={'Snapping'}
            onClick={() => {
              state.setIsSnappingOn(!state.isSnappingOn)
            }}
            label1={'Snapping'}
            isChecked={state.isSnappingOn}
          />,
          <Dropdown.Item
            key={'Show Connections'}
            onClick={() => {
              state.setShowConnections(!state.showConnections)
            }}
            label1={'Show Connections'}
            isChecked={state.showConnections}
          />,
        ]}
      />
    </item>
  )
}

const SpaceItem = () => {
  const state = useAppStore(
    useShallow((state) => ({
      zoom: state.zoom,
      setZoom: state.setZoom,
    })),
  )
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-space-button"
        SelectedOption={() => <p>Space</p>}
        Options={[
          <div
            className={style.zoom}
            key={'Zoom'}
            onClick={(e) => e.stopPropagation()}
          >
            <p>Zoom</p>
            <section>
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
          </div>,
        ]}
      />
    </item>
  )
}

export const DropDownMenu = () => {
  return (
    <wrapper className={style.wrapper}>
      <MockItem />
      <SnappingItem />
      <SpaceItem />
    </wrapper>
  )
}
