import { test, expect } from "@playwright/test"
import { NavigationPage } from "../page-objects/navigationPage"
import { formLayoutsPage } from "../page-objects/formLayoutsPage"

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/")
})



test("Navigate to Form Page", async ({ page }) => {
    const navigateTo = new NavigationPage(page)

    await navigateTo.formLayoutsPage()
    await navigateTo.datepickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()
})

test("Parametrized methods", async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const onFormLayoutsPage = new formLayoutsPage(page)

    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption("test@mail.com", "Test123!", "Option 1")
    await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox("John Test", "mail@test.com", true)
})