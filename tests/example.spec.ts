import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test('can resize window', async ({ page }) => {
  await page.locator('#dropdown-create-mocks-button').click()
  await page.locator('#dropdown-create-mocks-1').click()

  const selectedWindow = page.locator('.window').first()
  const windowIdFull = await selectedWindow.getAttribute('id')
  const windowId = windowIdFull?.split('window-')[1]
  await page.locator(`#${windowIdFull}`).hover()
  console.log('id', windowId, windowIdFull)
  await page.mouse.move(0, 0)
  const border = await page
    .locator(`#window-border-draggable-top-${windowId}`)
    .hover()
  console.log('border', border)
  await page.mouse.down()
  await page.mouse.move(0, 100)
  await page.mouse.up()

  const size = await selectedWindow.boundingBox()
  expect(size?.height).toBe(1000)
})
