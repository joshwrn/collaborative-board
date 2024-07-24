import React from 'react'
import style from './Canvas.module.scss'
import { WINDOW_ATTRS, WindowType } from '@/state/windows'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { rotatePointAroundCenter } from '@/logic/rotatePointAroundCenter'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { CanvasData } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'

export const Canvas: React.FC<{
  window: WindowType
  contentId: string
  content: CanvasData
}> = ({ window, contentId, content }) => {
  const state = useAppStore(
    useShallow((state) => ({
      zoom: state.zoom,
      drawColor: state.drawColor,
      drawSize: state.drawSize,
      setCanvasIsFocused: state.setCanvasIsFocused,
      canvasIsFocused: state.canvasIsFocused,
      fullScreenWindow: state.fullScreenWindow,
      editItemContent: state.editItemContent,
    })),
  )

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
