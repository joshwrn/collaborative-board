import type { MutableRefObject, RefObject } from 'react'
import { useEffect, useRef } from 'react'

const checkIfClickedOutside = <EL extends HTMLElement>(
  ref: RefObject<EL>,
  event: MouseEvent,
) => {
  if (!ref.current) return false
  if (!ref?.current?.contains(event.target as Node)) {
    return true
  }
}

export const useOutsideClick = <
  EL1 extends HTMLElement,
  EL2 extends HTMLElement = EL1,
>({
  action,
  providedRef,
  providedRef2,
}: {
  action: VoidFunction
  providedRef?: MutableRefObject<EL1 | null>
  providedRef2?: MutableRefObject<EL2 | null>
}): [RefObject<EL1>, RefObject<EL2>] => {
  const ref1 = useRef<EL1>(null)
  const ref2 = useRef<EL2>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const firstRefToCheck = providedRef || ref1
      const secondRefToCheck = providedRef2 || ref2
      if (
        checkIfClickedOutside(firstRefToCheck, e) &&
        (!secondRefToCheck.current || checkIfClickedOutside(secondRefToCheck, e))
      ) {
        action()
      }
    }
    document.addEventListener(`mousedown`, handleClickOutside)
    return () => {
      document.removeEventListener(`mousedown`, handleClickOutside)
    }
  }, [ref1, ref2, action, providedRef, providedRef2])
  return [ref1, ref2]
}
