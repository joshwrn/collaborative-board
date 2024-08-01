import React from 'react'
import style from './DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'
import { SPACE_ATTRS } from '@/state/space'

const MockItem = () => {
  const state = useStore(['createAllMocks', 'createOneMock', 'clearMocks'])
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
                state.createAllMocks(amount)
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
              state.createAllMocks(amount)
            }}
            isChecked={false}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                state.createAllMocks(amount)
              }}
              onClick={() => {
                state.createAllMocks(amount)
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
              state.clearMocks()
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
  const state = useStore([
    'isSnappingOn',
    'setIsSnappingOn',
    'showConnections',
    'setShowConnections',
  ])
  return (
    <item className={style.item}>
      <Dropdown.Menu
        SelectedOption={() => <p>Windows</p>}
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
  const state = useStore([
    'zoom',
    'setZoom',
    'setPan',
    'setState',
    'showItemList',
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

export const DropDownMenu = () => {
  return (
    <wrapper className={style.wrapper}>
      <MockItem />
      <SnappingItem />
      <SpaceItem />
    </wrapper>
  )
}
