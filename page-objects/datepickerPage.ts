import { Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatepickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async setCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder("Form Picker")
        await calendarInputField.click()
        
        // Selects the date on the calendar.
        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday) 
        
        // Verify the selected date is displayed correctly on the field.
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startFromToday: number, endFromToday: number){
        const calendarInputField = this.page.getByPlaceholder("Range Picker")
        await calendarInputField.click()

        const dateToAssertStart = await this.selectDateInCalendar(startFromToday) 
        const dateToAssertEnd = await this.selectDateInCalendar(endFromToday) 
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        expect(calendarInputField).toHaveValue(dateToAssert)

    }

    async selectDateInCalendar(numberOfDaysFromToday: number){
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday) // Gets the day of the month, i.e: April [10] and adds 100 days to it.

        const expectedDate = date.getDate().toString() // Make JUST THE DAY, not the entire date, into a String. [10]
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' }) // Gets the Month of the date, abreviated. [Apr]
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' }) // Gets the Month of the date, full name. [April]
        const expectedYear = date.getFullYear().toString() // Gets the Year of the date. [2025]
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` // Puts them all together: Apr 10, 2025

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() // Gets the element on the calendar
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} ` // Creates a const of the full month and year: April 2025

        // If the current month displayed on the Calendar doesn't match the month we set on the 'date' variable, it clicks the > to move to the next month
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        // Searches for 'class' first in order to avoid selecting a date from a previous month.
        // {exact: true} is used to look for the exact match and avoid selecting other elements that contain "1", like 10, 11, 12, etc.
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click()
        return dateToAssert
    }
}
