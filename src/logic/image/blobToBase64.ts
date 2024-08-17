// client-side blob to base64 conversion
// export const blobToBase64 = async (blob: Blob): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onloadend = () => resolve(reader.result as string)
//     reader.onerror = reject
//     reader.readAsDataURL(blob)
//   })
// }

export const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const chunks: Uint8Array[] = []
    const reader = blob.stream().getReader()

    const read = async () => {
      try {
        const { done, value } = await reader.read()
        if (done) {
          const buffer = Buffer.concat(chunks)
          resolve(buffer.toString(`base64`))
        } else {
          chunks.push(value)
          await read()
        }
      } catch (error) {
        reject(error)
      }
    }

    await read()
  })
}
