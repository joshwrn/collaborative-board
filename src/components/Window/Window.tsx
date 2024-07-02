'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Window.module.scss'
import { useAppStore } from '@/state/gen-state'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { WindowBorder } from './WindowBorder'
import { IoAddOutline } from 'react-icons/io5'
import { ConnectorOverlay } from './ConnectorOverlay'
import { useShallow } from 'zustand/react/shallow'
import { Iframe, Item } from '@/state/items'
import { WindowType } from '@/state/windows'
import { match, P } from 'ts-pattern'
import { joinClasses } from '@/utils/joinClasses'
import { RotationPoints } from './RotationPoints'
import { Point2d } from '@/state'

const matchBody = (
  body: string | Iframe,
  i: number,
): JSX.Element | JSX.Element[] | null => {
  return match(body)
    .with(P.string, (value) => <p key={i}>{value}</p>)
    .with(
      {
        src: P.string,
      },
      (value) => (
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          key={i}
        >
          <iframe
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '10px',
            }}
            {...value}
          />
        </div>
      ),
    )
    .otherwise(() => null)
}

function rotatePoint(point: Point2d, angle: number): Point2d {
  const { x, y } = point
  // Convert the angle from degrees to radians
  let radians = angle * (Math.PI / 180)

  // Calculate the new coordinates
  let xNew = x * Math.cos(radians) - y * Math.sin(radians)
  let yNew = x * Math.sin(radians) + y * Math.cos(radians)

  return { x: xNew, y: yNew }
}

function rotatePointAroundCenter(
  point: Point2d,
  center: Point2d,
  angle: number,
): Point2d {
  const { x, y } = point
  const { x: cx, y: cy } = center
  // Translate point to the origin
  let translatedX = x - cx
  let translatedY = y - cy

  // Rotate the point
  let rotatedPoint = rotatePoint(
    {
      x: translatedX,
      y: translatedY,
    },
    angle,
  )

  // Translate point back
  let xNew = rotatedPoint.x + cx
  let yNew = rotatedPoint.y + cy

  return { x: xNew, y: yNew }
}

export const WindowInternal: FC<{
  item: Item
  window: WindowType
}> = ({ item, window }) => {
  const state = useAppStore(
    useShallow((state) => ({
      close: state.toggleOpenWindow,
      setWindow: state.setOneWindow,
      bringToFront: state.reorderWindows,
      connections: state.connections,
      setActiveConnection: state.setActiveConnection,
      makeConnection: state.makeConnection,
      fullScreen: state.fullscreenWindow,
      setHoveredWindow: state.setHoveredWindow,
      snapToWindows: state.snapToWindows,
      setSnappingToPositions: state.setSnapLines,
      spaceMousePosition: state.spaceMousePosition,
      zoom: state.zoom,
    })),
  )

  const realPosition = React.useRef({ x: window.x, y: window.y })

  const { width, height } = window

  const nodeRef = React.useRef<HTMLDivElement>(null)
  const mainRef = React.useRef<HTMLDivElement>(null)
  const counterRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const lastPosition = React.useRef({ x: 0, y: 0 })

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const scaledPosition = {
      x: movementX / useAppStore.getState().zoom,
      y: movementY / useAppStore.getState().zoom,
    }
    realPosition.current.x += scaledPosition.x
    realPosition.current.y += scaledPosition.y
    state.snapToWindows(item.id, {
      ...window,
      x: realPosition.current.x,
      y: realPosition.current.y,
    })
  }

  const onDragStart = (e: DraggableEvent, data: DraggableData) => {}

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    state.setSnappingToPositions([])
  }

  const toConnections = React.useMemo(
    () => state.connections.filter((c) => c.to === item.id),
    [state.connections, item.id],
  )

  const fromConnections = React.useMemo(
    () => state.connections.filter((c) => c.from === item.id),
    [state.connections, item.id],
  )

  const [centerPoint, setCenterPoint] = React.useState<Point2d>({
    x: 0,
    y: 0,
  })

  return (
    <DraggableCore
      onDrag={onDrag}
      onStop={onDragStop}
      onStart={onDragStart}
      handle=".handle"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={joinClasses(styles.wrapper, 'window')}
        id={`window-${item.id}`}
        style={{
          left: window.x,
          top: window.y,
          // transformOrigin: '0 0',
          width: `${width}px`,
          height: `${height}px`,
          rotate: `${window.rotation}deg`,
          zIndex: window.zIndex,
        }}
        onMouseEnter={() => state.setHoveredWindow(item.id)}
        onMouseLeave={() => state.setHoveredWindow(null)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => state.bringToFront(item.id)}
      >
        <RotationPoints id={item.id} window={window} />
        <nav className={`${styles.topBar} handle`}>
          <button
            className={styles.close}
            onClick={() => state.close(item.id)}
          />
          <button
            className={styles.full}
            onClick={() => state.fullScreen(item.id)}
          />
        </nav>

        <header className={styles.titleBar}>
          <section className={styles.title}></section>
          <section className={styles.connections}>
            <inner>
              <p>
                Incoming <strong>{toConnections.length}</strong>
              </p>
              <p>
                Outgoing <strong>{fromConnections.length}</strong>
              </p>
            </inner>
            <button onClick={() => state.setActiveConnection({ from: item.id })}>
              <IoAddOutline />
            </button>
          </section>
        </header>

        <main className={styles.content} ref={mainRef}>
          {/* {item.body.map((body, i) => matchBody(body, i))} */}
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'blue',
              position: 'absolute',
              transform: `translate(${centerPoint.x}px, ${centerPoint.y}px)`,
            }}
          />
          <div
            data-role="counter-rect"
            style={{
              width: `${width}px`,
              height: `${height - 110}px`,
              position: 'absolute',
              transform: `rotate(${-window.rotation}deg)`,
              pointerEvents: 'none',
              border: '1px solid red',
            }}
            ref={counterRef}
          />
          <canvas
            width={width}
            height={height - 110}
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
              if (!mainRef.current) return
              const center = {
                x: counterBox.width / 2 / state.zoom,
                y: counterBox.height / 2 / state.zoom,
              }
              setCenterPoint(center)
              const mousePositionPure = {
                x: (e.clientX - counterBox.left) / state.zoom,
                y:
                  (e.clientY - counterBox.top) / state.zoom +
                  mainRef.current.scrollTop,
              }
              const rotatedMousePosition = rotatePointAroundCenter(
                mousePositionPure,
                center,
                -window.rotation,
              )
              console.log(rotatedMousePosition, mousePositionPure, center)

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
        </main>
        <ConnectorOverlay id={item.id} />

        <WindowBorder
          width={width}
          height={height}
          id={item.id}
          position={{ x: window.x, y: window.y }}
        />
      </div>
    </DraggableCore>
  )
}

const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      items: state.items,
      windows: state.windows,
    })),
  )
  const itemsMap = React.useMemo(
    () =>
      state.items.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {} as Record<string, Item>),
    [state.items],
  )
  return (
    <>
      {state.windows.map((window) => {
        const item = itemsMap[window.id]
        if (!window) return null
        return <Window key={item.id} item={item} window={window} />
      })}
    </>
  )
}

export const Windows = React.memo(WindowsInternal)
