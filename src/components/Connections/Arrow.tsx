// https://medium.com/productboard-engineering/how-we-implemented-svg-arrows-in-react-the-curvature-2-3-892a330bd549

import { distance } from 'mathjs'
import React from 'react'

import {
  calculateCanvasDimensions,
  calculateControlPoints,
  calculateDeltas,
} from '@/logic/arrows'
import type { Point2d } from '@/state'

import styles from './Arrow.module.scss'

const CONTROL_POINTS_RADIUS = 5
const STRAIGHT_LINE_BEFORE_ARROW_HEAD = 5

type ArrowConfig = {
  arrowColor?: string
  controlPointsColor?: string
  dotEndingBackground?: string
  dotEndingRadius?: number
  arrowHeadEndingSize?: number
  strokeWidth?: number
}

type Props = {
  startPoint: Point2d
  endPoint: Point2d
  showDebugGuideLines?: boolean
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onClick?: (e: React.MouseEvent) => void
  config?: ArrowConfig
  isGenerating?: boolean
}

const ControlPoints = ({
  p1,
  p2,
  p3,
  p4,
  color,
}: {
  p1: Point2d
  p2: Point2d
  p3: Point2d
  p4: Point2d
  color: string
}) => {
  return (
    <>
      <circle
        cx={p2.x}
        cy={p2.y}
        r={CONTROL_POINTS_RADIUS}
        strokeWidth="0"
        fill={color}
      />
      <circle
        cx={p3.x}
        cy={p3.y}
        r={CONTROL_POINTS_RADIUS}
        strokeWidth="0"
        fill={color}
      />
      <line
        strokeDasharray="1,3"
        stroke={color}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
      />
      <line
        strokeDasharray="1,3"
        stroke={color}
        x1={p3.x}
        y1={p3.y}
        x2={p4.x}
        y2={p4.y}
      />
    </>
  )
}

const calculatePercent = (current: number, total: number) => {
  return current / total
}

const DOT_SPEED = 200

const Arrow_Internal: React.FC<Props> = ({
  startPoint,
  endPoint,
  showDebugGuideLines = false,
  config,
  isGenerating = false,
}) => {
  const defaultConfig = {
    arrowColor: `#bcc4cc`,
    controlPointsColor: `#ff4747`,
    dotEndingBackground: `#fff`,
    dotEndingRadius: 3,
    arrowHeadEndingSize: 9,
    strokeWidth: 1,
  }
  const currentConfig = {
    ...defaultConfig,
    ...config,
  }

  const {
    arrowColor,
    controlPointsColor,
    arrowHeadEndingSize,
    strokeWidth,
    dotEndingBackground,
    dotEndingRadius,
  } = currentConfig

  const arrowHeadOffset = arrowHeadEndingSize / 2
  const boundingBoxElementsBuffer =
    strokeWidth +
    arrowHeadEndingSize / 2 +
    dotEndingRadius +
    CONTROL_POINTS_RADIUS / 2

  const { absDx, absDy, dx, dy } = calculateDeltas(startPoint, endPoint)
  const { p1, p2, p3, p4, boundingBoxBuffer } = calculateControlPoints({
    boundingBoxElementsBuffer,
    dx,
    dy,
    absDx,
    absDy,
  })

  const { canvasWidth, canvasHeight } = calculateCanvasDimensions({
    absDx,
    absDy,
    boundingBoxBuffer,
  })

  const canvasXOffset =
    Math.min(startPoint.x, endPoint.x) - boundingBoxBuffer.horizontal
  const canvasYOffset =
    Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical

  const curvedLinePath = `
    M ${p1.x} ${p1.y}
    C ${p2.x} ${p2.y},
    ${p3.x} ${p3.y},
    ${p4.x - STRAIGHT_LINE_BEFORE_ARROW_HEAD} ${p4.y}
    L ${p4.x} ${p4.y}`

  const animation = React.useMemo(() => {
    const lineLength = Number(
      distance([startPoint.x, startPoint.y], [endPoint.x, endPoint.y]),
    )
    let duration = lineLength / DOT_SPEED
    let start = arrowHeadEndingSize + 50
    const middle = lineLength / 2
    let end = lineLength - arrowHeadEndingSize - 50
    if (middle > end) {
      end = lineLength * 0.75
      start = lineLength * 0.25
      duration = 3
    }
    const kT = [
      calculatePercent(start, lineLength),
      calculatePercent(middle, lineLength),
      calculatePercent(end, lineLength),
    ]
    const maxSize = dotEndingRadius + 1
    const values = `0; ${maxSize}; ${maxSize}; ${maxSize}; 0`
    return {
      values,
      duration,
      keyTimes: `0;${kT[0]};${kT[1]};${kT[2]};1`,
    }
  }, [arrowHeadEndingSize, startPoint, endPoint, dotEndingRadius])

  return (
    <>
      <svg
        width={canvasWidth}
        height={canvasHeight}
        className={styles.line}
        style={{
          transform: `translate(${canvasXOffset}px, ${canvasYOffset}px)`,
        }}
      >
        <defs>
          <filter id="sofGlow" height="300%" width="300%" x="-100%" y="-105%">
            <feMorphology
              operator="dilate"
              radius="1"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="4" result="blurred" />
            <feFlood floodColor={dotEndingBackground} result="glowColor" />
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlow_colored"
            />
            <feMerge>
              <feMergeNode in="softGlow_colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className={styles.renderedLine}
          d={curvedLinePath}
          strokeWidth={strokeWidth}
          stroke={arrowColor}
          fill="none"
          strokeDasharray={isGenerating ? `5,15` : `0, 0`}
          strokeLinecap="round"
        />
        {isGenerating && (
          <circle
            id="followingCircle"
            r={dotEndingRadius + 1}
            fill={dotEndingBackground}
            opacity={1}
            filter="url(#sofGlow)"
          >
            <animateMotion
              dur={`${animation.duration}s`}
              repeatCount="indefinite"
              path={curvedLinePath}
              rotate="auto"
            />
            <animate
              attributeName="r"
              values={animation.values}
              dur={`${animation.duration}s`}
              repeatCount="indefinite"
              keyTimes={animation.keyTimes}
            />
          </circle>
        )}
        <circle
          className={styles.dotEnding}
          cx={p1.x}
          cy={p1.y}
          r={dotEndingRadius}
          stroke={arrowColor}
          strokeWidth={strokeWidth}
          fill={dotEndingBackground}
        />
        <path
          className={styles.arrowHeadEnding}
          d={`
          M ${(arrowHeadEndingSize / 5) * 2} 0
          L ${arrowHeadEndingSize} ${arrowHeadEndingSize / 2}
          L ${(arrowHeadEndingSize / 5) * 2} ${arrowHeadEndingSize}`}
          fill="none"
          stroke={arrowColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            transform: `translate(${p4.x - arrowHeadOffset * 2}px, ${p4.y - arrowHeadOffset}px)`,
          }}
        />

        {showDebugGuideLines && (
          <ControlPoints
            p1={p1}
            p2={p2}
            p3={p3}
            p4={p4}
            color={controlPointsColor}
          />
        )}
      </svg>
    </>
  )
}

export const Arrow = React.memo(Arrow_Internal)
