type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export const ensureAllFieldsDefined = <T extends object>(
  data: T,
): NonNullableFields<T> => {
  for (const [key, field] of Object.entries(data)) {
    if (field === undefined || field === null) {
      throw new Error(`Missing data: ${key} is undefined or null`)
    }
  }
  return data as NonNullableFields<T>
}
