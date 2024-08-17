export const joinClasses = (...classes: (boolean | string | null)[]) =>
  classes.filter(Boolean).join(` `)
