'use client'
import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import styles from './page.module.scss'
import { Nav } from '@/components/Nav/Nav'
import { useAppStore } from '@/state/state'

export default function Home() {
  const { user } = useAppStore((state) => ({ user: state.user }))
  return (
    <main className={styles.wrapper}>
      <>
        <Space />

        <List />
        <Nav />
      </>
    </main>
  )
}
