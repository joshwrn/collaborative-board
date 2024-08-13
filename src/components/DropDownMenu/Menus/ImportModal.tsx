import React from 'react'
import style from './ImportModal.module.scss'

import { CiImport } from 'react-icons/ci'
import { IoCheckmarkCircleOutline as CheckIcon } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'

export const ImportModal: React.FC = () => {
  const state = useStore(['setState', 'promiseNotification', 'importState'])
  const [file, setFile] = React.useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleImport = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    state.promiseNotification(
      () => {
        state.importState(file)
      },
      {
        message: 'Importing...',
      },
      {
        onSuccess: {
          update: {
            message: 'Imported!',
          },
          run: () => {
            state.setState((draft) => {
              draft.showImportModal = false
            })
          },
        },
        onError: {
          update: {
            message: 'Failed to Import!',
          },
        },
      },
    )
  }

  return (
    <section className={style.importModal}>
      <div
        className={style.backdrop}
        onClick={() => {
          state.setState((draft) => {
            draft.showImportModal = false
          })
        }}
      />
      <section className={style.modal}>
        <form onSubmit={handleImport}>
          <button
            className={style.chooseFileButton}
            data-role={file ? 'uploaded' : 'not-uploaded'}
            type="button"
          >
            <div className={style.iconContainer}>
              {file ? <CheckIcon size={40} /> : <CiImport size={40} />}
            </div>
            <div className={style.textContainer}>
              {file ? <p>Ready to Import</p> : <p>Choose a File</p>}
            </div>
            <input type="file" onChange={handleFileChange} />
          </button>
          <button className={style.importButton} disabled={!file} type="submit">
            Import
          </button>
        </form>
      </section>
    </section>
  )
}
