import { Locator, Page } from '@playwright/test';
import { ENV } from '../utils/env';
import { ApiResponse } from '../types/api.types';

export type SearchType = 'regon' | 'nip' | 'krs';

export class SearchPage {
  constructor(private page: Page) {}

  get messageLocator(): Locator {
    return this.page.locator('#divInfoKomunikat');
  }

  get resultsTable(): Locator {
    return this.page.locator('#divListaJednostek');
  }

  get resultsRows(): Locator {
    return this.resultsTable.locator('tr').filter({ hasText: /\S/ });
  }

  async open(): Promise<void> {
    await this.page.goto(ENV.baseURL);
    await this.page.getByLabel('NIP', { exact: true }).waitFor();
  }

  async searchBy(type: SearchType, value: string): Promise<ApiResponse> {
    await this.getInput(type).fill(value);

    const responsePromise = this.page.waitForResponse(
      response =>
        response.url().includes('daneSzukaj') &&
        response.request().method() === 'POST'
    );

    await this.page.locator('#btnSzukaj').click();

    const response = await responsePromise;
    const body = await response.json();

    return {
      status: response.status(),
      body
    };
  }

  async submitSearch(type: SearchType, value: string): Promise<void> {
    await this.getInput(type).fill(value);
    await this.page.locator('#btnSzukaj').click();
  }

  async captureMessage(): Promise<string> {
    await this.messageLocator.waitFor();
    return await this.messageLocator.innerText();
  }

  private getInput(type: SearchType): Locator {
    if (type === 'regon') {
      return this.page.locator('#txtRegon');
    }

    if (type === 'nip') {
      return this.page.getByLabel('NIP', { exact: true });
    }

    return this.page.locator('#txtKrs');
  }
}

