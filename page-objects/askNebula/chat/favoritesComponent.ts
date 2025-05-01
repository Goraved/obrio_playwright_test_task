import { Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Favorites section in the chat sidebar
 */
export class FavoritesComponent extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div[data-sentry-component="ChatsList"] div._section_aejpr_10:has(div._header_aejpr_30:has-text("Favorites"))');
    super(rootLocator, page);
  }
  
  get favoriteItems() {
    return this.locator('li[data-testid="saved-messages-chat"]');
  }
  
  get savedMessagesItem() {
    return this.locator('a:has-text("Saved messages")');
  }
  
  async clickSavedMessages(): Promise<void> {
    await this.savedMessagesItem.click();
  }
  
  async hasFavorites(): Promise<boolean> {
    const count = await this.favoriteItems.count();
    return count > 0;
  }
}