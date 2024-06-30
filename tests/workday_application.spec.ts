import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { MyInformationPage } from './pages/MyInformationPage';
import { MyExperiencePage } from './pages/MyExperiencePage';
import { CV } from '../types/CV';
import { readCV } from '../utils/fileUtils';

test.describe('Apply to job in Workday', () => {
  let cv: CV;

  test.beforeAll(async () => {
    cv = await readCV('cv.json');
  });

  test('Apply to job', async ({ page }) => {
    const url = 'https://tricentis.wd1.myworkdayjobs.com/en-US/Tricentis_Careers/job/Austin%2C-Texas/Lead-Software-Test-Engineer_JR103636/apply/applyManually';
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInformationPage(page);
    const myExpPage = new MyExperiencePage(page);

    await test.step('Login', async () => {
      await loginPage.navigate(url);
      await loginPage.login('esanchezc.sqa@gmail.com', 'Test1234!');
    });

    await test.step('Fill Personal Information', async () => {
      await myInfoPage.isLoaded();
      await myInfoPage.fillHowDidYouHearFromUs('LinkedIn', 'United States of America');
      await myInfoPage.fillPersonalInfo(cv.personal_info);
      await myInfoPage.saveAndContinue();
    });

    await test.step('Fill Work Experience', async () => {
      for (const [index, exp] of cv.work_experience.entries()) {
        await myExpPage.addExperience(
          (index + 1).toString(), // Convert to string as workId is a string
          exp.job_title,
          exp.company,
          exp.location,
          exp.dates.start,
          exp.dates.end,
          exp.description
        );
        if (index < cv.work_experience.length - 1) {
          await myExpPage.addAnotherExperience();
        }
      }
    });

    await test.step('Fill Education', async () => {
      await myExpPage.addFirstEducation();
      for (const [index, edu] of cv.education.entries()) {
        await myExpPage.addEducation(
          index + 1,
          edu.university,
          edu.degree,
          edu.field
        );
      }
      if (cv.education.length > 1) {
        await myExpPage.deleteEducation(cv.education.length);
      }
    });

    await test.step('Fill Languages', async () => {
      await myExpPage.addFirstLanguage();
      for (const [index, lang] of cv.languages.entries()) {
        await myExpPage.addLanguage(index + 1, lang);
      }
      if (cv.languages.length > 1) {
        await myExpPage.deleteLastLanguage(cv.languages.length);
      }
    });

    await test.step('Fill Skills', async () => {
      const allSkills = Object.values(cv.skills).flat();
      for (const skill of allSkills) {
        await myExpPage.addSkill(String(skill));
      }
    });

    await test.step('Upload Resume and Add Website', async () => {
      await myExpPage.uploadResume("Emanuel Sanchez - SWE.pdf");
      await myExpPage.addWebsite(cv.personal_info.github);
    });

    await test.step('Save and Continue', async () => {
      await myExpPage.saveAndContinue();
    });
  });
});