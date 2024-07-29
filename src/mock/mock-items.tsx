import { Item } from '@/state/items'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'

export const createMockItem = (length: number): Item[] =>
  Array.from({ length }, () => {
    const subject = faker.word.words()
    const body = faker.helpers.arrayElement([
      'watercolor painting',
      'oil painting',
      'acrylic painting',
      'charcoal drawing',
      'pastel drawing',
    ])
    return {
      id: nanoid(),
      subject,
      body: [
        { id: nanoid(), type: 'text', content: body },
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
