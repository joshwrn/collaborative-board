import { randomNumberBetween } from '@/utils/randomNumberBetween'
import { Time, type TimeValue } from '@/utils/time'

// subtract progress from 100 to get reverse progress
export const mockProgress = async (options: {
  onProgress: (progress: number) => void
  time?: TimeValue
  shouldReject?: boolean
}) => {
  let { onProgress, time } = options
  if (!time) {
    time = Time.seconds(randomNumberBetween(1, 5))
  }
  let curProgress = 0
  const totalUpdates = time / 100
  const increment = 1 / totalUpdates

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        curProgress += increment
        if (curProgress >= 1) {
          curProgress = 1
        }
        if (options.shouldReject && curProgress > 0.5) {
          throw new Error(`Fake Error`)
        }
        onProgress(curProgress * 100)
      } catch (e) {
        clearInterval(interval)
        reject(e)
      }
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      resolve(`success`)
    }, time)
  })
}
