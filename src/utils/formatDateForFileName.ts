export const formatDateForFileName = (date?: Date): string => {
  if (!date) {
    date = new Date()
  }
  const pad = (num: number): string => num.toString().padStart(2, `0`)
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1) // getMonth() returns 0-11
  const year = pad(date.getFullYear())
  const hours = pad(date.getHours() % 12)
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const amPm = parseInt(hours) >= 12 ? `PM` : `AM`
  return `${month}-${day}-${year}--${hours}.${minutes}.${seconds}${amPm}`
}
