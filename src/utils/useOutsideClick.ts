'use client'
import type { MutableRefObject, RefObject } from 'react'
import { useEffect, useRef } from 'react'

const checkIfClickedOutsideRef = <EL extends HTMLElement>(
  ref: RefObject<EL>,
  event: MouseEvent,
) => {
  if (!ref.current) return false
  if (!ref.current.contains(event.target as Node)) {
    return true
  }
}

const checkIfClickedOutsideSelector = (selector: string, event: MouseEvent) => {
  if (!event.target) return false
  if (!(event.target instanceof Element)) return false
  if (!event.target.closest(selector)) {
    return true
  }
}

export const useOutsideClick = <EL1 extends HTMLElement>({
  action,
  refs,
  selectors,
}: {
  action: VoidFunction
  refs: RefObject<EL1>[]
  selectors?: string[]
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        refs.every((ref) => checkIfClickedOutsideRef(ref, e)) &&
        (!selectors ||
          selectors.every((selector) =>
            checkIfClickedOutsideSelector(selector, e),
          ))
      ) {
        action()
      }
    }
    document.addEventListener(`mousedown`, handleClickOutside)
    return () => {
      document.removeEventListener(`mousedown`, handleClickOutside)
    }
  }, [action, refs, selectors])
}
