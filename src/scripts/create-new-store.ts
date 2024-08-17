import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const scriptDir = __dirname
const sourceFolder = path.join(scriptDir, `../`, `state`)
const outputFilePath = path.join(scriptDir, `../`, `state`, `gen-state.ts`)

// generate store

const baseImports = `import { create } from 'zustand'\nimport { useShallow } from 'zustand/react/shallow'`

const shallowAppStore = `export const useStore = <T extends keyof Store>(selected: T[]) => {
  return useFullStore(
    useShallow((state: Store) => {
      return selected.reduce((acc, key) => {
        acc[key] = state[key]
        return acc
      }, {} as Pick<Store, T>)
    }),
  )
}\n`

export const generateStores = () => {
  try {
    const files = fs.readdirSync(sourceFolder)
    const generatedCode = generateCodeFromFiles(files)

    fs.writeFileSync(outputFilePath, generatedCode)

    execSync(`npx prettier --write ${outputFilePath}`)

    console.log(`💅 State generated.`)
  } catch (error) {
    console.error(`😡 Error generating state:`, error)
  }
}

const formatFirstLetter = (
  inputString: string,
  format: `lower` | `upper`,
): string => {
  const firstLetter = inputString.charAt(0)
  const restOfString = inputString.slice(1)
  if (format === `lower`) {
    return firstLetter.toLowerCase() + restOfString
  }
  return firstLetter.toUpperCase() + restOfString
}

const lowerCaseFirstLetter = (inputString: string): string =>
  formatFirstLetter(inputString, `lower`)

const capitalizeFirstLetter = (inputString: string): string =>
  formatFirstLetter(inputString, `upper`)

const generateCodeFromFiles = (files: string[]): string => {
  const imports: string[] = []
  const storesArr: string[] = []
  for (const file of files) {
    if (file.includes(`state`)) {
      continue
    }
    const filePath = path.join(sourceFolder, file)
    const fileContent = fs.readFileSync(filePath, `utf-8`)
    const stores = fileContent.match(/export const \w+Store/g)
    const storeNames = stores?.map((store: string) =>
      lowerCaseFirstLetter(
        store.replace(`export const `, ``).replace(`Store`, ``),
      ),
    )
    const uniques = [...new Set(storeNames)] as string[]

    const importLines = uniques.map(
      (store: string) =>
        `import { ${store}Store, ${capitalizeFirstLetter(
          store,
        )}Store } from './${file.replace(`.ts`, ``)}'`,
    )
    imports.push(...importLines)
    storesArr.push(...uniques)
  }

  if (storesArr.length === 0) {
    return ``
  }

  let appStoreType = `export type Store = `
  for (let i = 0; i < storesArr.length; i++) {
    const store = storesArr[i]
    const newLine = `${capitalizeFirstLetter(store)}Store`
    if (i === storesArr.length - 1) {
      appStoreType += `${newLine} \n`
      break
    }
    appStoreType += `${newLine} &`
  }

  let appStore = `export const useFullStore = create<Store>((set, get, store) => {
    return {`

  for (let i = 0; i < storesArr.length; i++) {
    const store = storesArr[i]
    const newLine = `...${store}Store(set, get, store)`
    if (i === storesArr.length - 1) {
      appStore += `${newLine}\n }})`
      break
    }
    appStore += `${newLine},\n`
  }

  return [
    baseImports,
    ...imports,
    [``],
    appStoreType,
    appStore,
    shallowAppStore,
  ].join(`\n`)
}

// create new store

const outputFolder = path.join(scriptDir, `../`, `state`)

const generateCode = (storeName: string) => {
  const storeNameCapitalized =
    storeName.charAt(0).toUpperCase() + storeName.slice(1)

  const imports = `import { AppStateCreator } from './state'\n`

  const storeType = `export type ${storeNameCapitalized}Store = {\n}\n`

  const store = `export const ${storeName}Store: AppStateCreator<${storeNameCapitalized}Store> = (set, get) => ({\n})`

  return [imports, storeType, store].join(`\n`)
}

const createNewStore = (storeName: string) => {
  if (!storeName) {
    console.error(`Please provide a store name.`)
    return
  }
  try {
    const outputFile = path.join(outputFolder, `${storeName}.ts`)
    const outputFileContent = generateCode(storeName)
    fs.writeFileSync(outputFile, outputFileContent)
    execSync(`npx prettier --write ${outputFile}`)
    console.log(`💅 ${storeName} store generated.`)
  } catch (error) {
    console.error(`😡 Error creating store:`, error)
  }
}

// example: npm run create-new-store -- mockStore
const args = process.argv.slice(2)
const [message] = args

createNewStore(message)
generateStores()
