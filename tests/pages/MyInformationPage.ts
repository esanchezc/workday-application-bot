import { expect, type Page } from '@playwright/test';

export class MyInformationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isLoaded() {
        await expect(this.page.getByRole('heading', { name: 'My Information' })).toBeVisible({timeout: 10000})
    }

    async fillHowDidYouHearFromUs(site, country) {
        await this.page.getByLabel('How Did You Hear About Us?').click({timeout: 8000});
        await this.page.getByRole('option', { name: site, exact: true }).locator('div').click();
        await expect(this.page.getByLabel('Country/Region United States')).toHaveText(country)
    }

    async fillName(firstName: string, lastName: string) {
        await this.page.getByLabel('First Name*').fill(firstName);
        await this.page.getByLabel('Last Name*').fill(lastName);
    }

    async fillAddress(street: string, city: string, state: string, zip_code: string) {
        await this.page.getByLabel('Address Line').fill(street);
        await this.page.getByLabel('City').fill(city);
        await this.page.getByTestId('addressSection_countryRegion').click()
        await this.page.getByRole('option', { name: state, exact: true }).locator('div').click();
        await this.page.getByLabel('Postal Code').fill(zip_code);
    }

    async assertEmail(email: string) {
        await expect(this.page.locator('#input-9')).toContainText(email);
    }

    async fillPhoneNumber(phone_number: string) {
        await this.page.getByLabel('Phone Number*').fill(phone_number);
    }

    async saveAndContinue(){
        await this.page.getByRole('button', { name: 'Save and Continue' }).click();
    }
}