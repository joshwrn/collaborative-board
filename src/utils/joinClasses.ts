export const joinClasses = (...classes: string[]) =>
  classes.filter(Boolean).join(' ')
