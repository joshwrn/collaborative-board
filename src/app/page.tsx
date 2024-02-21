'use client'
import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import styles from './page.module.scss'
import { Nav } from '@/components/Nav/Nav'
import { useAppStore } from '@/state/gen-state'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { useShallow } from 'zustand/react/shallow'
// @ts-ignore
import FPSStats from 'react-fps-stats'
import { DropDownMenu } from '@/components/DropDownMenu/DropDownMenu'

export default function Home() {
  const state = useAppStore(
    useShallow((state) => ({
      setMousePosition: state.setMousePosition,
    })),
  )
  return (
    <wrapper
      className={styles.wrapper}
      onMouseMove={(e) => {
        state.setMousePosition({ x: e.clientX, y: e.clientY })
      }}
    >
      <DropDownMenu />
      <main>
        {/* <Nav /> */}
        <List />
        <Space />
        <ContextMenu />
      </main>
      <FPSStats left={'auto'} right={0} />
    </wrapper>
  )
}
