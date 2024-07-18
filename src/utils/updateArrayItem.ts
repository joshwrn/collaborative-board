export const updateArrayItem = <T>({
  array,
  findBy,
  newItem,
}: {
  array: T[]
  findBy: (item: T) => boolean
  newItem: ((item: T) => T) | T
}): T[] => {
  return array.map((item) => {
    if (findBy(item)) {
      if (typeof newItem === `function`) {
        // @ts-expect-error - newItem is a function
        return newItem(item)
      }
      return newItem
    }
    return item
  })
}
