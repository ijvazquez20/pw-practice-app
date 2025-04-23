import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/")
})



test("Navigate to Form Page", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test("Parametrized methods", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption("test@mail.com", "Test123!", "Option 1")
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox("John Test", "mail@test.com", true)

    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().setCommonDatePickerDateFromToday(5)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(5, 10)
})