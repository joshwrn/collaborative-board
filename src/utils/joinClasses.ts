export const joinClasses = (...classes: (string | null)[]) =>
  classes.filter(Boolean).join(' ')
