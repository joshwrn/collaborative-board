'use client'
import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import styles from './page.module.scss'
import { Nav } from '@/components/Nav/Nav'
import { useAppStore } from '@/state/state'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'

export default function Home() {
  const state = useAppStore((state) => ({
    setMousePosition: state.setMousePosition,
  }))
  return (
    <main
      className={styles.wrapper}
      onMouseMove={(e) => {
        state.setMousePosition({ x: e.clientX, y: e.clientY })
      }}
    >
      <>
        <Space />

        <List />
        <Nav />
        <ContextMenu />
      </>
    </main>
  )
}
