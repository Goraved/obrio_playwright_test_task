import { Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Connection Dialog in the chat
 * This dialog appears when connecting to an expert/psychic
 */
export class ConnectionDialog extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div[data-testid="connection-pop-up"]');
    super(rootLocator, page);
  }
  
  /**
   * ----- DIALOG ELEMENTS -----
   */
  
  get closeButton() {
    return this.locator('button[data-testid="close-button"]');
  }
  
  get title() {
    return this.locator('h3._title_1h7sm_21');
  }
  
  get expertAvatar() {
    return this.locator('div._avatarWrapper_1h7sm_40 svg, div._avatarWrapper_1h7sm_40 img');
  }
  
  get expertName() {
    return this.locator('p._name_1h7sm_80');
  }
  
  get progressLoader() {
    return this.locator('span[role="progressbar"]');
  }
  
  get infoListItems() {
    return this.locator('li._item_1h7sm_95 p._itemText_1h7sm_127');
  }
  
  /**
   * ----- DIALOG ACTIONS -----
   */
  
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible();
  }
  
  async close(): Promise<void> {
    await this.closeButton.click();
    await this.waitForHidden();
  }
  
  
  async waitForConnection(timeout = 30000): Promise<boolean> {
    try {
      await this.root.waitFor({ state: 'hidden', timeout });
      console.log('Connection completed successfully');
      return true;
    } catch (error) {
      console.log('Connection did not complete within the timeout period');
      return false;
    }
  }
  
  async getInfoListTexts(): Promise<string[]> {
    const items = await this.infoListItems.all();
    const texts: string[] = [];
    
    for (const item of items) {
      const text = await item.textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    
    return texts;
  }
  
  async isLoading(): Promise<boolean> {
    return await this.progressLoader.isVisible();
  }
  
  async getExpertNameFromTitle(): Promise<string> {
    const titleText = await this.title.textContent() || '';
    // Extract expert name from text like "Connecting you to Test astrologer so you can get the answer to your question"
    const match = titleText.match(/to\s+(.+?)\s+so/);
    return match ? match[1].trim() : '';
  }
}