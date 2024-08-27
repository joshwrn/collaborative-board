'use client'
import type { RefObject } from 'react'
import { useEffect } from 'react'

const checkIfClickedOutsideRef = (
  ref: RefObject<{
    contains: (arg0: Node) => boolean
  }>,
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

export const useOutsideClick = ({
  action,
  refs,
  selectors,
}: {
  action: VoidFunction
  refs: RefObject<{
    contains: (arg0: Node) => boolean
  }>[]
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
