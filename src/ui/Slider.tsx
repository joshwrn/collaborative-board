import React, { InputHTMLAttributes } from 'react'
import style from './Slider.module.scss'

export const Slider: React.FC<
  {
    label: string
    value: number
    onChange: (value: number) => void
  } & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>
> = ({ value, onChange, label, ...props }) => {
  const id = label.replaceAll(` `, `_`)
  return (
    <div className={style.slider}>
      <label htmlFor={id}>
        {label}
        <span>{value}</span>
      </label>
      <input
        id={id}
        type="range"
        {...props}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
