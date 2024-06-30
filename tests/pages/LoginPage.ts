import { Page, expect, selectors } from '@playwright/test';
import { MyInformationPage } from './MyInformationPage';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;        
        selectors.setTestIdAttribute('data-automation-id')
    }

    async navigate(url) {
        await this.page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.getByLabel('Sign In')).toBeVisible({timeout: 10000})
        await this.page.getByRole('button', { name: 'Accept Cookies' }).click();
    }

    async login(email, password) {
        await this.page.getByLabel('Email Address').fill(email);
        await this.page.getByLabel('Password').fill(password);
        await this.page.getByLabel('Sign In').click();
    }
}