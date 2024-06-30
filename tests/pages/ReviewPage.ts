import { expect, type Page } from '@playwright/test';

export class MyExperiencePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async reviewAndSubmit() {
        await this.page.getByTestId('bottom-navigation-next-button').click();
        await this.page.getByTestId('bottom-navigation-next-button').click();
        await this.page.getByTestId('bottom-navigation-next-button').click();
    }
}
