import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import chokidar from 'chokidar'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const scriptDir = __dirname
const sourceFolder = path.join(scriptDir, '../', 'state')
const outputFile = path.join(scriptDir, '../', 'state', 'gen-state.ts')

const baseImports = `import { create } from 'zustand'\nimport { useShallow } from 'zustand/react/shallow'`

const shallowAppStore = `export const useShallowAppStore = (selected: (keyof AppStore)[]) => {
  return useAppStore(
    useShallow((state) => {
      return {
        ...selected.reduce((acc, key) => {
          // @ts-expect-error
          acc[key as keyof AppStore] = state[key]
          return acc
        }, {} as { [key in keyof AppStore]: AppStore[key] }),
      }
    }),
  )
}`

export const generateStores = () => {
  try {
    const files = fs.readdirSync(sourceFolder)
    const generatedCode = generateCodeFromFiles(files)

    fs.writeFileSync(outputFile, generatedCode)

    execSync(`npx prettier --write ${outputFile}`)

    console.log(`💅 State generated.`)
  } catch (error) {
    console.error('😡 Error generating state:', error)
  }
}

const formatFirstLetter = (
  inputString: string,
  format: 'lower' | 'upper',
): string => {
  const firstLetter = inputString.charAt(0)
  const restOfString = inputString.slice(1)
  if (format === 'lower') {
    return firstLetter.toLowerCase() + restOfString
  }
  return firstLetter.toUpperCase() + restOfString
}

const lowerCaseFirstLetter = (inputString: string): string =>
  formatFirstLetter(inputString, 'lower')

const capitalizeFirstLetter = (inputString: string): string =>
  formatFirstLetter(inputString, 'upper')

const generateCodeFromFiles = (files: string[]): string => {
  const imports: string[] = []
  const storesArr: string[] = []
  for (const file of files) {
    if (file.includes('state')) {
      continue
    }
    const filePath = path.join(sourceFolder, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const stores = fileContent.match(/export const \w+Store/g)
    const storeNames = stores?.map((store: string) =>
      lowerCaseFirstLetter(
        store.replace('export const ', '').replace('Store', ''),
      ),
    )
    const uniques = [...new Set(storeNames)] as string[]

    const importLines = uniques.map(
      (store: string) =>
        `import { ${store}Store, ${capitalizeFirstLetter(
          store,
        )}Store } from './${file.replace('.ts', '')}'`,
    )
    imports.push(...importLines)
    storesArr.push(...uniques)
  }

  if (storesArr.length === 0) {
    return ''
  }

  let appStoreType = `export type AppStore = `
  for (let i = 0; i < storesArr.length; i++) {
    const store = storesArr[i]
    const newLine = `${capitalizeFirstLetter(store)}Store`
    if (i === storesArr.length - 1) {
      appStoreType += `${newLine} \n`
      break
    }
    appStoreType += `${newLine} &`
  }

  let appStore = `export const useAppStore = create<AppStore>((...operators) => {
    return {`

  for (let i = 0; i < storesArr.length; i++) {
    const store = storesArr[i]
    const newLine = `...${store}Store(...operators)`
    if (i === storesArr.length - 1) {
      appStore += `${newLine}\n }})`
      break
    }
    appStore += `${newLine},\n`
  }

  return [
    baseImports,
    ...imports,
    [''],
    appStoreType,
    appStore,
    shallowAppStore,
  ].join('\n')
}

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
