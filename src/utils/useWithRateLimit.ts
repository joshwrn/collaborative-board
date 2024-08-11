import React from 'react'

export const useWithRateLimit = (): [
  boolean,
  (callback: () => void, delay: number) => void,
] => {
  const [disabled, setDisabled] = React.useState(false)

  const limit = (callback: () => void, delay: number) => {
    if (disabled) {
      return
    }
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, delay)

    callback()
  }

  return [disabled, limit]
}
