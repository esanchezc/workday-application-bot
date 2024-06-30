import { Locator, Page } from "@playwright/test";

export class ExperienceEntry {
    private readonly section: Locator;

    constructor(page: Page, workId: string) {
        this.section = page.getByTestId(`workExperience-${workId}`);
    }

    async fillDetails(title: string, company: string, location: string, fromDate: { month: string, year: string }, toDate: string | { month: string, year: string }, roleDescription: string[]): Promise<void> {
        await this.section.getByLabel('Job Title*').fill(title);
        await this.section.getByLabel('Company*').fill(company);
        await this.section.getByLabel('Location').fill(location);
        await this.section.getByTestId('formField-startDate').getByTestId('dateSectionMonth-input').fill(fromDate.month);
        await this.section.getByTestId('formField-startDate').getByTestId('dateSectionYear-input').fill(fromDate.year);
        if (toDate === 'Present') {
            await this.section.getByTestId('currentlyWorkHere').click();
        } else if (typeof toDate === 'object') {
            await this.section.getByTestId('formField-endDate').getByTestId('dateSectionMonth-input').fill(toDate.month);
            await this.section.getByTestId('formField-endDate').getByTestId('dateSectionYear-input').fill(toDate.year);
        }
        const description = roleDescription.join('\n');
        await this.section.getByLabel('Role Description').fill(description);
    }

    async delete(): Promise<void> {
        await this.section.getByTestId('panel-set-delete-button').click();
    }
}