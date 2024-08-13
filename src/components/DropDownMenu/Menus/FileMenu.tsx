import React from 'react'
import style from '../DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

import { IoSaveOutline } from 'react-icons/io5'
import { FiTrash } from 'react-icons/fi'
import { CiImport } from 'react-icons/ci'
import { CiExport } from 'react-icons/ci'
import { ImportModal } from './ImportModal'

export const FileMenu: React.FC = () => {
  const state = useStore([
    'setState',
    'importState',
    'exportState',
    'autoSaveEnabled',
    'promiseNotification',
    'showImportModal',
  ])

  return (
    <item className={style.item}>
      <Dropdown.Menu
        id="dropdown-file-button"
        SelectedOption={() => <p>File</p>}
        Options={[
          <Dropdown.Item
            key={'Import'}
            onClick={() => {
              state.setState((draft) => {
                draft.showImportModal = true
              })
            }}
            isChecked={false}
            Icon={() => <CiImport />}
            label1="Import"
          />,
          <Dropdown.Item
            key={'Export'}
            onClick={() => {
              state.promiseNotification(
                async () => {
                  state.exportState()
                },
                {
                  message: 'Exporting...',
                },
                {
                  onSuccess: {
                    update: {
                      message: 'Exported!',
                    },
                  },
                  onError: {
                    update: {
                      message: 'Failed to Export!',
                    },
                  },
                },
              )
            }}
            isChecked={false}
            Icon={() => <CiExport />}
            label1="Export"
          />,
          <Dropdown.Item
            key={'Clear All'}
            onClick={() =>
              state.setState((draft) => {
                draft.windows = []
                draft.items = []
                draft.connections = []
              })
            }
            isChecked={false}
            Icon={() => <FiTrash />}
            label1="Clear All"
          />,
        ]}
      />
      {state.showImportModal && <ImportModal />}
    </item>
  )
}
