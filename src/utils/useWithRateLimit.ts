import React from 'react'

export const useWithRateLimit = (): [
  boolean,
  (callback: () => void, delay: number) => Promise<void>,
] => {
  const [disabled, setDisabled] = React.useState(false)

  const limit = async (callback: () => Promise<void> | void, delay: number) => {
    if (disabled) {
      return
    }
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, delay)

    await callback()
  }

  return [disabled, limit]
}
