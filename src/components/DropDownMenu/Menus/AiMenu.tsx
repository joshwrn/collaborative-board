import React from 'react'
import style from '../DropDownMenu.module.scss'

import { useStore } from '@/state/gen-state'
import Dropdown from '@/ui/Dropdown'

export const AIMenu = () => {
  const state = useStore(['fal_num_inference_steps', 'setState'])
  const ref = React.useRef(null)
  return (
    <Dropdown.Menu
      id="dropdown-ai-button"
      SelectedOption={() => <p>AI</p>}
      Options={[
        <Dropdown.Item
          key={'Create (Custom)'}
          onClick={() => {}}
          isChecked={false}
        >
          <form
            ref={ref}
            className={style.customCreate}
            onSubmit={(e) => e.preventDefault()}
          >
            <p>Set AI Quality (</p>
            <input
              onClick={(e) => e.stopPropagation()}
              type="number"
              value={state.fal_num_inference_steps}
              onChange={(e) =>
                state.setState((draft) => {
                  draft.fal_num_inference_steps = Number(e.target.value)
                })
              }
              max={200}
              min={1}
            />
            <p>)</p>
          </form>
        </Dropdown.Item>,
      ]}
    />
  )
}
