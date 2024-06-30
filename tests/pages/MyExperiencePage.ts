import { expect, type Page, type Locator } from '@playwright/test';
import { ExperienceEntry } from './ExperienceEntry';
import { EducationEntry } from './EducationEntry';

export class MyExperiencePage {
    readonly page: Page;

    // Locators
    private readonly pageHeading: Locator;
    private readonly addAnotherWorkExperienceButton: Locator;
    private readonly addEducationButton: Locator;
    private readonly addLanguageButton: Locator;
    private readonly skillSearchInput: Locator;
    private readonly addWebsiteButton: Locator;
    private readonly resumeUploadInput: Locator;
    private readonly saveAndContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'My Experience' });
        this.addAnotherWorkExperienceButton = page.getByLabel('Add Another Work Experience');
        this.addEducationButton = page.getByTestId('educationSection').getByTestId('Add');
        this.addLanguageButton = page.getByTestId('languageSection').getByTestId('Add');
        this.skillSearchInput = page.getByTestId('formField-skillsPrompt').getByPlaceholder('Search');
        this.addWebsiteButton = page.getByTestId('Add');
        this.resumeUploadInput = page.getByTestId('resumeUpload').locator('input[type="file"]');
        this.saveAndContinueButton = page.getByRole('button', { name: 'Save and Continue' });
    }

    async isLoaded(): Promise<void> {
        await expect(this.pageHeading).toBeVisible();
    }

    async addExperience(workId: string, title: string, company: string, location: string, fromDate: { month: string, year: string }, toDate: string | { month: string, year: string }, roleDescription: string[]): Promise<void> {
        await this.isLoaded();
        const experienceEntry = new ExperienceEntry(this.page, workId);
        await experienceEntry.fillDetails(title, company, location, fromDate, toDate, roleDescription);
    }

    async addAnotherExperience(): Promise<void> {
        await this.addAnotherWorkExperienceButton.click();
    }

    async deleteExperience(workId: string): Promise<void> {
        const experienceEntry = new ExperienceEntry(this.page, workId);
        await experienceEntry.delete();
    }

    async addFirstEducation(): Promise<void> {
        await this.addEducationButton.click();
    }

    async addEducation(eduId: number, school: string, degree: string, fieldOfStudy: string): Promise<void> {
        const educationEntry = new EducationEntry(this.page, eduId);
        await educationEntry.fillDetails(school, degree, fieldOfStudy);
    }

    async deleteEducation(eduId: number): Promise<void> {
        const educationEntry = new EducationEntry(this.page, eduId);
        await educationEntry.delete();
    }

    async addFirstLanguage(): Promise<void> {
        await this.addLanguageButton.click();
    }

    async addLanguage(langId: number, language: string): Promise<void> {
        const languageSection = this.page.getByTestId(`language-${langId}`);
        await languageSection.getByTestId('language').click();
        await this.page.getByText(language).click();
        await languageSection.getByTestId('nativeLanguage').click();
        for (let i = 0; i < 5; i++) {
            await languageSection.getByTestId(`languageProficiency-${i}`).click();
            await this.page.getByRole('option', { name: '5 - Fluent' }).first().click();
            await expect(languageSection.getByTestId(`languageProficiency-${i}`)).toHaveText('5 - Fluent');
        }
        await this.page.getByTestId('languageSection').getByTestId('Add Another').click();
    }

    async addSkill(skill: string): Promise<void> {
        await this.skillSearchInput.fill(skill);
        await this.skillSearchInput.press('Enter');
        try {
            await expect(this.page.getByTestId('promptTitle')).toBeVisible();
            const skillCheckbox = this.page.getByLabel(skill).first().getByTestId('checkboxPanel');
            await skillCheckbox.waitFor({ state: 'visible', timeout: 500 });
            await skillCheckbox.click();
        } catch (error) {
            console.log(`Skill not found or couldn't be added: ${skill}. Moving to next skill.`);
        }
    }

    async addWebsite(website: string): Promise<void> {
        await this.addWebsiteButton.click();
        await this.page.getByTestId('website').fill(website);
    }

    async uploadResume(resumeFile: string): Promise<void> {
        await this.resumeUploadInput.setInputFiles(resumeFile);
        await this.page.waitForSelector('text=Successfully Uploaded', { state: 'visible', timeout: 30000 });
    }

    async saveAndContinue(): Promise<void> {
        await this.saveAndContinueButton.click();
    }

    async deleteLastLanguage(langId: number): Promise<void> {
        await this.page.getByTestId(`language-${langId}`).getByTestId('panel-set-delete-button').click();
    }
}