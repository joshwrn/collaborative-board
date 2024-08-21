export const joinClasses = (
  ...classes: (boolean | string | null | undefined)[]
) => classes.filter(Boolean).join(` `)
