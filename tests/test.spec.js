import { test, expect } from '@playwright/test';
import { GetCookies } from '../utils/cookie';
import { ApiParty } from '../utils/api-party';
import { FormHelper } from '../utils/form-helper';
import { ProfilePage } from '../pages/profile-page';

test.only('Task 7: Shared State', async ({ page }) => {
  const getCookie = new GetCookies(page);
  const apiParty = new ApiParty(page);
  const profile = new ProfilePage(page);
  const formHelper = new FormHelper(page);
  let n, token, userID, booksResponse, listOfAllBooks, booksInUserProfile, secondBookInProfile, listOfUserBooks;

  await test.step('Add books', async () => {
    const promise = apiParty.createPromiseForBooksRequest();

    await formHelper.goto('/books');

    booksResponse = await promise;

    listOfAllBooks = (await booksResponse.json()).books;

    n = await formHelper.generateRandom(2, 5);

    console.log(`Количество книг, которые необходимо добавить: n = ${n}`);

    token = await getCookie.getToken();

    userID = await getCookie.getUserID();

    booksInUserProfile = await apiParty.addBookToUserProfile(userID, token, n, listOfAllBooks);
  })

  await test.step('Check number of books in user profile', async () => {
    let userInfo = await apiParty.getUserInfoRequest(userID, token);

    listOfUserBooks = (await userInfo.json()).books;

    expect(listOfUserBooks.length).toBe(Number(n));
    
    secondBookInProfile = listOfUserBooks[1].isbn;

    console.log(`isbn второй книге в профиле пользователя = ${secondBookInProfile}`);
  })

  await test.step('Check that information for added books is correct', async () => {
    for (let i = 0; i < n; i++) {
      expect(listOfAllBooks[i].title).toEqual(listOfUserBooks[i].title);

      expect(listOfAllBooks[i].author).toEqual(listOfUserBooks[i].author);

      expect(listOfAllBooks[i].publisher).toEqual(listOfUserBooks[i].publisher);
    }
  })

  await test.step('Click delete icon for the second book in user profile', async () => {
    await formHelper.goto('/profile');

    await profile.clickDeleteIcon();

    expect(page.locator('.modal-header div')).toHaveText('Delete Book');

    expect(page.locator('.modal-body')).toHaveText('Do you want to delete this book?');

    expect(page.locator('#closeSmallModal-ok')).toHaveText('OK');

    expect(page.locator('#closeSmallModal-cancel')).toHaveText('Cancel');

    await profile.clickOkButtonInDeleteModal();
  })

  await test.step('Verify alert window after deleting Book', async () => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toContain('alert');
      
      expect(dialog.message()).toContain('Book deleted');

      await dialog.accept();
    });
  })

  await test.step('Verify book was deleted', async () => {
    let userInfo = await apiParty.getUserInfoRequest(userID, token);

    await formHelper.goto('/profile');

    console.log(`Количество книг в профиле пользователя после удаления одной = ${(await userInfo.json()).books.length}`);

    expect((await userInfo.json()).books.filter(item => item.isbn === secondBookInProfile).length).toBe(0);
  })

  await test.step('Delete All books', async () => {
    await profile.clickDeleteAllBooksButton();

    expect(page.locator('.modal-header div')).toHaveText('Delete All Books');

    expect(page.locator('.modal-body')).toHaveText('Do you want to delete all books?');

    expect(page.locator('#closeSmallModal-ok')).toHaveText('OK');

    expect(page.locator('#closeSmallModal-cancel')).toHaveText('Cancel');

    await profile.clickOkButtonInDeleteModal();
  })

  await test.step('Verify alert window after deleting All Books', async () => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toContain('alert');
      
      expect(dialog.message()).toContain('All Books deleted.');

      await dialog.accept();
    });
  })

  await test.step('Verify all books were deleted', async () => {
    let userInfo = await apiParty.getUserInfoRequest(userID, token);

    console.log(`Количество книг в профиле пользователя после удаления всех = ${(await userInfo.json()).books.length}`)

    expect((await userInfo.json()).books.length).toBe(0);
  })
})
