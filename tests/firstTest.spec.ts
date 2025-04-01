import { test, expect } from "@playwright/test"; // Import from the correct location

/* Base test Function 
test('The first Test.', () => {
      
})
*/

/* Base test Suite 
test.describe('Test Suite 1', () => {

        test('The first Test.', () => {
      
        })
      
        test('The second Test.', () => {
      
        })
      
        test('The third Test.', () => {
      
        })
})
*/

/* Base Before Hook 
test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:4200/")
        await page.getByText("Forms").click()
})
*/

/* Before each Suite
test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:4200/")
        await page.getByText("Forms").click()
        await page.getByText("Form Layout").click()
})


// Suite 1
test.describe("Suite 1", () => {
        //Before each Test
        test.beforeEach(async ({ page }) => {
                await page.getByText("Forms").click()
        })
      
        // Test 1
        test("The first Test", async ({ page }) => {
                await page.getByText("Form Layout").click()
        })
      
        // Test 2
        test("Navigate to Datepicker page", async ({ page }) => {
                await page.getByText("Datepicker").click()
        })
})
*/

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layout").click();
});

test("Locator Syntax Rules", async ({ page }) => {
    // by Tag name []
    page.locator("input"); //This returns all the locators with the 'input' Tag.
    // await page.locator('input').click() //This attempts to click all the locators with the 'input' Tag and fails.
    // await page.locator('input').first().click() //This attempts to click the FIRST of all the locators with the 'input' Tag.

    // by ID [#]
    page.locator("#inputEmail1");

    // by Class value [.]
    page.locator(".shape-rectangle");

    // by Attribute [[]]
    page.locator('[placeholder="Email"]');

    // by Full Class value [[class=]]
    page.locator(
        '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
    );

    // Combine different Selectors [x+x]
    page.locator('input[placeholder="Email"]'); //Ex: Tag name and Attribute. All together, no spaces in between each other.

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]');

    // by Partial Text Match [:text("x")]
    page.locator(':text("Using")');

    //by Exact Text Match [:text-is("x")]
    page.locator(':text-is("Using the Grid")');
});

test("User Facing Locators", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).first().click();
    await page.getByRole("button", { name: "Sign in" }).first().click();

    await page.getByLabel("Email").first().click();

    await page.getByPlaceholder("Jane Doe").click();

    await page.getByText("Using the Grid").click();

    await page.getByTestId("SignIn").click();

    await page.getByTitle("IoT Dashboard").click();
});

test("Locating Child Elements", async ({ page }) => {
    // parent+child+locator all separated by spaces.
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();

    // Same as above but individual locator methods.
    await page
        .locator("nb-card")
        .locator("nb-radio")
        .locator(':text-is("Option 2")')
        .click();

    // Combining Syntax locators with User Facing locators.
    await page
        .locator("nb-card")
        .getByRole("button", { name: "Sign in" })
        .first()
        .click();

    // Using index [.nth()] to select the 4th nb-card. (Not Recommended)
    await page.locator("nb-card").nth(3).getByRole("button").click();
});

test("Locating Parent Elements", async ({ page }) => {
    // Using [hasText:"x"] to find the one nb-card that has that text. Returns only one element instead of all the nb-card elements.
    await page
        .locator("nb-card", { hasText: "Using the Grid" })
        .getByRole("textbox", { name: "Email" })
        .click();

    // Using [has: locator] to find the one nb-card that has that locator. FIRST we get the card, THEN we get the email field and click it.
    await page
        .locator("nb-card", { has: page.locator("#inputEmail1") })
        .getByRole("textbox", { name: "Email" })
        .click();

    // Same as using the [hasText:"x"] as an argument of the locator(). Instead using the filter()
    await page
        .locator("nb-card")
        .filter({ hasText: "Basic Form" })
        .getByRole("textbox", { name: "Email" })
        .click();

    // Same as using [has: locator] as an argument of the locator(). In this case, using the '.status-danger' to find a button.
    await page
        .locator("nb-card")
        .filter({ has: page.locator(".status-danger") })
        .getByRole("textbox", { name: "Password" })
        .click();

    // Using a combnination of filters to further specify the search. FIRST we look for all the nb-cards, THEN only the ones that have a nb-checkbox element
    // THEN only the one element that has the "Sign in" text.
    await page
        .locator("nb-card")
        .filter({ has: page.locator("nb-checkbox") })
        .filter({ hasText: "Sign in" })
        .getByRole("textbox", { name: "Email" })
        .click();

    // Using the [locator('..')] to find the parent of the returned element. FIRST we look for the element that has the "Using the Grid" text.
    // THEN, we go up one level to that element's parent to get the entire nb-card element.
    await page
        .locator(':text-is("Using the Grid")')
        .locator("..")
        .getByRole("textbox", { name: "Email" })
        .click();
});

test("Reusing Locators", async ({ page }) => {
    // The initial filter of the "Basic Form" nb-card.
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" });

    // The secondary filter findind the "Email" field on the first Const.
    const emailField = basicForm.getByRole("textbox", { name: "Email" });

    // Using the Const to fill in the field.
    await emailField.fill("test@test.com");

    await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
    await basicForm.locator("nb-checkbox").click();
    await basicForm.getByRole("button").click();

    await expect(emailField).toHaveValue("test@test.com");
});

test("Extracting Values", async ({ page }) => {
    // Single text value
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" });
    const buttonText = await basicForm.locator("button").textContent();
    expect(buttonText).toEqual("Submit");

    // All text values
    const allRadioButtonLabels = await page.locator("nb-radio").allTextContents();
    expect(allRadioButtonLabels).toContain("Option 1");

    // Input text value. (A value that was entered by the user and doesn't exist locally on the page.)
    const emailField = basicForm.getByRole("textbox", { name: "Email" });
    await emailField.fill("test@test.com");

    const emailValue = await emailField.inputValue(); // inputValue() gets the value that was entered on the field.
    expect(emailValue).toEqual("test@test.com");

    // Attribute value. (In this case, the 'placeholder' attribute.)
    const placeholderValue = await emailField.getAttribute("placeholder");
    expect(placeholderValue).toEqual("Email");
});

test("Assertions", async ({ page }) => {
    const basicFormButton = page
        .locator("nb-card")
        .filter({ hasText: "Basic Form" })
        .locator("button");

    // General Assertions. [expect(whatever value you locate).toX(whatever value it should be)]
    const value = 5;
    expect(value).toEqual(5);

    const buttonText = await basicFormButton.textContent();
    expect(buttonText).toEqual("Submit");

    // Locator Assertions.
    await expect(basicFormButton).toHaveText("Submit");

    // Soft Assetions. Allows the test to continue even if the assertion fails.
    await expect.soft(basicFormButton).toHaveText("Submit");
    await basicFormButton.click();
});
