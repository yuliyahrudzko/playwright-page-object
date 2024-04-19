import { test, expect } from '@playwright/test';
import { GetCookies } from '../utils/cookie';
import { ApiParty } from '../utils/api-party';
import { FormHelper } from '../utils/form-helper';
import { ProfilePage } from '../pages/profile-page';
import { BooksListPage } from '../pages/books-list-page';

test('Task 7: Shared State', async ({ page }) => {
  const getCookie = new GetCookies(page);
  const apiParty = new ApiParty(page);
  const profile = new ProfilePage(page);
  const formHelper = new FormHelper(page);
  const booksList = new BooksListPage(page);
  let numberOfBooks, arrayOfBooksNumbers, token, userID, booksResponse, listOfAllBooks, listOfUserBooks;
  
  await test.step('Add books', async () => {
    const promise = apiParty.createPromiseForBooksRequest();

    await formHelper.goto('/books');

    booksResponse = await promise;

    listOfAllBooks = (await booksResponse.json()).books;

    numberOfBooks = await formHelper.generateRandom(2, 5);

    console.log(`Количество книг, которые необходимо добавить: n = ${numberOfBooks}`);

    token = await getCookie.getToken();

    userID = await getCookie.getUserID();

    arrayOfBooksNumbers = await formHelper.generateArrayOfBooksNumbers(numberOfBooks, listOfAllBooks);

    console.log(`Номера книг, которые необходимо добавить: ${arrayOfBooksNumbers}`);

    await apiParty.addBooksToUserProfile(userID, token, arrayOfBooksNumbers, listOfAllBooks);
  })

  await test.step('Check number of books in user profile', async () => {
    await formHelper.goto('/profile');

    await expect(booksList.booksCountOnUi).toHaveCount(Number(numberOfBooks));
  })

  await test.step('Check that information for added books is correct', async () => {
    const userInfo = await apiParty.getUserInfoRequest(userID, token);

    listOfUserBooks = (await userInfo.json()).books;

    for (let i = 0; i < numberOfBooks; i++) {
      expect(listOfUserBooks[i].title).toEqual(listOfAllBooks[arrayOfBooksNumbers[i]].title);

      expect(listOfUserBooks[i].author).toEqual(listOfAllBooks[arrayOfBooksNumbers[i]].author);

      expect(listOfUserBooks[i].publisher).toEqual(listOfAllBooks[arrayOfBooksNumbers[i]].publisher);
    }
  })

  await test.step('Click delete icon for the second book in user profile', async () => {
    await profile.clickDeleteIcon();

    await expect(profile.modalHeader).toHaveText('Delete Book');

    await expect(profile.modalBody).toHaveText('Do you want to delete this book?');

    await expect(profile.closeSmallModalOk).toHaveText('OK');

    await expect(profile.closeSmallModalCancel).toHaveText('Cancel');

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
    await formHelper.goto('/profile');

    if (numberOfBooks == 2) {
      await expect(page.locator(`.rt-tbody > div:nth-of-type(2) a`)).toBeHidden();
    }
    else {
      await expect(page.locator(`.rt-tbody > div:nth-of-type(2) a`)).not.toHaveText(listOfAllBooks[arrayOfBooksNumbers[1]].title);
    }
  })

  await test.step('Delete All books', async () => {
    await profile.clickDeleteAllBooksButton();

    await expect(profile.modalHeader).toHaveText('Delete All Books');

    await expect(profile.modalBody).toHaveText('Do you want to delete all books?');

    await expect(profile.closeSmallModalOk).toHaveText('OK');

    await expect(profile.closeSmallModalCancel).toHaveText('Cancel');

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
    for (let i = 0; i < numberOfBooks; i++) {
      await expect(page.locator(`.rt-tbody > div:nth-of-type(${i}) a`)).toBeHidden();
    }
  })
})
