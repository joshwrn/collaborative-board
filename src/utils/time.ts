const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

export type TimeValue = number & { __brand__: `Time` }

const milliseconds = (value: number): TimeValue => {
  return value as TimeValue
}

const seconds = (value: number): TimeValue => {
  return (value * SECOND) as TimeValue
}

const minutes = (value: number): TimeValue => {
  return (value * MINUTE) as TimeValue
}

const hours = (value: number): TimeValue => {
  return (value * HOUR) as TimeValue
}

const days = (value: number): TimeValue => {
  return (value * DAY) as TimeValue
}

const weeks = (value: number): TimeValue => {
  return (value * WEEK) as TimeValue
}

const months = (value: number): TimeValue => {
  return (value * MONTH) as TimeValue
}

const years = (value: number): TimeValue => {
  return (value * YEAR) as TimeValue
}

export const Time = {
  milliseconds,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  months,
  years,
}
