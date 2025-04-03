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

        // Select another radio button and validate the first one is unchecked.
        await usingTheGridForm.getByRole("radio", { name: "Option 2" }).check({ force: true })  // Select the radio button 2. This will uncheck the radio button 1.

        expect(await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy()  // Assert if the radio button 1 is unchecked.
        expect(await usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy()  // Assert if the radio button 1 is unchecked.
    })
  
})

test("Checkboxes", async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()  

    // click() simply clicks the element.
    await page.getByRole("checkbox", {name: "Hide on Click"}).click({force: true})

    // check() makes sure it is checked. It check the status first. If its already checked it does nothing.
    await page.getByRole("checkbox", {name: "Prevent arising of duplicate toast"}).check({force: true})

    // uncheck() is the same as check() but with uncheck.
    await page.getByRole("checkbox", {name: "Hide on Click"}).uncheck({force: true}) 

    // Check all checkboxes on the page
    const allBoxes = page.getByRole("checkbox") // Gets all checkboxes and puts then in a const.
    for(const box of await allBoxes.all()) {    // Loops thru all of them and checks every single one.
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy() // Validates that the checkoxes are checked.
    }

})