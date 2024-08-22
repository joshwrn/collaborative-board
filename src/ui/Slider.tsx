import type { InputHTMLAttributes } from 'react'
import React from 'react'

import { IoHelp as TooltipIcon } from 'react-icons/io5'

import { joinClasses } from '@/utils/joinClasses'

import style from './Slider.module.scss'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  useFloating,
  FloatingArrow,
  arrow,
} from '@floating-ui/react'

const Tooltip: React.FC<{
  description: string
  reference: React.RefObject<Element>
}> = ({ description, reference }) => {
  const arrowRef = React.useRef<SVGSVGElement>(null)
  const floating = useFloating({
    whileElementsMounted: autoUpdate,
    elements: {
      reference: reference.current,
    },
    strategy: `absolute`,
    placement: `right`,
    middleware: [
      arrow({
        element: arrowRef.current,
      }),
      offset({
        mainAxis: 14,
      }),
      flip({
        rootBoundary: `viewport`,
        crossAxis: false,
      }),
    ],
  })
  return (
    <FloatingPortal>
      <div
        ref={floating.refs.setFloating}
        className={style.tooltip}
        style={{
          top: floating.y,
          left: floating.x,
        }}
      >
        <p className={style.tooltipContent}>{description}</p>
        <FloatingArrow
          ref={arrowRef}
          context={floating.context}
          fill="var(--tooltip-background-color)"
          stroke="var(--tooltip-border)"
          strokeWidth={1}
        />
      </div>
    </FloatingPortal>
  )
}

const Slider_Internal: React.FC<
  Omit<InputHTMLAttributes<HTMLInputElement>, `max` | `min` | `onChange`> & {
    label: string
    value: number
    description?: string
    onChange: (value: number) => void
    className?: string
    min?: number | null
    max?: number | null
  }
> = ({ value, onChange, label, className, description, min, max, ...props }) => {
  const id = label.replaceAll(` `, `_`)
  // Percentage = (Value - Minimum) / (Maximum - Minimum) * 100
  const minValue = Number(min ?? 0)
  const maxValue = Number(max ?? 100)
  const progress = ((value - minValue) / (maxValue - minValue)) * 100
  const ref = React.useRef<HTMLButtonElement>(null)
  const [showTooltip, setShowTooltip] = React.useState<boolean>(false)

  return (
    <div className={joinClasses(style.slider, className)}>
      <label htmlFor={id}>
        <span className={style.title}>
          {label}
          {description && (
            <button
              className={style.tooltipIcon}
              ref={ref}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <TooltipIcon size={10} />
              {showTooltip && (
                <Tooltip description={description} reference={ref} />
              )}
            </button>
          )}
        </span>
        <span className={style.value}>{value}</span>
      </label>
      <div className={style.track}>
        <div
          className={style.progress}
          style={{
            width: `${progress}%`,
          }}
        >
          <div className={style.thumb} />
        </div>
        <input
          id={id}
          type="range"
          step={0.01}
          {...props}
          min={minValue}
          max={maxValue}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export const Slider = React.memo(Slider_Internal)
