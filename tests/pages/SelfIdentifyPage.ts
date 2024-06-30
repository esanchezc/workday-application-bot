import { expect, type Page } from '@playwright/test';

export class MyExperiencePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillVoluntaryDisclosures() {
        await this.page.getByTestId('name').click();
        await this.page.getByTestId('name').fill('Emanuel Sanchez');
        await this.page.getByTestId('dateIcon').click();
        await this.page.getByTestId('datePickerSelectedToday').click();
        await this.page.getByLabel('No, I do not have a').check();
        await this.page.getByTestId('bottom-navigation-next-button').click();
    }
}
