import React from 'react'

import { rotatePointAroundCenter } from '@/logic/rotatePointAroundCenter'
import { useStore } from '@/state/gen-state'
import type { CanvasData } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { WINDOW_ATTRS } from '@/state/windows'
import { joinClasses } from '@/utils/joinClasses'

import { DEFAULT_PINNED_WINDOW_ZOOM } from '../Window/PinnedWindow/PinnedWindow'
import style from './Canvas.module.scss'

const returnAttributes = (
  window: WindowType,
  zoom: number,
  isFullScreen: boolean,
  isPinned?: boolean,
) => {
  if (isFullScreen) {
    return {
      width: WINDOW_ATTRS.defaultFullScreenSize.width - 40,
      height: WINDOW_ATTRS.defaultFullScreenSize.height - 200,
      rotation: 0,
      zoom: 1,
    }
  }
  if (isPinned) {
    return {
      width: WINDOW_ATTRS.defaultSize.width - 40,
      height: WINDOW_ATTRS.defaultSize.height - 200,
      rotation: 0,
      zoom: DEFAULT_PINNED_WINDOW_ZOOM,
    }
  }
  return {
    width: window.width - 40,
    height: window.height - 200,
    rotation: window.rotation,
    zoom: zoom,
  }
}

const returnContext = (ref: React.RefObject<HTMLCanvasElement>) => {
  if (!ref.current) {
    throw new Error(`canvas ref.current is undefined`)
  }
  const ctx = ref.current.getContext(`2d`)
  if (!ctx) {
    throw new Error(`ctx is undefined`)
  }
  return ctx
}

export const Canvas_Internal: React.FC<{
  window: WindowType
  contentId: string
  content: CanvasData
  isPinned: boolean
}> = ({ window, contentId, content, isPinned }) => {
  const state = useStore([
    `zoom`,
    `drawColor`,
    `drawSize`,
    `fullScreenWindow`,
    `editItemContent`,
    `generatedCanvas`,
    `setState`,
  ])

  const isFullScreen = state.fullScreenWindow === window.id
  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext(`2d`)
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
    img.src = content.base64
    // only rewrite the canvas if the window size changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.width, window.height])

  const attributes = returnAttributes(window, state.zoom, isFullScreen, isPinned)

  const writeCanvas = () => {
    if (!canvasRef.current) return
    state.editItemContent(window.id, {
      content: {
        base64: canvasRef.current.toDataURL(),
      },
      id: contentId,
      type: `canvas`,
    })
  }

  const calculateMousePosition = (e: React.PointerEvent) => {
    if (!counterRef.current) {
      throw new Error(`counterRef.current is undefined`)
    }
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
    return rotatedMousePosition
  }

  return (
    <div
      style={{
        position: `relative`,
        display: `flex`,
        justifyContent: `center`,
      }}
    >
      <div
        data-role="counter-rect"
        style={{
          width: `${attributes.width}px`,
          height: `${attributes.height}px`,
          position: `absolute`,
          transform: `rotate(${-attributes.rotation}deg)`,
          pointerEvents: `none`,
        }}
        ref={counterRef}
      />
      <canvas
        width={attributes.width}
        height={attributes.height}
        className={joinClasses(style.canvas, `canvas`)}
        ref={canvasRef}
        onPointerLeave={() => {
          writeCanvas()
        }}
        onPointerUp={() => {
          writeCanvas()
        }}
        onPointerDown={(e) => {
          const ctx = returnContext(canvasRef)
          const rotatedMousePosition = calculateMousePosition(e)
          ctx.fillStyle = state.drawColor
          ctx.beginPath()
          ctx.arc(
            rotatedMousePosition.x,
            rotatedMousePosition.y,
            state.drawSize / 2,
            0,
            2 * Math.PI,
          )
          ctx.fill()
        }}
        onPointerMove={(e) => {
          const ctx = returnContext(canvasRef)
          const rotatedMousePosition = calculateMousePosition(e)
          if (e.buttons !== 1) {
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
        }}
      />
    </div>
  )
}

export const Canvas = React.memo(Canvas_Internal)
