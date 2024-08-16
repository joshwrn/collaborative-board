import { AppStateCreator } from './state'

export type UiStore = {
  showThemeModal: boolean
  hue: number
  saturation: string
  lightness: string
  updateTheme: (update: Partial<HSL>) => void
  resetTheme: () => void
}

export type HSL = {
  hue: number
  saturation: string
  lightness: string
}

const DEFAULT_THEME: HSL = {
  hue: 230,
  saturation: '-8%',
  lightness: '1%',
}

const setVariable = (name: string, value: string | number) => {
  document.documentElement.style.setProperty(name, `${value}`)
}

export const uiStore: AppStateCreator<UiStore> = (set, get) => ({
  showThemeModal: false,
  hue: DEFAULT_THEME.hue,
  saturation: DEFAULT_THEME.saturation,
  lightness: DEFAULT_THEME.lightness,
  resetTheme: () => {
    const state = get()
    for (const [key, value] of Object.entries(DEFAULT_THEME)) {
      setVariable(`--${key}`, value)
    }
    state.setState((draft) => {
      for (const [key, value] of Object.entries(DEFAULT_THEME)) {
        // @ts-expect-error - is the key
        draft[key] = value
      }
    })
  },
  updateTheme: (update) => {
    const state = get()
    state.setState((draft) => {
      for (const [key, value] of Object.entries(update)) {
        // @ts-expect-error - is the key
        draft[key] = value
      }
    })
    for (const [key, value] of Object.entries(update)) {
      setVariable(`--${key}`, value)
    }
  },
})
