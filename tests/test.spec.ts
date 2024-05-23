import { test, expect } from '@playwright/test';
import { GetCookies } from '../utils/cookie';
import { ApiParty } from '../utils/api-party';
import { FormHelper } from '../utils/form-helper';
import { ProfilePage } from '../pages/profile-page';
import { BooksListPage } from '../pages/books-list-page';
import { Dialogs } from '../pages/dialogs';
import Chance from 'chance';

test('Task 7: Shared State', async ({ page }) => {
  const getCookie = new GetCookies(page);
  const apiParty = new ApiParty(page);
  const profile = new ProfilePage(page);
  const formHelper = new FormHelper(page);
  const booksList = new BooksListPage(page);
  const dialog = new Dialogs(page);

  let token, userID, numberOfBooks, booksToAdd, titleOfSecondBook, booksResponse, listOfAllBooks, listOfUserBooks;
  
  await test.step('Get cookies', async () => {
    token = await getCookie.getToken();

    userID = await getCookie.getUserID();
  })

  await test.step('Remove existing books from profile', async () => {
    await apiParty.deleteBooksInUserProfile(userID, token);
  })

  await test.step('Add books', async () => {
    const promise = apiParty.createPromiseForBooksRequest();

    await formHelper.goto('/books');

    booksResponse = await promise;

    listOfAllBooks = (await booksResponse.json()).books;

    numberOfBooks = await formHelper.generateRandom(2, 5);

    const chance = new Chance();

    booksToAdd = chance.pickset(listOfAllBooks, numberOfBooks);

    await apiParty.addBooksToUserProfile(userID, token, booksToAdd);
  })

  await test.step('Verify number of books in user profile', async () => {
    await formHelper.goto('/profile');

    await expect(booksList.booksCountOnUi).toHaveCount(Number(numberOfBooks));
  })

  await test.step('Verify that information for added books is correct', async () => {
    const userInfo = await apiParty.getUserInfoRequest(userID, token);

    listOfUserBooks = (await userInfo.json()).books;

    console.log(listOfUserBooks);

    for (let i = 0; i < numberOfBooks; i++) {
      expect(listOfUserBooks[i].title).toEqual(booksToAdd[i].title);

      expect(listOfUserBooks[i].author).toEqual(booksToAdd[i].author);

      expect(listOfUserBooks[i].publisher).toEqual(booksToAdd[i].publisher);
    }
  })

  await test.step('Verify alert window after deleting Book', async () => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toContain('alert');
      
      expect(dialog.message()).toContain('Book deleted');

      await dialog.accept();
    });
  })

  await test.step('Click delete icon for the second book in user profile', async () => {
    titleOfSecondBook = booksToAdd[1].title;

    await profile.clickDeleteIcon(1);

    await expect(dialog.modalHeader).toHaveText('Delete Book');

    await expect(dialog.modalBody).toHaveText('Do you want to delete this book?');

    await expect(dialog.closeSmallModalOk).toHaveText('OK');

    await expect(dialog.closeSmallModalCancel).toHaveText('Cancel');

    await dialog.clickOkButtonInDeleteModal();
  })

  await test.step('Verify that book was deleted', async () => {
    await formHelper.goto('/profile');
    
    if (numberOfBooks == 2) {
      await expect(profile.bookTitle.nth(1)).toBeHidden();
    }
    else {
      await expect(profile.bookTitle.nth(1)).not.toHaveText(titleOfSecondBook);
    }
  })

  await test.step('Verify alert window after deleting All Books', async () => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toContain('alert');
      
      expect(dialog.message()).toContain('All Books deleted.');

      await dialog.accept();
    });
  })

  await test.step('Delete All books', async () => {
    await profile.clickDeleteAllBooksButton();

    await expect(dialog.modalHeader).toHaveText('Delete All Books');

    await expect(dialog.modalBody).toHaveText('Do you want to delete all books?');

    await expect(dialog.closeSmallModalOk).toHaveText('OK');

    await expect(dialog.closeSmallModalCancel).toHaveText('Cancel');

    await dialog.clickOkButtonInDeleteModal();
  })

  await test.step('Verify that all books were deleted', async () => {
    await formHelper.goto('/profile');

    await expect(profile.bookTitle).toBeHidden();
  })
})
