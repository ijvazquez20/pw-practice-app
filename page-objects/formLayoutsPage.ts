import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class formLayoutsPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', { hasText: "Using the Grid" })

        await usingTheGridForm.getByRole('textbox', { name: "Email" }).fill(email)
        await usingTheGridForm.getByRole('textbox', { name: "Password" }).fill(password)
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true })
        await usingTheGridForm.getByRole('button').click()
    }

    /**
     * This method will fill out the Inline Form with the name, email and checkbox.
     * @param name - Name of the user. First and Last Name.
     * @param email - Email of the user. Must be a valid email address.
     * @param checkbox - True or false.
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, checkbox: boolean){
        const usingInlineForm = this.page.locator('nb-card', { hasText: "Inline form" })

        await usingInlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(name)
        await usingInlineForm.getByRole('textbox', { name: "Email" }).fill(email)

        if (checkbox){
            await usingInlineForm.getByRole('checkbox').check({ force: true })
        }

        await usingInlineForm.getByRole('button').click()

    }
}