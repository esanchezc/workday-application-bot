import { test, expect, selectors } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { MyInformationPage } from './pages/MyInformationPage';
import { MyExperiencePage } from './pages/MyExperiencePage';
const fs = require('fs').promises;

test.describe('Apply to job in Workday', () => {
  let cv;

  test.beforeAll(async () => {
    const cvFilePath = 'cv.json';
    const jsonData = await fs.readFile(cvFilePath, 'utf-8');
    cv = JSON.parse(jsonData);
    // selectors.setTestIdAttribute('data-automation-id')
  })

  test('Apply to job', async ({ page }) => {
    const url = 'https://intel.wd1.myworkdayjobs.com/en-US/External/job/Virtual-US/Cloud-Automation-Test-Engineer_JR0264891-1/apply/applyManually?source=LinkedIn'
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInformationPage(page);
    const myExpPage = new MyExperiencePage(page);

    await loginPage.navigate(url);
    await loginPage.login('esanchezc.sqa@gmail.com', 'Test1234!');
    await myInfoPage.isLoaded();
    await myInfoPage.fillHowDidYouHearFromUs('LinkedIn', 'United States of America');
    let personal_info = cv.personal_info;
    await myInfoPage.fillName(personal_info.first_name, personal_info.last_name);
    let address = personal_info.address;
    await myInfoPage.fillAddress(address.street, address.city, address.state, address.zip_code);
    await myInfoPage.assertEmail(personal_info.email);
    await myInfoPage.fillPhoneNumber(personal_info.phone);
    await myInfoPage.saveAndContinue();
    let work_id = 1;
    for (const exp of cv.work_experience) {
      await myExpPage.addExperience(work_id, exp.job_title, exp.company, exp.location, exp.dates.start, exp.dates.end, exp.description);
      await myExpPage.addAnotherExperience();
      work_id++;
    }
    await myExpPage.deleteLastExperience(work_id);
    await myExpPage.addFirstEducation();
    let edu_id = 1;
    for (const edu of cv.education) {
      await myExpPage.addEducation(edu_id, edu.university, edu.degree, edu.field);
      edu_id++;
    }
    await myExpPage.deleteLastEducation(edu_id);
    let lang_id = 1;
    await myExpPage.addFirstLanguage()
    for (const lang of cv.languages) {
      await myExpPage.addLanguage(lang_id, lang);
      lang_id++;
    }
    await myExpPage.deleteLastLangauge(lang_id);
    const allSkills = Object.values(cv.skills).flat();
    for (const skill of allSkills) {
      await myExpPage.addSkill(String(skill));
    }
    await myExpPage.uploadResume("Emanuel Sanchez - SWE.pdf")
    await myExpPage.addWebsite(personal_info.github);
    await myExpPage.saveAndContinue();
  });
})