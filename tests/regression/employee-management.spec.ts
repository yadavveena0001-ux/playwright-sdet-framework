import { test, expect } from '@fixtures/fixtures';
import { uniqueEmployeeName } from '@utils/testData';

test.describe('Employee Management (PIM) @regression', () => {
  test('creates a new employee and confirms it is searchable', async ({
    authenticatedPage,
    pimPage,
    addEmployeePage,
  }) => {
    const { firstName, lastName } = uniqueEmployeeName();

    await pimPage.open();
    await pimPage.clickAddEmployee();
    await addEmployeePage.fillBasicDetails(firstName, lastName);
    await addEmployeePage.save();
    await addEmployeePage.expectCreationSuccess();

    await pimPage.open();
    await pimPage.searchByName(`${firstName} ${lastName}`);

    expect(await pimPage.getResultsCount()).toBeGreaterThan(0);
  });

  test('deletes an employee and confirms removal', async ({ authenticatedPage, pimPage, addEmployeePage }) => {
    const { firstName, lastName } = uniqueEmployeeName();

    await pimPage.open();
    await pimPage.clickAddEmployee();
    await addEmployeePage.fillBasicDetails(firstName, lastName);
    await addEmployeePage.save();

    await pimPage.open();
    await pimPage.searchByName(`${firstName} ${lastName}`);
    await pimPage.deleteFirstResult();

    await pimPage.searchByName(`${firstName} ${lastName}`);
    expect(await pimPage.getResultsCount()).toBe(0);
  });
});
