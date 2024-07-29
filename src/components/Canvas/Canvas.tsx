import React from 'react'
import style from './Canvas.module.scss'
import { WINDOW_ATTRS, WindowType } from '@/state/windows'
import { useShallowAppStore } from '@/state/gen-state'
import { rotatePointAroundCenter } from '@/logic/rotatePointAroundCenter'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { CanvasData } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'
import { useIterateOnSketch } from '@/fal/api/iterateOnSketch'
import { toast } from 'react-toastify'

const generateNoise = (
  ctx: CanvasRenderingContext2D,
  opacity: number,
  width: number,
  height: number,
) => {
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // Generate random color values
    const randomValue = Math.floor(Math.random() * 256)
    data[i] = randomValue // Red
    data[i + 1] = randomValue // Green
    data[i + 2] = randomValue // Blue
    data[i + 3] = Math.floor(255 * opacity) // Alpha
  }

  ctx.putImageData(imageData, 0, 0)
}

export const Canvas: React.FC<{
  window: WindowType
  contentId: string
  content: CanvasData
}> = ({ window, contentId, content }) => {
  const state = useShallowAppStore([
    'zoom',
    'drawColor',
    'drawSize',
    'setCanvasIsFocused',
    'canvasIsFocused',
    'fullScreenWindow',
    'editItemContent',
    'generatedCanvas',
  ])

  const iterateOnSketch = useIterateOnSketch({
    base64: content.base64,
  })

  const isFullScreen = state.fullScreenWindow === window.id

  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })

  useOutsideClick({
    refs: [],
    selectors: ['#toolbar', '.dropdown-list', '.canvas'],
    action: () => state.setCanvasIsFocused(false),
  })

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
    img.src = content.base64
  }, [window, content])

  const attributes = {
    width:
      (isFullScreen ? WINDOW_ATTRS.defaultFullScreenSize.width : window.width) -
      40,
    height: 400,
    rotation: isFullScreen ? 0 : window.rotation,
    zoom: isFullScreen ? 1 : state.zoom,
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        data-role="counter-rect"
        style={{
          width: `${attributes.width}px`,
          height: `${attributes.height}px`,
          position: 'absolute',
          transform: `rotate(${-attributes.rotation}deg)`,
          pointerEvents: 'none',
        }}
        ref={counterRef}
      />
      <canvas
        width={attributes.width}
        height={attributes.height}
        className={joinClasses(style.canvas, 'canvas')}
        onMouseDown={() => {
          state.setCanvasIsFocused(true)
        }}
        ref={canvasRef}
        onMouseUp={() => {
          console.log('onMouseUp')
          const ctx = canvasRef.current?.getContext('2d')
          if (!ctx) return
          generateNoise(ctx, 0.5, attributes.width, attributes.height)
          if (state.generatedCanvas?.generatedFromItemId === window.id) {
            toast.promise(
              iterateOnSketch.mutateAsync(),
              {
                pending: 'Generating...',
                success: 'Generated!',
                error: {
                  render: ({ data }: { data: Error }) => {
                    return data.message
                  },
                },
              },
              {
                autoClose: 1000,
              },
            )
          }
        }}
        onMouseMove={(e) => {
          if (!canvasRef.current) return
          if (!counterRef.current) return
          const ctx = canvasRef.current.getContext('2d')
          if (!ctx) return
          const counterBox = counterRef.current.getBoundingClientRect()
          const center = {
            x: counterBox.width / 2 / attributes.zoom,
            y: counterBox.height / 2 / attributes.zoom,
          }
          const mousePositionPure = {
            x: (e.clientX - counterBox.left) / attributes.zoom,
            y: (e.clientY - counterBox.top) / attributes.zoom,
          }
          const rotatedMousePosition = rotatePointAroundCenter(
            mousePositionPure,
            center,
            -attributes.rotation,
          )

          if (e.buttons !== 1 || !state.canvasIsFocused) {
            lastPosition.current = rotatedMousePosition
            return
          }

          const from = lastPosition.current
          ctx.beginPath()
          ctx.lineWidth = state.drawSize
          ctx.lineCap = `round`
          ctx.lineJoin = `round`
          ctx.strokeStyle = state.drawColor
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(rotatedMousePosition.x, rotatedMousePosition.y)
          ctx.stroke()

          lastPosition.current = rotatedMousePosition

          state.editItemContent(window.id, {
            content: {
              base64: canvasRef.current.toDataURL(),
            },
            id: contentId,
            type: 'canvas',
          })
        }}
      />
    </div>
  )
}
