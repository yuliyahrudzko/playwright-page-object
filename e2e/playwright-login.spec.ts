import { test, expect } from '@playwright/test';
import { PlaywrightLoginPage } from '../pages/playwright-login-page';
import { PlaywrightProfilePage } from '../pages/playwright-profile-page';
import { PlaywrightBooksPage } from '../pages/playwright-books-page';

test('Log in to demoqa', async ({ page, context }) => {
  const playwrightlogin = new PlaywrightLoginPage(page,context);

  await test.step('Log in to demoqa', async ( ) => {

    await playwrightlogin.goto();

    await playwrightlogin.login();

    await expect(page).toHaveURL(/.*profile/);
  })

  await test.step('Get cookies', async () => {
    expect(playwrightlogin.getUserID).toBeTruthy();

    expect(playwrightlogin.getUserName()).toBeTruthy();

    expect(playwrightlogin.getExpiresCookie()).toBeTruthy();

    expect(playwrightlogin.getToken()).toBeTruthy();
  })

  const playwrightProfile = new PlaywrightProfilePage(page);

  await test.step('Block images via page.route', async () => {
    await playwrightProfile.blockImage();
  });

  const playwrightBooks = new PlaywrightBooksPage(page);

  await test.step('Verify GET request', async () => {
    await playwrightBooks.triggerGetRequest();

    await playwrightBooks.createPromise();
  })
/*
  await test.step('Verify status code of GET request', async () => {
    expect(playwrightBook.createPromise().ok()).toBeTruthy();

    expect(playwrightBook.createPromise().status()).toBe(200);
  });
*/
  await test.step('Make a screenshot of the Books page', async () => {
    await playwrightBooks.makeScreenshot();

    await expect(page).toHaveURL(/.*books/);
  });
/*
  await test.step('Verify that number of books on the UI = number of books in the body ', async () => {
    expect(await playwrightBook.getNumberOfBooksInResponse()).toEqual(await playwrightBook.getNumberOfBooksOnUi());
  })
  */
  await test.step('Change number of pages to the random value', async () => {
    await playwrightBooks.changeNumberOfPages();
  });
/*
  await test.step('Verify that number of pages was updated', async () => {
    const bookNumber = Math.floor(Math.random() * (booksCountOnUi - 1) + 1);
 
    await page.locator(`.rt-tbody>div:nth-child(${bookNumber}) a`).click();
  
    await expect(page.locator('#pages-wrapper #userName-value')).toHaveText(newPageCount.toString());
  
    await page.screenshot({ path: 'BookContext.png' });  
  });

  await test.step('Verify info in Account request', async () => {
    const response = await page.request.get(`https://demoqa.com/Account/v1/User/${USERID}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
        
    expect(await response.json().then(data => data.username)).toEqual(USERNAME);
        
    expect(await response.json().then(data => data.books.length)).toBe(0);
  });
*/
})