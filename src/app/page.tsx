'use client'
import * as fal from '@fal-ai/serverless-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Suspense } from 'react'
// @ts-ignore
import FPSStats from 'react-fps-stats'

import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { DropDownMenu } from '@/components/DropDownMenu/DropDownMenu'
import { ListGuard } from '@/components/ItemList/List/List'
import { Space } from '@/components/Space/Space'
import { StatsBar } from '@/components/StatsBar/StatsBar'
import { Toolbar } from '@/components/Toolbar/Toolbar'
import { useInitialScene } from '@/mock/useInitialScene'
import { useStore } from '@/state/gen-state'
import { Toaster } from '@/ui/Toast'

import styles from './page.module.scss'

const DevTools = React.lazy(async () => import(`@/components/Debug/DevTools`))

const queryClient = new QueryClient()

fal.config({
  proxyUrl: `/api/fal/proxy`,
})

export default function Home() {
  const state = useStore([
    `setMousePosition`,
    `debug_showZustandDevTools`,
    `debug_showFps`,
  ])

  useInitialScene()

  return (
    <QueryClientProvider client={queryClient}>
      <section
        className={styles.wrapper}
        onMouseMove={(e) => {
          state.setMousePosition({ x: e.clientX, y: e.clientY })
        }}
      >
        <header>
          <DropDownMenu />
          <StatsBar />
        </header>
        <main>
          <Space />
          <ListGuard />
          <Toolbar />
        </main>
        <ContextMenu />
        {state.debug_showFps && <FPSStats left={`auto`} right={0} />}
      </section>
      <Toaster />
      <Suspense
        fallback={
          <div
            style={{
              position: `absolute`,
              top: 0,
              left: 0,
              width: `100%`,
              height: `100%`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
              color: `white`,
              fontSize: `30px`,
              zIndex: 9999999,
            }}
          >
            Loading DevTools...
          </div>
        }
      >
        {state.debug_showZustandDevTools && <DevTools />}
      </Suspense>
      {state.debug_showFps && <FPSStats left={`auto`} right={0} />}
    </QueryClientProvider>
  )
}
