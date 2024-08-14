import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  useFloating,
} from '@floating-ui/react'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowForward } from 'react-icons/io'
import { IoCheckmarkSharp as CheckIcon } from 'react-icons/io5'
import type { IconType } from 'react-icons/lib'

import style from './Dropdown.module.scss'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { joinClasses } from '@/utils/joinClasses'

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}
const listVariants: Variants = {
  hidden: { opacity: 0, y: 20, pointerEvents: `none` },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto',
    transition: {
      pointerEvents: {
        delay: 0.2,
      },
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    pointerEvents: `none`,
    transition: {
      // when: 'afterChildren',
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}
const DropdownInternal = ({
  SelectedOption,
  disabled = false,
  Options,
  NullableOption = null,
  id,
}: {
  SelectedOption: React.FC
  disabled?: boolean
  Options: (JSX.Element | null)[]
  NullableOption?: JSX.Element | null
  id?: string
}): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { refs, strategy, x, y } = useFloating({
    open,
    whileElementsMounted: autoUpdate,
    strategy: `absolute`,
    placement: `bottom`,
    middleware: [
      offset({
        mainAxis: 10,
      }),
      flip({
        rootBoundary: `viewport`,
        crossAxis: false,
      }),
    ],
  })
  useOutsideClick({
    refs: [
      refs.reference as React.MutableRefObject<HTMLElement | null>,
      refs.floating,
    ],
    action: () => setOpen(false),
  })
  return (
    <>
      <div
        id={id ?? ''}
        data-open={open}
        data-role="dropdown-menu"
        className={style.inner}
        ref={refs.setReference}
        onClick={(e) => {
          console.log('clicked')
          if (disabled) return
          setOpen(!open)
        }}
      >
        <div className={style.selectedOptionWrapper}>
          <SelectedOption />
        </div>
        <div className={style.arrow}>
          <IoIosArrowDown />
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <FloatingPortal>
            <motion.section
              ref={refs.setFloating}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: strategy,
                left:
                  (refs.reference.current?.getBoundingClientRect().left ?? 0) -
                  10,
                top: y,
                width: 'fit-content',
                // refs.reference.current?.getBoundingClientRect().width ?? 0,
              }}
              className={joinClasses(style.list, 'dropdown-list')}
              onClick={() => setOpen(false)}
            >
              <DropdownOptions
                Options={Options}
                setOpen={setOpen}
                NullableOption={NullableOption}
              />
            </motion.section>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}
const Dropdown = React.memo(DropdownInternal)

const DropdownOptionsInternal: React.FC<{
  Options: (JSX.Element | null)[]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  NullableOption: JSX.Element | null
}> = ({ Options, setOpen, NullableOption }) => {
  if (Options.length > 0 || NullableOption) {
    return [NullableOption, ...Options]
  }
  return (
    <div
      data-role="dropdown-item"
      onClick={() => {
        setOpen(false)
      }}
    >
      <div>
        <p>No Options</p>
      </div>
    </div>
  )
}
const DropdownOptions = React.memo(DropdownOptionsInternal)

export const Item: React.FC<{
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  Icon?: IconType
  label1?: string
  label2?: string
  isChecked?: boolean
  id?: string
  children?: React.ReactNode
}> = ({ onClick, Icon, label1, label2, isChecked, children, id }) => {
  return (
    <motion.div
      key={label1}
      variants={itemVariants}
      transition={{
        type: `spring`,
        stiffness: 500,
        damping: 30,
      }}
      onClick={(e) => {
        onClick(e)
      }}
      data-role="dropdown-item"
      data-checked={!!isChecked}
      className={style.item}
      id={id ?? ''}
    >
      {children ? (
        children
      ) : (
        <>
          <div>
            {Icon ? <Icon /> : null}
            <p>{label1}</p>
            <span>{label2}</span>
          </div>
          <CheckIcon className={style.checkIcon} />
        </>
      )}
    </motion.div>
  )
}

const SubMenu = ({
  SelectedOption,
  Options,
  NullableOption = null,
  id,
}: {
  SelectedOption: React.FC
  disabled?: boolean
  Options: (JSX.Element | null)[]
  NullableOption?: JSX.Element | null
  id?: string
}): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false)
  return (
    <motion.div
      id={id ?? ''}
      data-open={open}
      data-role="dropdown-sub-menu"
      className={style.subMenu}
      style={{
        position: 'relative',
      }}
      onPointerOver={() => setOpen(true)}
      onPointerOut={() => setOpen(false)}
      variants={itemVariants}
      transition={{
        type: `spring`,
        stiffness: 500,
        damping: 30,
      }}
    >
      <div className={style.selectedOptionWrapper}>
        <SelectedOption />
      </div>
      <div className={style.arrow}>
        <IoIosArrowForward />
      </div>
      <AnimatePresence>
        {open && (
          <motion.section
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={joinClasses(
              style.list,
              style.subMenuList,
              'dropdown-list',
            )}
            onClick={() => setOpen(false)}
          >
            <DropdownOptions
              Options={Options}
              setOpen={setOpen}
              NullableOption={NullableOption}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const exports = {
  Menu: Dropdown,
  Item,
  SubMenu,
}
export default exports
