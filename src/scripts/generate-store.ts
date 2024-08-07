import path from 'path'
import chokidar from 'chokidar'
import { fileURLToPath } from 'url'
import { generateStores } from './create-new-store'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const scriptDir = __dirname
const sourceFolder = path.join(scriptDir, '../', 'state')

const watchFolder = () => {
  const watcher = chokidar.watch(sourceFolder, { ignoreInitial: true })
  console.log('👀 Watching state folder for changes...')
  watcher.on('all', (event: any, filePath: string) => {
    if (filePath.includes('gen-state')) {
      return
    }
    console.log(`🤓 File ${filePath} changed. Regenerating state...`)
    generateStores()
  })
}

const shouldWatch = process.argv.includes('--watch')

generateStores()

if (shouldWatch) {
  watchFolder()
}
