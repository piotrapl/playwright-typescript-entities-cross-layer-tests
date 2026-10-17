import { expect } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import { nonExisting9DigitRegons, nonExisting14DigitRegons } from '../../data/nonexisting-regons';

for (const dataset of nonExisting9DigitRegons) {
  test(`REGON negative search: ${dataset.regon}`, async ({ negativeFlow }) => {
    const result = await negativeFlow.searchInvalid('regon', dataset.regon);

    await result.assert();
  });
}

for (const dataset of nonExisting14DigitRegons) {
  test(`REGON negative search: ${dataset.regon}`, async ({ negativeFlow }) => {
    const result = await negativeFlow.searchInvalid('regon', dataset.regon);

    await result.assert();
  });
}

test('REGON invalid length: 1234567891', async ({ negativeFlow }) => {
  const message = await negativeFlow.validateInput('regon', '1234567891');

  await expect(message).toBeVisible();
  await expect(message).toContainText('Numer REGON ma długość 9 lub 14 znaków');
});

test('REGON validation - 8 digits', async ({ negativeFlow }) => {
  const message = await negativeFlow.validateInput('regon', '12345678');

  await expect(message).toBeVisible();
  await expect(message).toContainText('Numer REGON ma długość 9 lub 14 znaków');
});

test('REGON validation - invalid 9 digits', async ({ negativeFlow }) => {
  const message = await negativeFlow.validateInput('regon', '123456789');

  await expect(message).toBeVisible();
  await expect(message).toContainText('Wprowadzony numer REGON jest nieprawidłowy');
});