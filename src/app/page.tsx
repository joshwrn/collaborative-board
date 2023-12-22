import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import { Window } from '@/components/Window/Window'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <List />
      <Space>
        <Window />
      </Space>
    </main>
  )
}
