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
import { Store, StoreContext, useStore } from '@/state-signia/store'

const Inner = () => {
  const state = useStore()

  return (
    <wrapper
      className={styles.wrapper}
      onMouseMove={(e) => {
        state.peripheral.setMousePosition({ x: e.clientX, y: e.clientY })
      }}
    >
      <p>{state.peripheral.mousePosition.x}</p>
      <DropDownMenu />
      <main>
        {/* <Nav /> */}
        <List />
        <Space />
        <ContextMenu />
      </main>
      <FPSStats left={'auto'} right={0} />
      {/* <Debug /> */}
    </wrapper>
  )
}

export default function Home() {
  const doc = Store.useNewStore()
  return (
    <StoreContext.Provider value={doc}>
      <Inner />
    </StoreContext.Provider>
  )
}
