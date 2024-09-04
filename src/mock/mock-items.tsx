import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'

import type { Item } from '@/state/items'

import { MOCK_BASE64 } from './mock-blob'
import { MOCK_NOUNS, MOCK_PLACES } from './mock-nouns'

const VOWELS = [`a`, `e`, `i`, `o`, `u`]

const wordWithArticle = (word: string) => {
  if (MOCK_PLACES.includes(word)) {
    return word
  }
  const lWord = word.toLowerCase()
  if (lWord.endsWith(`s`)) {
    return lWord
  }
  if (VOWELS.includes(lWord[0])) {
    return `an ` + lWord
  }
  return `a ` + lWord
}

export const createMockPrompt = () => {
  const subject = faker.helpers.arrayElement(MOCK_NOUNS)

  return `a messy watercolor painting of ${wordWithArticle(subject)}`
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
