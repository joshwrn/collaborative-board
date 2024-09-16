import React from 'react'
import { FiTrash } from 'react-icons/fi'
import { TfiExport, TfiImport } from 'react-icons/tfi'

import { useZ } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import style from '../DropDownMenu.module.scss'
import { ImportModalGuard } from '../Modals/ImportModal'

export const FileMenu: React.FC = () => {
  const state = useZ([
    `setState`,
    `importState`,
    `exportState`,
    `promiseNotification`,
    `showImportModal`,
  ])

  return (
    <div className={style.item}>
      <Dropdown.Menu
        id="dropdown-file-button"
        SelectedOption={() => <p>File</p>}
        Options={[
          <Dropdown.Item
            key={`Import`}
            onClick={() => {
              state.setState((draft) => {
                draft.showImportModal = true
              })
            }}
            isChecked={false}
            Icon={() => <TfiImport size={17} fill="var(--white)" />}
            label1="Import"
          />,
          <Dropdown.Item
            key={`Export`}
            onClick={async () => {
              await state.promiseNotification(
                () => {
                  state.exportState()
                },
                {
                  message: `Exporting...`,
                },
                {
                  onSuccess: {
                    update: {
                      message: `Exported!`,
                    },
                  },
                  onError: {
                    update: {
                      message: `Failed to Export!`,
                    },
                  },
                },
              )
            }}
            isChecked={false}
            Icon={() => <TfiExport size={16} fill="var(--white)" />}
            label1="Export"
          />,
          <Dropdown.Item
            key={`Clear All`}
            onClick={() =>
              state.setState((draft) => {
                draft.windows = []
                draft.items = []
                draft.itemConnections = []
              })
            }
            isChecked={false}
            Icon={() => <FiTrash stroke="var(--white)" />}
            label1="Clear All"
          />,
        ]}
      />
      <ImportModalGuard />
    </div>
  )
}
