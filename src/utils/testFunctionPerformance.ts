import { allowDebugItem } from './is-dev'

export const testFunctionPerformance = (
  fn: () => void,
  runs = 20,
  name = `anonymous function`,
) => {
  if (!allowDebugItem()) {
    return fn()
  }
  let totalTime = 0

  for (let i = 0; i < runs - 1; i++) {
    const start = performance.now()
    fn()
    const end = performance.now()
    totalTime += end - start
  }

  const result = fn()

  const averageTime = totalTime / runs
  console.log(`${runs} runs of ${name} took an average of ${averageTime} ms`)
  return result
}
