import { test, expect } from '@playwright/test';
import { username, password } from '../fixtures/users.json';
import { GetCookies } from '../utils/cookie';
import { ApiParty } from '../utils/api-party';
import { FormHelper } from '../utils/form-helper';
import { LoginPage } from '../pages/login-page';
import { ProfilePage } from '../pages/profile-page';
import { BooksListPage } from '../pages/books-list-page';

test('Task 6: Page Object Model', async ({ page }) => {
  const login = new LoginPage(page);
  const getCookie = new GetCookies(page);
  const apiParty = new ApiParty(page);
  const profile = new ProfilePage(page);
  const formHelper = new FormHelper(page);
  const booksList = new BooksListPage(page);
  let booksResponse, userName, userID, token, numberOfBooksOnUi, numberOfBooksInResponse, newPageCount;

  await test.step('Log in to demoqa', async ( ) => {
    await formHelper.goto('/login');

    //Declarative:
    await login.login(username, password);

    await expect(page).toHaveURL(/.*profile/);
  })

  await test.step('Get cookies', async () => {
    userID = await getCookie.getUserID();

    expect(userID).toBeDefined();

    userName = await getCookie.getUserName();

    expect(userName).toBeDefined();

    expect(await getCookie.getExpires()).toBeDefined();

    token = await getCookie.getToken();

    expect(token).toBeDefined();
  })

  await test.step('Block images via page.route', async () => {
    await apiParty.blockImage();
  });

  await test.step('Verify GET request', async () => {
    const promise = apiParty.createPromiseForBooksRequest();

    await profile.clickGoToStoreButton();

    booksResponse = await promise;

    expect(booksResponse.ok()).toBeDefined();
  })

  await test.step('Make a screenshot of the Books list page', async () => {
    await formHelper.makeScreenshot('Books list.png');

    await expect(page).toHaveURL(/.*books/);
  });

  await test.step('Verify that number of books on the UI = number of books in response ', async () => {
    numberOfBooksInResponse = (await booksResponse.json()).books.length;

    await expect(booksList.booksCountOnUi).toHaveCount(numberOfBooksInResponse);
  })

  await test.step('Change number of pages to the random value', async () => {
    newPageCount = await formHelper.generateRandom(1, 1000);

    await apiParty.changeNumberOfPages(newPageCount);
  });

  await test.step('Verify that number of pages was updated', async () => {
    const bookNumber = await formHelper.generateRandom(1, numberOfBooksInResponse)
 
    await booksList.openBook(bookNumber);
  
    //await expect(page.locator('#pages-wrapper #userName-value')).toHaveText(newPageCount.toString());
  
    await formHelper.makeScreenshot('Book Context.png');
  });

  await test.step('Verify info in Account request', async () => {
    const response = await apiParty.getUserInfoRequest(userID, token);

    expect((await response.json()).username).toEqual(userName);
        
    expect((await response.json()).books.length).toBe(0);
  });
})
