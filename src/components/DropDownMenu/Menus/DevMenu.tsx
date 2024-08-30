import { nanoid } from 'nanoid'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { mockProgress } from '@/mock/mock-progress'
import { loadScenario } from '@/mock/scenarios'
import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'
import { IS_DEV } from '@/utils/is-dev'

import style from '../DropDownMenu.module.scss'

export const DevMenu = () => {
  const state = useStore([
    `debug_showZustandDevTools`,
    `debug_showFps`,
    `setState`,
    `dev_allowWindowRotation`,
  ])
  const searchParams = useSearchParams()
  const dev = searchParams.get(`dev`)
  if (dev !== `true` && !IS_DEV) {
    return null
  }
  return (
    <div className={style.item}>
      <Dropdown.Menu
        id="dropdown-dev-button"
        SelectedOption={() => <p>Dev</p>}
        Options={[
          <Dropdown.Item
            key={`Allow Window Rotation`}
            onClick={() => {
              state.setState((draft) => {
                draft.dev_allowWindowRotation = !draft.dev_allowWindowRotation
              })
            }}
            label1={`Allow Window Rotation`}
            isChecked={state.dev_allowWindowRotation}
          />,
          <Dropdown.Item
            key={`Show Dev Tools`}
            onClick={() => {
              state.setState((draft) => {
                draft.debug_showZustandDevTools =
                  !draft.debug_showZustandDevTools
              })
            }}
            label1={`Show Dev Tools`}
            isChecked={state.debug_showZustandDevTools}
          />,
          <Dropdown.Item
            key={`Show FPS`}
            onClick={() => {
              state.setState((draft) => {
                draft.debug_showFps = !draft.debug_showFps
              })
            }}
            label1={`Show FPS`}
            isChecked={state.debug_showFps}
          />,
          <ScenariosSubMenu key={`Scenarios`} />,
          <MocksSubMenu key={`Mocks`} />,
          <NotificationsSubMenu key={`Notifications`} />,
        ]}
      />
    </div>
  )
}

const MocksSubMenu = () => {
  const state = useStore([
    `createAllMocks`,
    `createOneMock`,
    `clearMocks`,
    `setState`,
  ])
  const [amount, setAmount] = React.useState(0)
  const defaultAmounts = [100, 26, 10, 3]
  return (
    <Dropdown.SubMenu
      key={`Mocks`}
      SelectedOption={() => <p>Mocks</p>}
      id="dropdown-create-mocks-button"
      Options={[
        ...defaultAmounts.map((num) => (
          <Dropdown.Item
            key={`Create (${num})`}
            onClick={() => {
              state.createAllMocks(num)
            }}
            label1={`Create (${num})`}
            isChecked={false}
          />
        )),
        <Dropdown.Item
          key={`Create One`}
          onClick={() => {
            state.createOneMock()
          }}
          label1={`Create (1)`}
          isChecked={false}
          id="dropdown-create-mocks-1"
        />,
        <Dropdown.Item
          key={`Create (Custom)`}
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
              value={amount === 0 ? `` : amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <p>)</p>
          </form>
        </Dropdown.Item>,
        <Dropdown.Item
          key={`Clear`}
          onClick={() => {
            state.clearMocks()
          }}
          label1={`Clear`}
          isChecked={false}
        />,
      ]}
    />
  )
}

const NotificationsSubMenu = () => {
  const state = useStore([
    `notifications`,
    `setState`,
    `setNotificationProgress`,
    `promiseNotification`,
  ])
  const createFakeNotification = async (
    e: React.MouseEvent,
    type: `error` | `success`,
  ) => {
    e.stopPropagation()
    const id = nanoid()
    await state.promiseNotification(
      async () => {
        await mockProgress({
          shouldReject: type === `error`,
          onProgress: (progress) => {
            state.setNotificationProgress(id, progress)
          },
        })
      },
      {
        type: `info`,
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
    <Dropdown.SubMenu
      id="dropdown-notifications-button"
      SelectedOption={() => <p>Notifications</p>}
      Options={[
        <Dropdown.Item
          key={`Fake Success Notification`}
          onClick={async (e) => createFakeNotification(e, `success`)}
          label1={`Fake Success Notification`}
          isChecked={false}
        />,
        <Dropdown.Item
          key={`Fake Error Notification`}
          onClick={async (e) => createFakeNotification(e, `error`)}
          label1={`Fake Error Notification`}
          isChecked={false}
        />,
      ]}
    />
  )
}

const ScenariosSubMenu = () => {
  const scenarios = [`data-1`, `data-2`]
  return (
    <Dropdown.SubMenu
      id="dropdown-scenarios-button"
      SelectedOption={() => <p>Scenarios</p>}
      Options={[
        ...scenarios.map((scenario) => (
          <Dropdown.Item
            key={scenario}
            onClick={async () => {
              await loadScenario(scenario)
            }}
            label1={scenario}
            isChecked={false}
          />
        )),
      ]}
    />
  )
}
