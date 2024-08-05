import { Item } from '@/state/items'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'
import { MOCK_NOUNS } from './mockNouns'

const VOWELS = ['a', 'e', 'i', 'o', 'u']

const wordWithArticle = (word: string) => {
  const lWord = word.toLowerCase()
  if (lWord.endsWith('s')) {
    return lWord
  }
  if (VOWELS.includes(lWord[0])) {
    return 'an ' + lWord
  }
  return 'a ' + lWord
}

export const createMockPrompt = () => {
  const typeOfArt = faker.helpers.arrayElement([
    'painting',
    'drawing',
    'illustration',
    'comic book',
    'graphic design',
    '3D modeling',
    'watercolor',
    'sculpture',
    'installation art',
    'abstract art',
    'architecture',
    'product design',
    'character design',
    'pop art',
  ])
  const subject = faker.helpers.arrayElement(MOCK_NOUNS)

  const style = faker.helpers.arrayElement([
    'realistic',
    'abstract',
    'surrealistic',
    'hyperrealistic',
    'surreal',
    'fantasy',
    'science fiction',
    'magical realism',
    'minimalist',
    'photorealistic',
    'cubist',
    'expressionist',
    'minimalism',
    'pointillism',
    'gothic',
    'renaissance',
  ])

  return [style, typeOfArt, 'of', wordWithArticle(subject)].join(' ')
}

export const createMockItem = (length: number): Item[] =>
  Array.from({ length }, () => {
    const prompt = createMockPrompt()

    return {
      id: nanoid(),
      subject: prompt,
      body: [
        {
          id: nanoid(),
          type: 'text',
          content: prompt,
        },
        {
          id: nanoid(),
          type: 'canvas',
          content: {
            base64: '',
          },
        },
      ],
      members: [],
    }
  })
