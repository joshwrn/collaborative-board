import React from 'react'

export const usePreventScroll = ({ enabled }: { enabled: boolean }) => {
  React.useEffect(() => {
    const preventDefault = (e: WheelEvent | TouchEvent) => {
      e.preventDefault()
    }
    if (enabled) {
      window.addEventListener('wheel', preventDefault, {
        passive: false,
      })
      window.addEventListener('touchmove', preventDefault, {
        passive: false,
      })
    } else {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
    }
    return () => {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
    }
  }, [enabled])
}
