import { List } from '@/components/List/List'
import { Space } from '@/components/Space/Space'
import { Window } from '@/components/Window/Window'
import * as x from '@stylexjs/stylex'

const styles = x.create({
  wrapper: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#171717',
    display: 'flex',
  },
})

export default function Home() {
  return (
    <main {...x.props(styles.wrapper)}>
      <List />
      <Space>
        <Window />
      </Space>
    </main>
  )
}
