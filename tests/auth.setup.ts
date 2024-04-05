import { test as setup, expect } from '@playwright/test';
import { FormHelper } from '../utils/form-helper';
import { LoginPage } from '../pages/login-page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  //Perform authentication steps
  const login = new LoginPage(page);
  
  const formHelper = new FormHelper(page);

  await formHelper.goto('/login');

  await login.login(process.env.TEST_USER_USERNAME!, process.env.TEST_USER_PASSWORD!);

  await expect(page).toHaveURL(/.*profile/);

  //Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/profile');

  //End of authentication steps.
  (await page.context().storageState({ path: authFile }));
});
