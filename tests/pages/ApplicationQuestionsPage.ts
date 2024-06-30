import { expect, type Page } from '@playwright/test';

export class MyExperiencePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillApplicationQuestions(){
        await expect(this.page.getByRole('heading', { name: 'Application Questions' })).toBeVisible();
    }
}