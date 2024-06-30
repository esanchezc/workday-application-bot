import { expect, type Page } from '@playwright/test';

export class MyExperiencePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillVoluntaryDisclosures() {
        await this.page.getByTestId('hispanicOrLatino').click();
        await this.page.getByText('Yes', { exact: true }).click();
        await this.page.getByTestId('ethnicityDropdown').click();
        await this.page.getByText('Hispanic or Latino (United').click();
        await this.page.getByTestId('veteranStatus').click();
        await this.page.getByRole('option', { name: 'I am not a veteran' }).click();
        await this.page.getByTestId('gender').click();
        await this.page.getByText('Male', { exact: true }).click();
        await this.page.getByTestId('bottom-navigation-next-button').click();
    }
}

