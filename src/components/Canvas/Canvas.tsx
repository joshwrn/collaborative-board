import React from 'react'
import style from './Canvas.module.scss'
import { Point2d } from '@/state'
import { WindowType } from '@/state/windows'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { rotatePointAroundCenter } from '@/logic/rotatePointAroundCenter'
import { useOutsideClick } from '@/utils/useOutsideClick'

export const Canvas: React.FC<{
  window: WindowType
}> = ({ window }) => {
  const state = useAppStore(
    useShallow((state) => ({
      zoom: state.zoom,
      drawColor: state.drawColor,
      drawSize: state.drawSize,
      setCanvasIsFocused: state.setCanvasIsFocused,
    })),
  )

  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })

  useOutsideClick({
    refs: [canvasRef],
    selectors: ['#toolbar', '.dropdown-list'],
    action: () => state.setCanvasIsFocused(false),
  })

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
      onMouseDown={() => state.setCanvasIsFocused(true)}
    >
      <div
        data-role="counter-rect"
        style={{
          width: `${window.width - 40}px`,
          height: `${400}px`,
          position: 'absolute',
          transform: `rotate(${-window.rotation}deg)`,
          pointerEvents: 'none',
        }}
        ref={counterRef}
      />
      <canvas
        width={window.width - 40}
        height={400}
        className={style.canvas}
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
