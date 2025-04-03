import { test, expect } from "@playwright/test";


test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
})

test.describe("Form Layouts Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click()
        await page.getByText("Form Layout").click()
    })

    test("Input Fields", async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInput.fill("test@test.com")  // Fill the input field with a value
        await usingTheGridEmailInput.clear()  // Clear the input field
        await usingTheGridEmailInput.pressSequentially("test2@test.com", { delay: 100 })  // Press the keys in sequence, optionally including a delay between each key press.


        // Generic Assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual("test2@test.com")

        // Locator Assertion
        await expect(usingTheGridEmailInput).toHaveValue("test2@test.com")
    })

    test("Radio Buttons", async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })

        //await usingTheGridForm.getByLabel("Option 1").check({force: true})  // Select the radio button. The button has a visually-hidden class, so we need to force the check.
        await usingTheGridForm.getByRole("radio", { name: "Option 1" }).check({ force: true })  // Select the radio button using the role locator.


        // Generic Assertion
        const radioStatus = await usingTheGridForm.getByLabel("Option 1").isChecked()  // Using the isChecked() method. Returns a boolean value.
        expect(radioStatus).toBeTruthy()  // Assert if  'radioStatus' is true.    

        // Locator Assertion
        await expect(usingTheGridForm.getByRole("radio", { name: "Option 1" })).toBeChecked()  // Assert if the radio button is checked.
        await expect(usingTheGridForm.getByRole("radio", { name: "Option 1" })).to  // Assert if the radio button is checked.

        // Select another radio button and validate the first one is unchecked.
        await usingTheGridForm.getByRole("radio", { name: "Option 2" }).check({ force: true })  // Select the radio button 2. This will uncheck the radio button 1.

        expect(await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy()  // Assert if the radio button 1 is unchecked.
        expect(await usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy()  // Assert if the radio button 1 is unchecked.
    })
})