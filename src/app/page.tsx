'use client'
import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import styles from './page.module.scss'
import { useStore } from '@/state/gen-state'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
// @ts-ignore
import FPSStats from 'react-fps-stats'
import { DropDownMenu } from '@/components/DropDownMenu/DropDownMenu'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as fal from '@fal-ai/serverless-client'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

fal.config({
  proxyUrl: '/api/fal/proxy',
})

export default function Home() {
  const state = useStore(['setMousePosition', 'showItemList'])

  // useScenario({ scenario: 'rotation' })
  return (
    <QueryClientProvider client={queryClient}>
      <wrapper
        className={styles.wrapper}
        onMouseMove={(e) => {
          state.setMousePosition({ x: e.clientX, y: e.clientY })
        }}
      >
        <DropDownMenu />
        <main>
          {/* <Nav /> */}
          {state.showItemList && <List />}
          <Space />
          <ContextMenu />
        </main>
        <FPSStats left={'auto'} right={0} />
        {/* <Debug /> */}
      </wrapper>
      <ToastContainer position="bottom-right" theme="dark" autoClose={2000} />
    </QueryClientProvider>
  )
}
