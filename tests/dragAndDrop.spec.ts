import { test, expect } from "@playwright/test"


test.beforeEach(async ({ page }) => {
    await page.goto("https://www.globalsqa.com/demo-site/draganddrop/")
})

test('Drag and Drop in iFrame', async ({ page }) => {
    // Switch to the iframe using the locator
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')

    // Find the element we want to drag and drag it to the trash using the 'dragTo' method
    await frame.locator('li', { hasText: "High Tatras 2" }).dragTo(frame.locator('#trash'))


    // Simulate Mouse control of the drag and drop

    await frame.locator('li', { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    // Verify the elements were dropped in the trash
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})