import React from 'react'
import style from './DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'
import { SPACE_ATTRS } from '@/state/space'
import { nanoid } from 'nanoid'
import { mockProgress } from '@/mock/mock-progress'

const WindowsMenu = () => {
  const state = useStore([
    'isSnappingOn',
    'showConnections',
    'setShowConnections',
    'setState',
    'createNewWindow',
  ])
  return (
    <item className={style.item}>
      <Dropdown.Menu
        SelectedOption={() => <p>Windows</p>}
        Options={[
          <Dropdown.Item
            key={'New Window'}
            onClick={() => {
              state.createNewWindow()
            }}
            label1={'New Window'}
            isChecked={false}
          />,
          <Dropdown.Item
            key={'Snapping'}
            onClick={() => {
              state.setState((draft) => {
                draft.isSnappingOn = !draft.isSnappingOn
              })
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

const SpaceMenu = () => {
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

const DevMenu = () => {
  const state = useStore([
    'debug_showZustandDevTools',
    'debug_showFps',
    'setState',
    'createAllMocks',
    'createOneMock',
    'clearMocks',
    'dev_allowWindowRotation',
  ])
  const [amount, setAmount] = React.useState(0)
  const defaultAmounts = [100, 26, 10, 3]
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-dev-button"
        SelectedOption={() => <p>Dev</p>}
        Options={[
          <Dropdown.Item
            key={'Allow Window Rotation'}
            onClick={() => {
              state.setState((draft) => {
                draft.dev_allowWindowRotation = !draft.dev_allowWindowRotation
              })
            }}
            label1={'Allow Window Rotation'}
            isChecked={state.dev_allowWindowRotation}
          />,
          <Dropdown.Item
            key={'Show Dev Tools'}
            onClick={() => {
              state.setState((draft) => {
                draft.debug_showZustandDevTools =
                  !draft.debug_showZustandDevTools
              })
            }}
            label1={'Show Dev Tools'}
            isChecked={state.debug_showZustandDevTools}
          />,
          <Dropdown.Item
            key={'Show FPS'}
            onClick={() => {
              state.setState((draft) => {
                draft.debug_showFps = !draft.debug_showFps
              })
            }}
            label1={'Show FPS'}
            isChecked={state.debug_showFps}
          />,
          <Dropdown.SubMenu
            key={'Mocks'}
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
          />,
        ]}
      />
    </item>
  )
}

const NotificationsMenu = () => {
  const state = useStore([
    'notifications',
    'setState',
    'setNotificationProgress',
    'promiseNotification',
  ])
  const createFakeNotification = async (
    e: React.MouseEvent,
    type: 'success' | 'error',
  ) => {
    e.stopPropagation()
    const id = nanoid()
    await state.promiseNotification(
      async () => {
        await mockProgress({
          shouldReject: type === 'error',
          onProgress: (progress) => {
            state.setNotificationProgress(id, progress)
          },
        })
      },
      {
        type: 'info',
        message: `${state.notifications.length} Testing ${type}...`,
        id: id,
        isLoading: true,
      },
      {
        onSuccess: {
          update: {
            message: `${state.notifications.length} Success!`,
          },
        },
      },
    )
  }
  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-notifications-button"
        SelectedOption={() => <p>Notifications</p>}
        Options={[
          <Dropdown.Item
            key={'Fake Success Notification'}
            onClick={(e) => createFakeNotification(e, 'success')}
            label1={'Fake Success Notification'}
            isChecked={false}
          />,
          <Dropdown.Item
            key={'Fake Error Notification'}
            onClick={(e) => createFakeNotification(e, 'error')}
            label1={'Fake Error Notification'}
            isChecked={false}
          />,
        ]}
      />
    </item>
  )
}

export const DropDownMenu = () => {
  const state = useStore(['setState'])
  return (
    <wrapper className={style.wrapper}>
      <SpaceMenu />
      <WindowsMenu />
      <DevMenu />
      <NotificationsMenu />
    </wrapper>
  )
}
