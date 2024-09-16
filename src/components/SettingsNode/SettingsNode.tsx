import React from 'react'

import { falSettingsSchema, findFalSettings } from '@/state/fal'
import { useZ } from '@/state/gen-state'
import { findWindow } from '@/state/windows'
import { DraggableWindowWrapper } from '@/ui/DraggableWindowWrapper'
import { Slider } from '@/ui/Slider'
import Modal from '@/ui/TopBarModal'
import { joinClasses } from '@/utils/joinClasses'

import { NodeConnections } from './NodeConnections'
import styles from './SettingsNode.module.scss'

const SettingsNode_Internal: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useZ(
    (state) => ({
      window: findWindow(state.windows, id),
      node: findFalSettings(state.falSettingsNodes, id),
    }),
    [
      'setState',
      'updateFalSettingsNode',
      'reorderWindows',
      'deleteFalSettingsNode',
    ],
  )

  const nodeRef = React.useRef<HTMLDivElement>(null)

  return (
    <DraggableWindowWrapper windowId={state.window.id} nodeRef={nodeRef}>
      <div
        className={styles.wrapper}
        style={{
          top: state.window.y,
          left: state.window.x,
          height: state.window.height,
          width: state.window.width,
        }}
        ref={nodeRef}
      >
        <div
          className={joinClasses(`modal`, styles.inner)}
          id={`settings-node-${state.node.id}`}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onPointerDown={() => {
            state.setState((draft) => {
              draft.selectedWindow = state.node.id
            })
            state.reorderWindows(state.node.id)
          }}
        >
          <Modal.Header title="AI Settings" className="handle">
            <Modal.Button
              onClick={() => {
                state.deleteFalSettingsNode(state.node.id)
              }}
            >
              Delete
            </Modal.Button>
          </Modal.Header>
          <Modal.Content className={styles.content}>
            <Slider
              description={
                falSettingsSchema.shape.num_inference_steps.description
              }
              label="Inference Steps"
              step="1"
              value={state.node.num_inference_steps}
              min={falSettingsSchema.shape.num_inference_steps.minValue}
              max={falSettingsSchema.shape.num_inference_steps.maxValue}
              onChange={(value) => {
                state.updateFalSettingsNode(state.node.id, {
                  num_inference_steps: value,
                })
              }}
            />
            <Slider
              description={falSettingsSchema.shape.guidance_scale.description}
              label="Guidance Scale"
              step={0.5}
              value={state.node.guidance_scale}
              min={falSettingsSchema.shape.guidance_scale.minValue}
              max={falSettingsSchema.shape.guidance_scale.maxValue}
              onChange={(value) => {
                state.updateFalSettingsNode(state.node.id, {
                  guidance_scale: value,
                })
              }}
            />
            <Slider
              description={falSettingsSchema.shape.strength.description}
              label="Strength"
              value={state.node.strength}
              min={falSettingsSchema.shape.strength.minValue}
              max={falSettingsSchema.shape.strength.maxValue}
              onChange={(value) => {
                state.updateFalSettingsNode(state.node.id, {
                  strength: value,
                })
              }}
            />
          </Modal.Content>
        </div>
        <NodeConnections fromId={state.node.id} />
      </div>
    </DraggableWindowWrapper>
  )
}

const SettingsNode = React.memo(SettingsNode_Internal)

export const SettingsNodes: React.FC = () => {
  const state = useZ([`falSettingsNodes`], (state) => {
    return {
      falSettingsNodes: state.falSettingsNodes,
    }
  })
  return (
    <>
      {state.falSettingsNodes.map((nodeId) => {
        return <SettingsNode key={nodeId.id} id={nodeId.id} />
      })}
    </>
  )
}
