export interface Point2d {
  x: number
  y: number
}

export const findEntity = <T extends { id: string }>(
  entities: T[],
  id: string,
  defaultValue: T,
): T => {
  const entity = entities.find((e) => e.id === id)
  if (!entity) {
    return defaultValue
  }
  return entity
}
