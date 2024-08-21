import React, { InputHTMLAttributes } from 'react'
import style from './Slider.module.scss'
import { joinClasses } from '@/utils/joinClasses'

const Slider_Internal: React.FC<
  {
    label: string
    value: number
    onChange: (value: number) => void
    className?: string
  } & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>
> = ({ value, onChange, label, className, ...props }) => {
  const id = label.replaceAll(` `, `_`)
  // Percentage = (Value - Minimum) / (Maximum - Minimum) * 100
  const min = Number(props.min)
  const max = Number(props.max)
  const progress = ((value - min) / (max - min)) * 100
  return (
    <div className={joinClasses(style.slider, className)}>
      <label htmlFor={id}>
        {label}
        <span>{value}</span>
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
          {...props}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export const Slider = React.memo(Slider_Internal)
