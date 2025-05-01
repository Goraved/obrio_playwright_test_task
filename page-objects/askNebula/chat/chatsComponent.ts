import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Chats section in the chat sidebar
 */
export class ChatsComponent extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div[data-sentry-component="ChatsList"] div._section_aejpr_10:has(div._header_aejpr_30:has-text("Chats"))');
    super(rootLocator, page);
  }
  
  get chatItems() {
    return this.locator('li[data-testid="ordinary-chat"]');
  }
  
  getChatByExpertName(expertName: string): Locator {
    return this.locator(`a:has-text("${expertName}")`);
  }
  
  async clickOnChat(expertName: string): Promise<void> {
    const chatItem = this.getChatByExpertName(expertName);
    await chatItem.click();
  }
  
  async getChatCount(): Promise<number> {
    return await this.chatItems.count();
  }
}