import { expect, type Page } from '@playwright/test';

export class MyExperiencePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async addExperience(work_id, title, company, location, from_date, to_date, role_description) {
        await expect(this.page.getByRole('heading', { name: 'My Experience' })).toBeVisible();
        const experienceSection = this.page.getByTestId(`workExperience-${work_id}`);
        await experienceSection.getByLabel('Job Title*').fill(title);
        await experienceSection.getByLabel('Company*').fill(company);
        await experienceSection.getByLabel('Location').fill(location);
        await experienceSection.getByTestId('formField-startDate').getByTestId('dateSectionMonth-input').fill(from_date.month);
        await experienceSection.getByTestId('formField-startDate').getByTestId('dateSectionYear-input').fill(from_date.year);
        if (to_date === 'Present') {
            await experienceSection.getByTestId('currentlyWorkHere').click()
        } else {
            await experienceSection.getByTestId('formField-endDate').getByTestId('dateSectionMonth-input').fill(to_date.month);
            await experienceSection.getByTestId('formField-endDate').getByTestId('dateSectionYear-input').fill(to_date.year);
        }
        const description = role_description.join('\n');
        await experienceSection.getByLabel('Role Description').fill(description);
    }

    async addAnotherExperience() {
        await this.page.getByLabel('Add Another Work Experience').click();
    }

    async deleteLastExperience(work_id) {
        await this.page.getByTestId(`workExperience-${work_id}`).getByTestId('panel-set-delete-button').click();
    }

    async addFirstEducation() {
        await this.page.getByTestId('educationSection').getByTestId('Add').click()
    }

    async addFirstLanguage() {
        await this.page.getByTestId('languageSection').getByTestId('Add').click()
    }

    async addEducation(edu_id: number, school: string, degree: string, fieldOfStudy: string) {
        const educationSection = this.page.getByTestId(`education-${edu_id}`);
        await educationSection.getByTestId('formField-schoolItem').getByPlaceholder('Search').click();
        await educationSection.getByTestId('searchBox').fill(school);
        await educationSection.getByTestId('searchBox').press('Enter');
        const university = this.page.getByLabel(school, { exact: true }).getByTestId('radioBtn');
        try {
            const isVisible = await university.isVisible();
            if (!isVisible) {
                await university.waitFor({ state: 'visible', timeout: 1000 });
            }
            await university.click();
        } catch (error) {
            console.log(`${school} was not visible within 1 second, skipping`);
        }
        await educationSection.getByTestId('degree').click();
        await expect(educationSection.getByTestId('promptOption')).toHaveText(school);
        await educationSection.getByTestId('degree').click();
        await this.page.getByRole('option', { name: degree }).click();
        await educationSection.getByTestId('formField-field-of-study').getByPlaceholder('Search').click()
        await expect(this.page.getByLabel('Accounting', { exact: true }).getByTestId('radioBtn')).toBeVisible();
        await educationSection.getByTestId('formField-field-of-study').getByPlaceholder('Search').fill(fieldOfStudy);
        await educationSection.getByTestId('formField-field-of-study').getByPlaceholder('Search').press('Enter');
        await this.page.getByText(fieldOfStudy).first().click();
        await expect(educationSection.getByTestId('formField-field-of-study').getByTestId('promptOption')).toHaveText(fieldOfStudy);
        await this.page.getByTestId('educationSection').getByTestId('Add Another').click();
        await this.page.getByTestId('educationSection').getByTestId('Add Another').click();
    }

    async addLanguage(lang_id: number, language: string) {
        const languageSection = this.page.getByTestId(`language-${lang_id}`);
        await languageSection.getByTestId('language').click();
        await this.page.getByText(language).click();
        await languageSection.getByTestId('nativeLanguage').click();
        for (let i = 0; i < 5; i++) {
            await languageSection.getByTestId(`languageProficiency-${i}`).click();
            await this.page.getByRole('option', { name: '5 - Fluent' }).first().click();
            await expect(languageSection.getByTestId(`languageProficiency-${i}`)).toHaveText('5 - Fluent')
        }
        await this.page.getByTestId('languageSection').getByTestId('Add Another').click();
    }

    async addSkill(skill: string) {
        await this.page.getByTestId('formField-skillsPrompt').getByPlaceholder('Search').fill(skill);
        await this.page.getByTestId('formField-skillsPrompt').getByPlaceholder('Search').press('Enter');
        try {
            await expect(this.page.getByTestId('promptTitle')).toBeVisible()
            const skillCheckbox = this.page.getByLabel(skill).first().getByTestId('checkboxPanel');
            await skillCheckbox.waitFor({ state: 'visible', timeout: 500 });
            await skillCheckbox.click();
        } catch (error) {
            console.log(`Skill not found or couldn't be added: ${skill}. Moving to next skill.`);
        }
    }

    async addWebsite(website: string) {
        await this.page.getByTestId('Add').click();
        await this.page.getByTestId('website').fill(website)
    }

    async uploadResume(resumeFile: string) {
        const fileInput = this.page.getByTestId('resumeUpload').locator('input[type="file"]');
        await fileInput.setInputFiles(resumeFile);    
        await this.page.waitForSelector('text=Successfully Uploaded', { state: 'visible', timeout: 30000 });
    }

    async saveAndContinue() {
        await this.page.getByRole('button', { name: 'Save and Continue' }).click();
    }

    async deleteLastEducation(edu_id) {
        await this.page.getByTestId(`education-${edu_id}`).getByTestId('panel-set-delete-button').click();
    }

    async deleteLastLangauge(lang_id) {
        await this.page.getByTestId(`language-${lang_id}`).getByTestId('panel-set-delete-button').click();
    }
}