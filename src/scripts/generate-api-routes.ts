import fs from 'fs/promises'
import path from 'path'
import chokidar from 'chokidar'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const scriptDir1 = __dirname
const directoryPath = path.join(scriptDir1, '../', 'app', 'api')
const outputFile = path.join(__dirname, '../', 'server', 'routes.ts')

const TYPE = 'export type ApiRouteUrl = (typeof API_ROUTES)[number]'

async function readDirectories() {
  try {
    const folders: string[] = []
    const files = await fs.readdir(directoryPath, { withFileTypes: true })
    files.forEach((file: any) => {
      if (file.isDirectory()) {
        console.log('📁 Directory:', file.name)
        folders.push(file.name)
      }
    })
    return folders
  } catch (err) {
    console.error('Error reading routes directory:', err)
  }
}

const writeDirectories = async () => {
  try {
    const folders = await readDirectories()
    if (!folders) {
      return
    }
    let str = `export const API_ROUTES = [\n`
    for (const folder of folders) {
      str += `  '${folder}',\n`
    }
    str += `] as const\n ${TYPE}`
    await fs.writeFile(outputFile, str)
    console.log(`💅 API routes generated.`)
  } catch (error) {
    console.error('😡 Error generating API routes:', error)
  }
}

const watchFolder = () => {
  const watcher = chokidar.watch(directoryPath, { ignoreInitial: true })
  console.log('👀 Watching API routes folder for changes...')
  watcher.on('all', (event: any, filePath: string) => {
    console.log(`🤓 File ${filePath} changed. Regenerating API routes...`)
    writeDirectories()
  })
}

const shouldWatch = process.argv.includes('--watch')

writeDirectories()

if (shouldWatch) {
  watchFolder()
}

// export {}
