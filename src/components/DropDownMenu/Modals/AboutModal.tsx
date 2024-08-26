import { AnimatePresence } from 'framer-motion'
import React from 'react'

import { useStore } from '@/state/gen-state'
import Modal from '@/ui/TopBarModal'

import styles from './AboutModal.module.scss'

const AboutModal: React.FC = () => {
  const state = useStore([`setState`])
  return (
    <Modal.Container
      onClose={() =>
        state.setState((draft) => {
          draft.showAboutModal = false
        })
      }
    >
      <Modal.Header title="About"></Modal.Header>
      <Modal.Content className={styles.content}>
        <p>
          The initial purpose of this app was to mess around with an infinite
          canvas and resizable windows. It eventually evolved into a fun project
          I used to learn about AI and generative art.
        </p>
        <p>
          I do not expect this app to be used for anything other than fun and
          learning. It is not intended to be used for commercial purposes.
        </p>
        <p>Created by Josh Warren, 2024.</p>
        <p>
          <a href="https://joshw.io" target="_blank" rel="noreferrer">
            Portfolio
          </a>
        </p>
      </Modal.Content>
    </Modal.Container>
  )
}

export const AboutModalGuard = () => {
  const state = useStore([`showAboutModal`])
  return (
    <AnimatePresence>{state.showAboutModal && <AboutModal />}</AnimatePresence>
  )
}
