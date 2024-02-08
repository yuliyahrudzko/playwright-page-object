import { test, expect } from '@playwright/test';
import { PlaywrightLoginPage } from '../pages/playwright-login-page';
import { PlaywrightProfilePage } from '../pages/playwright-profile-page';
import { PlaywrightBooksPage } from '../pages/playwright-books-page';

test('Task 6: Page Object Model', async ({ page, context }) => {
  const playwrightlogin = new PlaywrightLoginPage(page,context);
  let booksResponse, userName, userID, token; //как объявлять переменные, которые используются в разных степах?

  await test.step('Log in to demoqa', async ( ) => {

    await playwrightlogin.goto();

    await playwrightlogin.login();

    await expect(page).toHaveURL(/.*profile/);
  })

  await test.step('Get cookies', async () => {
    userID = await playwrightlogin.getUserID();

    expect(playwrightlogin.getUserID).toBeTruthy();

    userName = await playwrightlogin.getUserName(); // можно ли прописывать присвоение перменной здесь? (в шагах)

    expect(playwrightlogin.getUserName()).toBeTruthy();

    expect(playwrightlogin.getExpiresCookie()).toBeTruthy();

    expect(playwrightlogin.getToken()).toBeTruthy();

    token = await playwrightlogin.getToken();
  })

  const playwrightProfile = new PlaywrightProfilePage(page);

  await test.step('Block images via page.route', async () => {
    await playwrightProfile.blockImage();
  });

  const playwrightBooks = new PlaywrightBooksPage(page);

  await test.step('Verify GET request', async () => {
    await playwrightProfile.triggerGetRequest();

    booksResponse = await playwrightBooks.createPromise();
  })

  await test.step('Verify status code of GET request', async () => {
    expect(booksResponse.ok()).toBeTruthy(); //почему не работает если напрямую использовать await playwrightBooks.createPromise()?

    expect(booksResponse.status()).toBe(200); //почему не работает если напрямую использовать await playwrightBooks.createPromise()?
  });

  await test.step('Make a screenshot of the Books page', async () => {
    await playwrightBooks.makeScreenshot();

    await expect(page).toHaveURL(/.*books/);
  });

  await test.step('Verify that number of books on the UI = number of books in the body ', async () => {
    expect(await playwrightBooks.getNumberOfBooksInResponse(booksResponse)).toEqual(await playwrightBooks.getNumberOfBooksOnUi());
  })

  await test.step('Change number of pages to the random value', async () => {
    const newPageCount = String(Math.floor(Math.random() * (1000 - 1) + 1)); 

    await playwrightBooks.changeNumberOfPages(newPageCount);
  });
/*
  await test.step('Verify that number of pages was updated', async () => {
    const bookNumber = Math.floor(Math.random() * (await playwrightBooks.getNumberOfBooksOnUi() - 1) + 1);
 
    await page.locator(`.rt-tbody>div:nth-child(${bookNumber}) a`).click(); //как в названии локатора использовать переменную??
  
    await expect(page.locator('#pages-wrapper #userName-value')).toHaveText(await playwrightBooks.getNumberOfBooksOnUi().toString()); // можно ли всё выражение прописать в page файле?
  
    await page.screenshot({ path: 'BookContext.png' });  
  });
*/
  await test.step('Verify info in Account request', async () => {
    const response = await playwrightBooks.getResponse(userID, token);

    expect(await playwrightBooks.getUserName(response)).toEqual(userName);
        
    expect(await playwrightBooks.getBookLength(response)).toBe(0);
  });

})