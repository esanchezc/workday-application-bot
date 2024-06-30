import { Locator, Page } from "@playwright/test";

export class EducationEntry {
    private readonly section: Locator;
    private readonly schoolSearchInput: Locator;
    private readonly schoolSearchBox: Locator;
    private readonly degreeDropdown: Locator;
    private readonly fieldOfStudyInput: Locator;
    private readonly deleteButton: Locator;

    constructor(page: Page, eduId: number) {
        this.section = page.getByTestId(`education-${eduId}`);
        this.schoolSearchInput = this.section.getByTestId('formField-schoolItem').getByPlaceholder('Search');
        this.schoolSearchBox = this.section.getByTestId('searchBox');
        this.degreeDropdown = this.section.getByTestId('degree');
        this.fieldOfStudyInput = this.section.getByTestId('formField-field-of-study').getByPlaceholder('Search');
        this.deleteButton = this.section.getByTestId('panel-set-delete-button');
    }

    async fillDetails(school: string, degree: string, fieldOfStudy: string): Promise<void> {
        await this.selectSchool(school);
        await this.selectDegree(degree);
        await this.selectFieldOfStudy(fieldOfStudy);
    }

    private async selectSchool(school: string): Promise<void> {
        await this.schoolSearchInput.click();
        await this.schoolSearchBox.fill(school);
        await this.schoolSearchBox.press('Enter');
        const university = this.section.getByLabel(school, { exact: true }).getByTestId('radioBtn');
        try {
            await university.waitFor({ state: 'visible', timeout: 1000 });
            await university.click();
        } catch (error) {
            console.log(`${school} was not visible within 1 second, skipping`);
        }
    }

    private async selectDegree(degree: string): Promise<void> {
        await this.degreeDropdown.click();
        await this.section.page().getByRole('option', { name: degree }).click();
    }

    private async selectFieldOfStudy(fieldOfStudy: string): Promise<void> {
        await this.fieldOfStudyInput.click();
        await this.fieldOfStudyInput.fill(fieldOfStudy);
        await this.fieldOfStudyInput.press('Enter');
        await this.section.page().getByText(fieldOfStudy).first().click();
    }

    async delete(): Promise<void> {
        await this.deleteButton.click();
    }

    async isSchoolSelected(school: string): Promise<boolean> {
        const promptOption = this.section.getByTestId('promptOption');
        return await promptOption.innerText() === school;
    }

    async isDegreeSelected(degree: string): Promise<boolean> {
        return await this.degreeDropdown.innerText() === degree;
    }

    async isFieldOfStudySelected(fieldOfStudy: string): Promise<boolean> {
        const promptOption = this.section.getByTestId('formField-field-of-study').getByTestId('promptOption');
        return await promptOption.innerText() === fieldOfStudy;
    }
}