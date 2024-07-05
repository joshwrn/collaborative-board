import React from 'react'
import style from './Canvas.module.scss'
import { Point2d } from '@/state'
import { WindowType } from '@/state/windows'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { rotatePointAroundCenter } from '@/logic/rotatePointAroundCenter'

export const Canvas: React.FC<{
  window: WindowType
}> = ({ window }) => {
  const state = useAppStore(
    useShallow((state) => ({
      zoom: state.zoom,
      drawColor: state.drawColor,
    })),
  )

  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div
        data-role="counter-rect"
        style={{
          width: `${window.width}px`,
          height: `${window.height - 200}px`,
          position: 'absolute',
          transform: `rotate(${-window.rotation}deg)`,
          pointerEvents: 'none',
        }}
        ref={counterRef}
      />
      <canvas
        width={window.width}
        height={window.height - 200}
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          border: '1px solid blue',
        }}
        ref={canvasRef}
        onMouseMove={(e) => {
          const ctx = canvasRef.current?.getContext('2d')
          const counterBox = counterRef.current?.getBoundingClientRect()
          if (!ctx) return
          if (!counterBox) return
          const center = {
            x: counterBox.width / 2 / state.zoom,
            y: counterBox.height / 2 / state.zoom,
          }
          const mousePositionPure = {
            x: (e.clientX - counterBox.left) / state.zoom,
            y: (e.clientY - counterBox.top) / state.zoom,
          }
          const rotatedMousePosition = rotatePointAroundCenter(
            mousePositionPure,
            center,
            -window.rotation,
          )

          if (e.buttons !== 1) {
            lastPosition.current = rotatedMousePosition
            return
          }
          const from = lastPosition.current
          ctx.beginPath()
          ctx.lineWidth = 10
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
