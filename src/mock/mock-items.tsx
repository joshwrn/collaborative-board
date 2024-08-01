import { Item } from '@/state/items'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'

export const createMockPrompt = () => {
  const typeOfArt = faker.helpers.arrayElement([
    'painting',
    'drawing',
    'photography',
    'illustration',
    'comic book',
    'graphic design',
    '3D modeling',
    'video game art',
    'animation',
    'sculpture',
    'installation art',
    'mixed media',
    'abstract art',
    'typography',
    'architecture',
    'product design',
    'character design',
    'landscape',
    'still life',
  ])
  const medium = faker.helpers.arrayElement([
    'ink',
    'charcoal',
    'pencil',
    'pastel',
    'watercolor',
    'acrylic',
    'oil',
    'gouache',
    'graphite',
    'pen',
    'brush',
    'pencil',
    'crayon',
    'markers',
    'paint',
  ])
  const style = faker.helpers.arrayElement([
    'realistic',
    'abstract',
    'impressionistic',
    'surrealistic',
    'hyperrealistic',
    'surreal',
    'fantasy',
    'science fiction',
    'magical realism',
    'pop art',
    'minimalist',
    'photorealistic',
    'cubist',
    'expressionist',
    'abstract expressionism',
    'minimalism',
    'post-impressionism',
    'fauvism',
    'pointillism',
    'neo-expressionism',
    'neo-impressionism',
    'art nouveau',
    'art deco',
    'baroque',
    'rococo',
    'gothic',
    'renaissance',
    'baroque',
    'rococo',
    'gothic',
    'renaissance',
  ])

  return [style, medium, typeOfArt].join(' ')
}

export const createMockItem = (length: number): Item[] =>
  Array.from({ length }, () => {
    const subject = faker.word.words()

    return {
      id: nanoid(),
      subject,
      body: [
        {
          id: nanoid(),
          type: 'text',
          content: createMockPrompt(),
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
