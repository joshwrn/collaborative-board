'use client'
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
import React, { Suspense } from 'react'
import { List } from '@/components/ItemList/List/List'
const DevTools = React.lazy(() => import('@/components/Debug/DevTools'))

const queryClient = new QueryClient()

fal.config({
  proxyUrl: '/api/fal/proxy',
})

export default function Home() {
  const state = useStore([
    'setMousePosition',
    'showItemList',
    'debug_showZustandDevTools',
    'debug_showFps',
  ])

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
          <Space />
          <ContextMenu />
          {state.showItemList && <List />}
        </main>
        {state.debug_showFps && <FPSStats left={'auto'} right={0} />}
      </wrapper>
      <ToastContainer position="bottom-right" theme="dark" autoClose={2000} />
      <Suspense
        fallback={
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '30px',
              zIndex: 9999999,
            }}
          >
            Loading DevTools...
          </div>
        }
      >
        {state.debug_showZustandDevTools && <DevTools />}
      </Suspense>
      {state.debug_showFps && <FPSStats left={'auto'} right={0} />}
    </QueryClientProvider>
  )
}
