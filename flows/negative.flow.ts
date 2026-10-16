import { Locator } from '@playwright/test';
import { SearchPage, SearchType } from '../pages/search.page';
import { NegativeAssert } from '../assertions/negative.assert';

export class NegativeFlow {
  constructor(private searchPage: SearchPage) {}

  async searchInvalid(
    type: SearchType,
    value: string
  ): Promise<NegativeAssert> {
    await this.searchPage.open();

    const apiResponse = await this.searchPage.searchBy(type, value);

    return new NegativeAssert(
      apiResponse,
      this.searchPage.messageLocator
    );
  }

  async validateInput(type: SearchType, value: string): Promise<Locator> {
    await this.searchPage.open();
    await this.searchPage.submitSearch(type, value);

    return this.searchPage.messageLocator;
  }
}