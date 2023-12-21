import { Window } from '@/components/Window/Window'
import * as x from '@stylexjs/stylex'

const styles = x.create({
  wrapper: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#171717',
  },
})

export default function Home() {
  return (
    <main {...x.props(styles.wrapper)}>
      <Window />
    </main>
  )
}
