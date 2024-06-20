import { test, expect, Locator } from '@playwright/test'
import { SPACE_ATTRS } from '@/state/space'
import { WINDOW_ATTRS } from '@/state/windows'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('can resize window', () => {
  let selected_window: Locator
  let window_id: string

  const SCALED = {
    max: WINDOW_ATTRS.maxSize * SPACE_ATTRS.default.zoom,
    min: WINDOW_ATTRS.minSize * SPACE_ATTRS.default.zoom,
    default: {
      width: WINDOW_ATTRS.defaultSize.width * SPACE_ATTRS.default.zoom,
      height: WINDOW_ATTRS.defaultSize.height * SPACE_ATTRS.default.zoom,
    },
  }

  const MOVE = {
    step1: 0,
    step2: 500,
  }

  const getBox = async () => {
    const box = await selected_window.boundingBox()
    if (!box) {
      throw new Error('No bounding box')
    }
    return box
  }

  test.beforeEach(async ({ page }) => {
    await page.locator('#dropdown-create-mocks-button').click()
    await page.locator('#dropdown-create-mocks-1').click()

    selected_window = page.locator('.window').first()
    const window_id_full = await selected_window.getAttribute('id')
    window_id = window_id_full?.split('window-')[1] ?? ''
  })

  // y
  test('resize larger from top', async ({ page }) => {
    await page.locator(`#window-border-draggable-top-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.height).toBe(SCALED.default.height)
    const bottom_y = box.y + box.height

    await page.mouse.move(box.x + box.width / 2, box.y - MOVE.step1)
    await page.mouse.move(box.x + box.width / 2, box.y - MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.height).toBe(SCALED.max)
    const after_bottom_y = after_box.y + after_box.height
    expect(after_bottom_y).toBe(bottom_y)
    const difference = SCALED.max - box.height
    expect(after_box.y).toBe(box.y - difference)
    expect(after_box.x).toBe(box.x)
    expect(after_box.width).toBe(box.width)
  })

  test('resize smaller from top', async ({ page }) => {
    await page.locator(`#window-border-draggable-top-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.height).toBe(SCALED.default.height)
    const bottom_y = box.y + box.height

    await page.mouse.move(box.x + box.width / 2, box.y + MOVE.step1)
    await page.mouse.move(box.x + box.width / 2, box.y + MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.height).toBe(SCALED.min)
    const after_bottom_y = after_box.y + after_box.height
    expect(after_bottom_y).toBe(bottom_y)
    const difference = box.height - SCALED.min
    expect(after_box.y).toBe(box.y + difference)
    expect(after_box.x).toBe(box.x)
    expect(after_box.width).toBe(box.width)
  })

  test('resize larger from bottom', async ({ page }) => {
    await page.locator(`#window-border-draggable-bottom-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.height).toBe(SCALED.default.height)

    await page.mouse.move(box.x + box.width / 2, box.y + box.height + MOVE.step1)
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.height).toBe(SCALED.max)
    expect(after_box.y).toBe(box.y)
    expect(after_box.x).toBe(box.x)
    expect(after_box.width).toBe(box.width)
  })

  test('resize smaller from bottom', async ({ page }) => {
    await page.locator(`#window-border-draggable-bottom-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.height).toBe(SCALED.default.height)

    await page.mouse.move(box.x + box.width / 2, box.y + box.height - MOVE.step1)
    await page.mouse.move(box.x + box.width / 2, box.y + box.height - MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.height).toBe(SCALED.min)
    expect(after_box.y).toBe(box.y)
    expect(after_box.x).toBe(box.x)
    expect(after_box.width).toBe(box.width)
  })

  // x
  test('resize larger from left', async ({ page }) => {
    await page.locator(`#window-border-draggable-left-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.width).toBe(SCALED.default.width)
    const right_x = box.x + box.width

    await page.mouse.move(box.x - MOVE.step1, box.y + box.height / 2)
    await page.mouse.move(box.x - MOVE.step2, box.y + box.height / 2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.width).toBe(SCALED.max)
    const after_right_x = after_box.x + after_box.width
    expect(after_right_x).toBe(right_x)
    const difference = SCALED.max - box.width
    expect(after_box.x).toBe(box.x - difference)
    expect(after_box.y).toBe(box.y)
    expect(after_box.height).toBe(box.height)
  })

  test('resize smaller from left', async ({ page }) => {
    await page.locator(`#window-border-draggable-left-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.width).toBe(SCALED.default.width)
    const right_x = box.x + box.width

    await page.mouse.move(box.x + MOVE.step1, box.y + box.height / 2)
    await page.mouse.move(box.x + MOVE.step2, box.y + box.height / 2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.width).toBe(SCALED.min)
    const after_right_x = after_box.x + after_box.width
    expect(after_right_x).toBe(right_x)
    const difference = box.width - SCALED.min
    expect(after_box.x).toBe(box.x + difference)
    expect(after_box.y).toBe(box.y)
    expect(after_box.height).toBe(box.height)
  })

  test('resize larger from right', async ({ page }) => {
    await page.locator(`#window-border-draggable-right-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.width).toBe(SCALED.default.width)

    await page.mouse.move(box.x + box.width + MOVE.step1, box.y + box.height / 2)
    await page.mouse.move(box.x + box.width + MOVE.step2, box.y + box.height / 2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.width).toBe(SCALED.max)
    expect(after_box.x).toBe(box.x)
    expect(after_box.y).toBe(box.y)
    expect(after_box.height).toBe(box.height)
  })

  test('resize smaller from right', async ({ page }) => {
    await page.locator(`#window-border-draggable-right-${window_id}`).hover()
    await page.mouse.down()
    const box = await getBox()
    expect(box.width).toBe(SCALED.default.width)

    await page.mouse.move(box.x + box.width - MOVE.step1, box.y + box.height / 2)
    await page.mouse.move(box.x + box.width - MOVE.step2, box.y + box.height / 2)
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.width).toBe(SCALED.min)
    expect(after_box.x).toBe(box.x)
    expect(after_box.y).toBe(box.y)
    expect(after_box.height).toBe(box.height)
  })

  // xy
  test('resize larger from top-left', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(box_before.x, box_before.y)
    await page.mouse.down()
    const box = await getBox()
    const right_x = box.x + box.width
    const bottom_y = box.y + box.height

    await page.mouse.move(box.x - MOVE.step1, box.y - MOVE.step1)
    await page.mouse.move(box.x - MOVE.step2, box.y - MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    const after_right_x = after_box.x + after_box.width
    const after_bottom_y = after_box.y + after_box.height
    expect(after_right_x).toBe(right_x)
    expect(after_bottom_y).toBe(bottom_y)
    const difference = SCALED.max - box.width
    expect(after_box.x).toBe(box.x - difference)
    const difference_y = SCALED.max - box.height
    expect(after_box.y).toBe(box.y - difference_y)
    expect(after_box.width).toBe(SCALED.max)
    expect(after_box.height).toBe(SCALED.max)
  })

  test('resize smaller from top-left', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(box_before.x, box_before.y)
    await page.mouse.down()
    const box = await getBox()
    const right_x = box.x + box.width
    const bottom_y = box.y + box.height

    await page.mouse.move(box.x + MOVE.step1, box.y + MOVE.step1)
    await page.mouse.move(box.x + MOVE.step2, box.y + MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    const after_right_x = after_box.x + after_box.width
    const after_bottom_y = after_box.y + after_box.height
    expect(after_right_x).toBe(right_x)
    expect(after_bottom_y).toBe(bottom_y)
    const difference = box.width - SCALED.min
    expect(after_box.x).toBe(box.x + difference)
    const difference_y = box.height - SCALED.min
    expect(after_box.y).toBe(box.y + difference_y)
    expect(after_box.width).toBe(SCALED.min)
    expect(after_box.height).toBe(SCALED.min)
  })

  test('resize larger from top-right', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(box_before.x + box_before.width, box_before.y)
    await page.mouse.down()
    const box = await getBox()
    const bottom_y = box.y + box.height

    await page.mouse.move(box.x + box.width + MOVE.step1, box.y - MOVE.step1)
    await page.mouse.move(box.x + box.width + MOVE.step2, box.y - MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    const after_bottom_y = after_box.y + after_box.height
    expect(after_bottom_y).toBe(bottom_y)
    expect(after_box.x).toBe(box.x)
    expect(after_box.y).toBe(box.y - (SCALED.max - box.height))
    expect(after_box.width).toBe(SCALED.max)
    expect(after_box.height).toBe(SCALED.max)
  })

  test('resize smaller from top-right', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(box_before.x + box_before.width, box_before.y)
    await page.mouse.down()
    const box = await getBox()
    const bottom_y = box.y + box.height

    await page.mouse.move(box.x + box.width - MOVE.step1, box.y + MOVE.step1)
    await page.mouse.move(box.x + box.width - MOVE.step2, box.y + MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    const after_bottom_y = after_box.y + after_box.height
    expect(after_bottom_y).toBe(bottom_y)
    expect(after_box.x).toBe(box.x)
    expect(after_box.y).toBe(box.y + (box.height - SCALED.min))
    expect(after_box.width).toBe(SCALED.min)
    expect(after_box.height).toBe(SCALED.min)
  })

  test('resize larger from bottom-right', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(
      box_before.x + box_before.width,
      box_before.y + box_before.height,
    )
    await page.mouse.down()
    const box = await getBox()

    await page.mouse.move(
      box.x + box.width + MOVE.step1,
      box.y + box.height + MOVE.step1,
    )
    await page.mouse.move(
      box.x + box.width + MOVE.step2,
      box.y + box.height + MOVE.step2,
    )
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.x).toBe(box.x)
    expect(after_box.y).toBe(box.y)
    expect(after_box.width).toBe(SCALED.max)
    expect(after_box.height).toBe(SCALED.max)
  })

  test('resize smaller from bottom-right', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(
      box_before.x + box_before.width,
      box_before.y + box_before.height,
    )
    await page.mouse.down()
    const box = await getBox()

    await page.mouse.move(
      box.x + box.width - MOVE.step1,
      box.y + box.height - MOVE.step1,
    )
    await page.mouse.move(
      box.x + box.width - MOVE.step2,
      box.y + box.height - MOVE.step2,
    )
    await page.mouse.up()

    const after_box = await getBox()
    expect(after_box.x).toBe(box.x)
    expect(after_box.y).toBe(box.y)
    expect(after_box.width).toBe(SCALED.min)
    expect(after_box.height).toBe(SCALED.min)
  })

  test('resize larger from bottom-left', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(box_before.x, box_before.y + box_before.height)
    await page.mouse.down()
    const box = await getBox()
    const right_x = box.x + box.width

    await page.mouse.move(box.x - MOVE.step1, box.y + box.height + MOVE.step1)
    await page.mouse.move(box.x - MOVE.step2, box.y + box.height + MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    const after_right_x = after_box.x + after_box.width
    expect(after_right_x).toBe(right_x)
    expect(after_box.x).toBe(box.x - (SCALED.max - box.width))
    expect(after_box.y).toBe(box.y)
    expect(after_box.width).toBe(SCALED.max)
    expect(after_box.height).toBe(SCALED.max)
  })

  test('resize smaller from bottom-left', async ({ page }) => {
    const box_before = await getBox()
    await page.mouse.move(box_before.x, box_before.y + box_before.height)
    await page.mouse.down()
    const box = await getBox()
    const right_x = box.x + box.width

    await page.mouse.move(box.x + MOVE.step1, box.y + box.height - MOVE.step1)
    await page.mouse.move(box.x + MOVE.step2, box.y + box.height - MOVE.step2)
    await page.mouse.up()

    const after_box = await getBox()
    const after_right_x = after_box.x + after_box.width
    expect(after_right_x).toBe(right_x)
    expect(after_box.x).toBe(box.x + (box.width - SCALED.min))
    expect(after_box.y).toBe(box.y)
    expect(after_box.width).toBe(SCALED.min)
    expect(after_box.height).toBe(SCALED.min)
  })
})
