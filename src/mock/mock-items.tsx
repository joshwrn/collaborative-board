import { Item } from '@/state/items'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'

export const createMockItem = (length: number): Item[] =>
  Array.from({ length }, () => {
    const subject = faker.word.words()
    const body = faker.lorem.paragraphs(3)
    return {
      id: nanoid(),
      subject,
      body: [{ id: nanoid(), type: 'text', content: body }],
      members: [],
    }
  })

export const MOCK_ITEMS: Item[] = [
  {
    id: nanoid(),
    subject: 'New Windows',
    members: [],
    body: [
      {
        id: nanoid(),
        type: 'text',
        content: {
          src: 'https://codesandbox.io/embed/sbf2i?view=preview&module=%2Fsrc%2FEffects.js&hidenavigation=1',
          sandbox:
            'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts',
          allow:
            'accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking',
          title: 'Sparks and effects',
        },
      },
    ],
  },
  ...createMockItem(100),
]
