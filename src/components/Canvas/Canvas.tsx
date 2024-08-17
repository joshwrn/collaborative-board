import React from 'react'

import { rotatePointAroundCenter } from '@/logic/rotatePointAroundCenter'
import { useStore } from '@/state/gen-state'
import type { CanvasData } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { WINDOW_ATTRS } from '@/state/windows'
import { joinClasses } from '@/utils/joinClasses'
import { useOutsideClick } from '@/utils/useOutsideClick'

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
    `canvasIsFocused`,
    `fullScreenWindow`,
    `editItemContent`,
    `generatedCanvas`,
    `setState`,
  ])

  const isFullScreen = state.fullScreenWindow === window.id

  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })

  useOutsideClick({
    refs: [],
    selectors: [`#toolbar`, `.dropdown-list`, `.canvas`],
    action: () =>
      state.setState((draft) => {
        draft.canvasIsFocused = false
      }),
  })

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext(`2d`)
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
    img.src = content.base64
  }, [window, content])

  const attributes = returnAttributes(window, state.zoom, isFullScreen, isPinned)
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
        onMouseDown={() => {
          state.setState((draft) => {
            draft.canvasIsFocused = true
          })
        }}
        ref={canvasRef}
        onMouseMove={(e) => {
          if (!canvasRef.current) return
          if (!counterRef.current) return
          const ctx = canvasRef.current.getContext(`2d`)
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
            type: `canvas`,
          })
        }}
      />
    </div>
  )
}

export const Canvas = React.memo(Canvas_Internal)
