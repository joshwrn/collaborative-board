'use client'
import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import styles from './page.module.scss'
import { useAppStore } from '@/state/gen-state'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { useShallow } from 'zustand/react/shallow'
// @ts-ignore
import FPSStats from 'react-fps-stats'
import { DropDownMenu } from '@/components/DropDownMenu/DropDownMenu'
import { Debug } from '@/components/Debug/Debug'
import { useScenario } from '@/mock/scenarios'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as fal from '@fal-ai/serverless-client'

const queryClient = new QueryClient()

fal.config({
  proxyUrl: '/api/fal/proxy',
})

export default function Home() {
  const state = useAppStore(
    useShallow((state) => ({
      setMousePosition: state.setMousePosition,
      showItemList: state.showItemList,
    })),
  )
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
    </QueryClientProvider>
  )
}
