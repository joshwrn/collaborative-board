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
    })),
  )

  const [centerPoint, setCenterPoint] = React.useState<Point2d>({
    x: 0,
    y: 0,
  })

  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })
  return (
    <>
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'blue',
          top: centerPoint.y,
          left: centerPoint.x,
          position: 'absolute',
        }}
      />
      <div
        data-role="counter-rect"
        style={{
          width: `${window.width}px`,
          height: `${window.height}px`,
          position: 'absolute',
          transform: `rotate(${-window.rotation}deg)`,
          pointerEvents: 'none',
          border: '1px solid red',
        }}
        ref={counterRef}
      />
      <canvas
        width={window.width}
        height={window.height}
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
          setCenterPoint(center)
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
          ctx.lineWidth = 3
          ctx.lineCap = `round`
          ctx.strokeStyle = 'red'
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(rotatedMousePosition.x, rotatedMousePosition.y)
          ctx.stroke()

          lastPosition.current = rotatedMousePosition
        }}
      />
    </>
  )
}
