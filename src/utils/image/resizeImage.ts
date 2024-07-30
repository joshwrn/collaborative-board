export const resizeImage = ({
  base64,
  width,
  height,
  onSuccess,
}: {
  base64: string
  width: number
  height: number
  onSuccess: (base64: string) => void
}) => {
  // resize image
  const img = new Image()
  img.src = base64
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error(`Canvas context not found.`)

    const resizedDimensions = {
      width: width,
      height: height,
    }
    canvas.width = resizedDimensions.width
    canvas.height = resizedDimensions.height

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      resizedDimensions.width,
      resizedDimensions.height,
    )
    const base64 = canvas.toDataURL()
    onSuccess(base64)
  }
}
