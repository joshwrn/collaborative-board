import { AnimatePresence } from 'framer-motion'
import React from 'react'

import { useStore } from '@/state/gen-state'
import Modal from '@/ui/TopBarModal'

import styles from './TutorialModal.module.scss'

const TutorialModal: React.FC = () => {
  const state = useStore([`setState`])
  return (
    <Modal.Container
      onClose={() =>
        state.setState((draft) => {
          draft.showTutorialModal = false
        })
      }
    >
      <Modal.Header title="Tutorial"></Modal.Header>
      <Modal.Content className={styles.content}>
        <section>
          <h2>Generate From New Sketch</h2>
          <section>
            <h3>Creating a Window</h3>
            <p>{`To create a new window, right click on the background and select "New Window"`}</p>
          </section>
          <section>
            <h3>Drawing</h3>
            <p>{`Click and drag across the canvas inside a window to draw`}</p>
          </section>
          <section>
            <h3>Generating</h3>
            <p>{`Click the "Generate" button to generate an image from the current window`}</p>
          </section>
        </section>
        <section>
          <h2>Navigation</h2>
          <section>
            <h3>Zooming</h3>
            <p>
              <span>1. Mouse:</span>
              {` Zoom in and out by scrolling with your mouse wheel + holding ctrl/cmd`}
            </p>
            <p>
              <span>2. Track pad:</span>
              {` Pinch to zoom`}
            </p>
          </section>
          <section>
            <h3>Panning</h3>
            <p>
              <span>1. Mouse:</span>
              {` Hold middle mouse button and drag to pan`}
            </p>
            <p>
              <span>2. Track pad:</span>
              {` Pan by swiping with two fingers`}
            </p>
          </section>
        </section>
        <section>
          <h2>Saving</h2>
          <section>
            <h3>Exporting</h3>
            <p>{`To export your current state, click the "File" button in the top bar, then click "Export".`}</p>
            <p>{`The exported file will be saved to your downloads folder.`}</p>
          </section>
          <section>
            <h3>Importing</h3>
            <p>{`To import a saved state, click the "File" button in the top bar, then click "Import".`}</p>
            <p>{`The imported file will be loaded into your current state.`}</p>
          </section>
        </section>
      </Modal.Content>
    </Modal.Container>
  )
}

export const TutorialModalGuard = () => {
  const state = useStore([`showTutorialModal`])
  return (
    <AnimatePresence>
      {state.showTutorialModal && <TutorialModal />}
    </AnimatePresence>
  )
}
