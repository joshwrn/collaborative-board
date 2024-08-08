import { randomNumberBetween } from '@/utils/randomNumberBetween'

// subtract progress from 100 to get reverse progress
export const mockProgress = async (options: {
  onProgress: (progress: number) => void
  time?: number
}) => {
  let { onProgress, time } = options
  if (!time) {
    time = randomNumberBetween(1000, 5000)
  }
  let curProgress = 0
  const totalUpdates = time / 100
  const increment = 1 / totalUpdates
  const interval = setInterval(() => {
    curProgress += increment
    if (curProgress >= 1) {
      curProgress = 1
    }
    onProgress(curProgress * 100)
  }, 100)
  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(interval)
      resolve('success')
    }, time)
  })
}
