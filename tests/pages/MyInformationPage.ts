import { expect, type Page, type Locator } from '@playwright/test';

export class MyInformationPage {
    readonly page: Page;

    // Locators
    private readonly pageHeading: Locator;
    private readonly howDidYouHearDropdown: Locator;
    private readonly countryRegionField: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly addressLineInput: Locator;
    private readonly cityInput: Locator;
    private readonly countryRegionDropdown: Locator;
    private readonly postalCodeInput: Locator;
    private readonly emailField: Locator;
    private readonly phoneNumberInput: Locator;
    private readonly saveAndContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'My Information' });
        this.howDidYouHearDropdown = page.getByLabel('How Did You Hear About Us?');
        this.countryRegionField = page.getByLabel('Country/Region United States');
        this.firstNameInput = page.getByLabel('First Name*');
        this.lastNameInput = page.getByLabel('Last Name*');
        this.addressLineInput = page.getByLabel('Address Line');
        this.cityInput = page.getByLabel('City');
        this.countryRegionDropdown = page.getByTestId('addressSection_countryRegion');
        this.postalCodeInput = page.getByLabel('Postal Code');
        this.emailField = page.locator('#input-9');
        this.phoneNumberInput = page.getByLabel('Phone Number*');
        this.saveAndContinueButton = page.getByRole('button', { name: 'Save and Continue' });
    }

    async isLoaded(): Promise<void> {
        await expect(this.pageHeading).toBeVisible({ timeout: 10000 });
    }

    async fillHowDidYouHearFromUs(site: string, country: string): Promise<void> {
        await this.howDidYouHearDropdown.click({ timeout: 8000 });
        await this.page.getByRole('option', { name: site, exact: true }).locator('div').click();
        await expect(this.countryRegionField).toHaveText(country);
    }

    async fillName(firstName: string, lastName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
    }

    async fillAddress(street: string, city: string, state: string, zipCode: string): Promise<void> {
        await this.addressLineInput.fill(street);
        await this.cityInput.fill(city);
        await this.countryRegionDropdown.click();
        await this.page.getByRole('option', { name: state, exact: true }).locator('div').click();
        await this.postalCodeInput.fill(zipCode);
    }

    async assertEmail(email: string): Promise<void> {
        await expect(this.emailField).toContainText(email);
    }

    async fillPhoneNumber(phoneNumber: string): Promise<void> {
        await this.phoneNumberInput.fill(phoneNumber);
    }

    async fillPersonalInfo(personalInfo: PersonalInfo): Promise<void> {
        await this.fillName(personalInfo.first_name, personalInfo.last_name);
        await this.fillAddress(personalInfo.address.street, personalInfo.address.city, personalInfo.address.state, personalInfo.address.zip_code);
        await this.assertEmail(personalInfo.email);
        await this.fillPhoneNumber(personalInfo.phone);
    }

    async saveAndContinue(): Promise<void> {
        await this.saveAndContinueButton.click();
    }
}