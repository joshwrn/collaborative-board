import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'

import type { Item } from '@/state/items'

import { MOCK_BASE64 } from './mock-blob'
import { MOCK_NOUNS } from './mock-nouns'

export const createMockPrompt = () => {
  const subject = faker.helpers.arrayElement(MOCK_NOUNS)

  return `a messy watercolor painting of ${subject}`
}

export const createMockItem = (length: number): Item[] =>
  Array.from({ length }, () => {
    const prompt = createMockPrompt()

    return {
      id: nanoid(),
      subject: prompt,
      body: {
        prompt,
        base64: MOCK_BASE64,
        type: `generator`,
      },
    }
  })
