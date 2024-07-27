import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const scriptDir = __dirname
const outputFolder = path.join(scriptDir, '../', 'state')

const generateCode = (storeName: string) => {
  const storeNameCapitalized =
    storeName.charAt(0).toUpperCase() + storeName.slice(1)

  const imports = `import { AppStateCreator } from './state'\n`

  const storeType = `export type ${storeNameCapitalized}Store = {\n}\n`

  const store = `export const ${storeName}Store: AppStateCreator<${storeNameCapitalized}Store> = (set, get) => ({\n})`

  return [imports, storeType, store].join('\n')
}

const createNewStore = (storeName: string) => {
  if (!storeName) {
    console.error('Please provide a store name.')
    return
  }
  try {
    const outputFile = path.join(outputFolder, `${storeName}.ts`)
    const outputFileContent = generateCode(storeName)
    fs.writeFileSync(outputFile, outputFileContent)
    execSync(`npx prettier --write ${outputFile}`)
    console.log(`💅 ${storeName} store generated.`)
  } catch (error) {
    console.error('😡 Error creating store:', error)
  }
}

const args = process.argv.slice(2)
const messageArg = args.findIndex((arg) => arg.startsWith('--message'))
const message = args[messageArg + 1]

createNewStore(message)
