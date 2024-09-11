import React from 'react'

import { type FalSettingsNode, falSettingsSchema } from '@/state/fal'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'
import { DraggableWindowWrapper } from '@/ui/DraggableWindowWrapper'
import { Slider } from '@/ui/Slider'
import Modal from '@/ui/TopBarModal'
import { joinClasses } from '@/utils/joinClasses'

import { NodeConnections } from './NodeConnections'
import styles from './SettingsNode.module.scss'

const SettingsNode_Internal: React.FC<{
  node: FalSettingsNode
  window: WindowType
}> = ({ node, window }) => {
  const state = useStore([`setState`, `updateFalSettingsNode`, `reorderWindows`])

  const nodeRef = React.useRef<HTMLDivElement>(null)

  return (
    <DraggableWindowWrapper window={window} nodeRef={nodeRef}>
      <div
        className={styles.wrapper}
        style={{
          top: window.y,
          left: window.x,
          height: window.height,
          width: window.width,
        }}
        ref={nodeRef}
      >
        <div
          className={joinClasses(`modal`, styles.inner)}
          id={`settings-node-${node.id}`}
          onMouseEnter={() => {
            state.setState((draft) => {
              draft.hoveredWindow = node.id
            })
          }}
          onMouseLeave={() => {
            state.setState((draft) => {
              draft.hoveredWindow = null
            })
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onPointerDown={() => {
            state.setState((draft) => {
              draft.selectedWindow = node.id
            })
            state.reorderWindows(node.id)
          }}
        >
          <Modal.Header title="AI Settings" className="handle">
            <Modal.Button onClick={() => {}}>Delete</Modal.Button>
          </Modal.Header>
          <Modal.Content className={styles.content}>
            <Slider
              description={
                falSettingsSchema.shape.num_inference_steps.description
              }
              label="Inference Steps"
              step="1"
              value={node.num_inference_steps}
              min={falSettingsSchema.shape.num_inference_steps.minValue}
              max={falSettingsSchema.shape.num_inference_steps.maxValue}
              onChange={(value) => {
                state.updateFalSettingsNode(node.id, {
                  num_inference_steps: value,
                })
              }}
            />
            <Slider
              description={falSettingsSchema.shape.guidance_scale.description}
              label="Guidance Scale"
              step={0.5}
              value={node.guidance_scale}
              min={falSettingsSchema.shape.guidance_scale.minValue}
              max={falSettingsSchema.shape.guidance_scale.maxValue}
              onChange={(value) => {
                state.updateFalSettingsNode(node.id, {
                  guidance_scale: value,
                })
              }}
            />
            <Slider
              description={falSettingsSchema.shape.strength.description}
              label="Strength"
              value={node.strength}
              min={falSettingsSchema.shape.strength.minValue}
              max={falSettingsSchema.shape.strength.maxValue}
              onChange={(value) => {
                state.updateFalSettingsNode(node.id, {
                  strength: value,
                })
              }}
            />
          </Modal.Content>
        </div>
        <NodeConnections />
      </div>
    </DraggableWindowWrapper>
  )
}

const SettingsNode = React.memo(SettingsNode_Internal)

export const SettingsNodes: React.FC = () => {
  const state = useStore([`falSettingsNodes`, `windows`])
  return (
    <>
      {state.falSettingsNodes.map((node) => {
        const window = state.windows.find((w) => w.id === node.id)
        if (!window) return null
        return <SettingsNode key={node.id} node={node} window={window} />
      })}
    </>
  )
}
