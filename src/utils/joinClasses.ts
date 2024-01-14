export const joinClasses = (...classes: (string | null | boolean)[]) =>
  classes.filter(Boolean).join(' ')
