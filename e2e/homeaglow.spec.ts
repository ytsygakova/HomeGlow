import {test, expect} from '@playwright/test';

test.describe('Happy path', () => {
    test('Default voucher, valid new email and zip code', async ({page}) => {
        await page.goto('https://new-public-iwk12rtjg-homeaglow-eng.vercel.app/deal');

        // Proceed with a valid zip code and default voucher
        await page.fill('#zip-hero-zip-input', '02451');
        await page.click('#zip-hero-go-button');

        // Proceed with the default voucher
        await page.click('#zip-hero-get-clean-button');

        // Enter a new email and a valid zip code
        const timestamp = new Date().getTime();
        const randomPart = Math.random().toString(36).substring(2, 15);
        const randomEmail = `test_${randomPart}_${timestamp}@example.com`;

        await page.fill('#email-input', randomEmail);
        await page.fill('#zipcode-input', '02451');

        // Click on the button to proceed
        const getVoucherButton = page.locator('button:has-text("GET MY DISCOUNT VOUCHER") >> nth=0'); // need to make this unique
        await getVoucherButton.click();

        // Go through Review section
        const continueButton = page.locator('button:has-text("CONTINUE") >> nth=0');
        await continueButton.click();

        // Purchase using Stripe credit card
        const creditCardOption = page.locator('label:has-text("Use credit or debit card")');
        await creditCardOption.click();
        await page.fill('#cc-input', '4242 4242 4242 4242');
        await page.fill('#exp-input', '12/29'); // could be replaced with a method that puts a date in future
        await page.fill('#cvc-input', '123');
        const purchaseButton = page.locator('button:has-text("PURCHASE & SCHEDULE") >> nth=0');
        await purchaseButton.click();

        // Choose "How you heard about us" option
        await page.selectOption('select[aria-label="How did you hear about us?"]', 'Google');
        const submitButton = page.locator('button:has-text("Submit")');
        await submitButton.click();
        await expect(page.locator('#headlessui-dialog-title-\\:rd\\:')).toHaveText('Congratulations!');
    })
})
;