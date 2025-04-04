import { test, expect } from "@playwright/test"; 


test.beforeEach(async ({ page }) => {
    await page.goto("http://uitestingplayground.com/ajax");
    await page.getByText("Button Triggering AJAX Request").click();
});

test('Auto Waiting', async ({ page }) => {
    const successMessage = page.locator('.bg-success');
        // await sucessMessage.click();

    // textContent() has an autowait built in, so we don't need to use waitFor.
        //const successMessageText = await successMessage.textContent();  [THIS WORKS]
        //expect(successMessageText).toContain('Data loaded with AJAX get request.');


    // If instead we use allTextContents(), we need to use waitFor. This is because allTextContents() does not have an autowait built in.
        //const successMessageText = await successMessage.allTextContents(); [THIS FAILS]

    // With the WaitFor method:
        //await successMessage.waitFor({state: 'attached'});
        //const successMessageText = await successMessage.textContent();    
        //expect(successMessageText).toContain('Data loaded with AJAX get request.'); [NOW IT WORKS]

    // Another example using the toHaveText method directly on the assertion, with an aditional forced timeout of 20 seconds:
    await expect(successMessage).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});
    
    
});

test ('Alternative Waits', async ({ page }) => {
    const successMessage = page.locator('.bg-success');

    // Wait for Element
    await page.waitForSelector('.bg-success');

    // Wait for specific Response (any response)
        //await page.waitForResponse('http://uitestingplayground.com/ajax')

    // Wait for network calls tro be completed (NOT RECOMMENDED)
        //await page.waitForLoadState('networkidle')
    
    const successMessageText = await successMessage.textContent();    
    expect(successMessageText).toContain('Data loaded with AJAX get request.');
})

test ('Timeouts', async ({ page }) => {

    // To define Timeouts for each test, you can use the 'timeout' tag inside the defineConfig function in the playwright.config.ts file.
    // You can override the timeout for a specific test using the 'test.setTimeout(xxxxx)' method.
    // You can also use test.slow() to multiply the timeout by a factor of 3.

    // To define the Global Timeout, you can use the 'globalTimeout' tag inside the defineConfig function in the playwright.config.ts file.
    // To define the Tiemeouts for an assertion, you can use the 'timeout' tag inside the expect tag method. expect:{timeout: x}.

    const successMessage = page.locator('.bg-success');
    await successMessage.click();
})