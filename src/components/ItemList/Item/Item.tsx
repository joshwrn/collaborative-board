'use client'
import type { FC } from 'react'
import React from 'react'
import { match, P } from 'ts-pattern'

import { useStore } from '@/state/gen-state'
import type { Item, ItemBody } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'
import { useIsInViewport } from '@/utils/useIsInViewport'

import styles from './Item.module.scss'

const matchBody = (body?: ItemBody): JSX.Element | JSX.Element[] | null => {
  return match(body?.content)
    .with(P.string, (value) => (
      <p>
        {value.substring(0, 90)}
        {value.length > 90 && `...`}
      </p>
    ))
    .otherwise(() => <p>...</p>)
}

const ItemInternal: FC<{
  item: Item
  isOpen: boolean
  isGeneratingCanvas: boolean
}> = ({ item, isOpen, isGeneratingCanvas }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInViewport = useIsInViewport(ref)
  const state = useStore([`toggleOpenWindow`, `openContextMenu`, `setState`])
  const canvas = item.body.find((body) => body.type === `canvas`)?.content
  if (!canvas) {
    return null
  }
  return (
    <div
      ref={ref}
      className={joinClasses(styles.wrapper, isOpen && styles.isOpenWrapper)}
      onClick={() => state.toggleOpenWindow(item.id)}
      onMouseEnter={() =>
        state.setState((draft) => {
          draft.hoveredItem = item.id
        })
      }
      onMouseLeave={() =>
        state.setState((draft) => {
          draft.hoveredItem = null
        })
      }
      onContextMenu={(e) => {
        e.preventDefault()
        state.openContextMenu({ elementType: `item`, id: item.id })
      }}
    >
      {isInViewport && (
        <>
          {isGeneratingCanvas && <div className="loadingShimmer" />}
          <div
            className={styles.img}
            style={{
              backgroundImage: `url("${canvas.base64}")`,
            }}
          />

          <div className={styles.text}>
            <h1>{item.subject}</h1>
            {matchBody(item.body[0])}
          </div>
        </>
      )}
    </div>
  )
}

export const ItemComponent = React.memo(ItemInternal)
