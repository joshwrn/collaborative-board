import { blobToBase64 } from './blobToBase64'

export const convertImageToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const blob = await response.blob()
  const base64 = await blobToBase64(blob)
  return base64
}
