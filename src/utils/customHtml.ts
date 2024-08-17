/* eslint-disable @typescript-eslint/no-namespace */
import type React from 'react'

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      wrapper: Props
      outer: Props
      inner: Props
      container: Props
      shadow: Props
      divider: Props
      placeholder: Props
      overlay: Props
      item: Props
    }
  }
}
