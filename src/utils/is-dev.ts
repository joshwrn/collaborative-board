export const IS_DEV = process.env.NEXT_PUBLIC_SHOW_DEBUG === `true`

export const allowDebugItem = (...conditions: boolean[]) => {
  if (typeof window === `undefined`) {
    return false
  }
  const urlParams = new URLSearchParams(window.location.search)
  const dev = urlParams.get(`dev`)
  const conditionsAreTrue = conditions.every((c) => c)
  return (
    (dev === `true` || process.env.NEXT_PUBLIC_SHOW_DEBUG === `true`) &&
    conditionsAreTrue
  )
}
