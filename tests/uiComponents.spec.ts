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
    await page.getByRole("checkbox", { name: "Hide on Click" }).click({ force: true })

    // check() makes sure it is checked. It check the status first. If its already checked it does nothing.
    await page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" }).check({ force: true })

    // uncheck() is the same as check() but with uncheck.
    await page.getByRole("checkbox", { name: "Hide on Click" }).uncheck({ force: true })

    // Check all checkboxes on the page
    const allBoxes = page.getByRole("checkbox") // Gets all checkboxes and puts then in a const.
    for (const box of await allBoxes.all()) {    // Loops thru all of them and checks every single one.
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy() // Validates that the checkoxes are checked.
    }

})

test("Lists and Dropdowns", async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    /*
    page.getByRole("list") // Used for <ul> tags.
    page.getByRole("listitem") // Used for <li> tags.

    In this example, there is a <ul> but there are no <li>, instead the page has <nb-option> elements
    Since there are not <li>, instead of using a Role Locator, we use a regular Locator. 
    */

    // First we get the parent <ul> by Role, then get all the <nb-option> children
    const optionList = page.getByRole("list").locator('nb-option')

    // We validate the optionList contains all the expected values.
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

    // Select the "Cosmic" option and click() on it.
    await optionList.filter({ hasText: "Cosmic" }).click()

    // Checks the background color of the Header in order to verify the "Cosmic" option was selected.
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    // Thi is an example of how you would iterate thru all the colors on the dropdown.
    // const colors = {
    //     "Light": "rgb(10, 10, 10)",
    //     "Dark": "rgb(20, 20, 20)"
    // }

    // // console.log(colors)

    // for(const color in colors){
    //     console.log(color)
    //     console.log(colors[color])
    // }

})

test("Tooltips", async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Tooltip").click()

    // Gets the Card element that contains the button that holds the tooltip
    const tooltipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })

    // Hover over the TOP button to show the tooltip
    await tooltipCard.getByRole('button', { name: "Top" }).hover()

    // This would be valid if the'tooltip' Role existed. In this case we have the 'nb-tooltip' Locator.
    //page.getByRole('tooltip') 

    // Gets the 'nb-tooltip' Locator
    const tooltip = await page.locator('nb-tooltip').textContent()

    // This doesn't work because the tooltip is not inside the tooltipCard. Is in an overlay.
    //const tooltip2 = await tooltipCard.locator('nb-tooltip').textContent()

    // Verify that the tooltip has the correct text.
    expect(tooltip).toContain("This is a tooltip")

})

test("Dialog Boxes", async ({ page }) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    // In order to handle a Browser Dialog Box, we need to add a listener [.on()] to the browser before the Box appears.
    page.on('dialog', async dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?') // Validates the Box is the correct one.
        await dialog.accept() // Accepts the Box.
    })

    // Finds the 'Trash' icon button of the first row and clicks it.
    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()

    // Validates the deleted row is no longer there by checking the first row on the table.
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")

})

test("Web Tables", async ({ page }) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    // 1) Get one entire row by unique locator(email) on that row
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })

    // Click on the Edit button of that row
    await targetRow.locator('.nb-edit').click()

    // Gets the Input field by the "Age" placeholder text. Clears it and a fills in "35"
    await page.locator('input-editor').getByPlaceholder("Age").clear()
    await page.locator('input-editor').getByPlaceholder("Age").fill("35")

    // Clicks on the Checkmark button to save the changes.
    await page.locator('.nb-checkmark').click()

    // 2) Get one row based on the value (not unique) of an specific column field
    // Selects the "2" pagination button to move to the second page
    await page.locator('.ng2-smart-pagination-nav').locator('li', { hasText: "2" }).click()

    const targetRowByID =
        page.getByRole('row', { name: "11" }) // This returns two rows in this case, so we need to filter it.
            .filter({
                has: page.locator('td') // On all the columns of each row
                    .nth(1) // On the second column(ID) of the row (because the first one is the "Actions" Column.)
                    .getByText("11") // Finds the row that has "11" 
            })

    // Click on the Edit button of that row
    await targetRowByID.locator('.nb-edit').click()

    // Gets the Input field by the "Age" placeholder text. Clears it and a fills in "35"
    await page.locator('input-editor').getByPlaceholder("E-mail").clear()
    await page.locator('input-editor').getByPlaceholder("E-mail").fill("test@mail.com")

    // Clicks on the Checkmark button to save the changes.
    await page.locator('.nb-checkmark').click()

    // Verify the email was changed correctly.
    expect(targetRowByID.locator('td').nth(5)).toHaveText("test@mail.com")

    // 3) Test Filter functionality
    const ages = ["20", "30", "40", "200"] // Array of ages we want to look up

    for (const age of ages) { // Cycles thru each 'age' in the array
        await page.locator('input-filter').getByPlaceholder("Age").clear() // Gets the Input field by the "Age" placeholder text and clears it.
        await page.locator('input-filter').getByPlaceholder("Age").fill(age) // Fills in the current 'age' value in the loop.
        await page.waitForTimeout(500) // Implicit wait to force Playwright to wait for the filter to be applied.

        const ageRows = page.locator('tbody tr') // Get all the rows after the filter is applied. i.e: the results.

        for (const row of await ageRows.all()) { // Cycles thru each row
            const cellValue = await row.locator('td').last().textContent() // Gets the last cell value of each row. (In this case, the 'age').

            if (age == "200") { // If the 'age' use to filter is 200 and has no results.
                expect(cellValue).toContain("No data found") // We verify the message is displayed.
            } else {
                expect(cellValue).toEqual(age) // Else, we verify the current 'age' is displayed.
            }
        }
    }
})