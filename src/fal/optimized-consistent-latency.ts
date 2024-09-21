import * as fal from '@fal-ai/serverless-client'

import type { FalSettings } from '@/state/fal'

type OptimizedConsistentLatencyOutput = {
  images: {
    url: string
    content_type: string
    width: number
    height: number
  }[]
}

export const optimizedConsistentLatency = async (
  inputs: FalSettings,
  onUpdate?: (update: fal.QueueStatus) => void,
): Promise<OptimizedConsistentLatencyOutput> => {
  const result = await fal.subscribe(`fal-ai/lcm-sd15-i2i`, {
    input: {
      ...inputs,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === `IN_PROGRESS`) {
        if (onUpdate) {
          onUpdate(update)
        }
      }
    },
  })
  return result as OptimizedConsistentLatencyOutput
}
