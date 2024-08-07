export const mockProgress = async (
  time: number,
  onProgress: (progress: number) => void,
) => {
  let curProgress = 0
  const totalUpdates = time / 100
  const increment = 1 / totalUpdates
  const interval = setInterval(() => {
    curProgress += increment
    if (curProgress >= 1) {
      curProgress = 1
    }
    onProgress(curProgress)
  }, 100)
  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(interval)
      resolve('success')
    }, time)
  })
}
