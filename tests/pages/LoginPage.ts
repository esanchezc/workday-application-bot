import { Page, expect, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    
    // Locators
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly acceptCookiesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators
        this.emailInput = page.getByLabel('Email Address');
        this.passwordInput = page.getByLabel('Password');
        this.signInButton = page.getByLabel('Sign In');
        this.acceptCookiesButton = page.getByRole('button', { name: 'Accept Cookies' });
    }

    async navigate(url: string): Promise<void> {
        await this.page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
        await expect(this.signInButton).toBeVisible({ timeout: 10000 });
        await this.acceptCookiesButton.click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }
}