import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Verify Email Modal that appears after signup
 * Based on the provided HTML structure
 */
export class VerifyEmailModal extends BaseComponent {
  get closeButton() { 
    return this.locator('button[data-testid="close-button"]'); 
  }
  
  get resendButton() { 
    return this.locator('button:has-text("Resend")'); 
  }
  
  get checkInboxButton() { 
    return this.locator('button:has-text("Check inbox")'); 
  }
  
  get title() {
    return this.locator('div._title_ke8py_24');
  }
  
  get textElements() {
    return this.locator('p._text_ke8py_34');
  }
  
  get emailIcon() {
    return this.locator('img[alt="letter"]');
  }
  
  constructor(page: Page) {
    // Use a selector that uniquely identifies the verify email modal
    const rootLocator = page.locator('div[data-sentry-component="EmailResend"]');
    super(rootLocator, page);
  }
  
  async isDisplayed(): Promise<boolean> {
    return await this.root.isVisible();
  }
  
  async waitForDisplay(timeout = 10000): Promise<boolean> {
    try {
      await this.root.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      console.log('Verify email modal did not appear within the timeout period');
      return false;
    }
  }
  
  async close(): Promise<void> {
    await this.closeButton.click();
  }
  
  async resendVerificationEmail(): Promise<void> {
    await this.resendButton.click();
  }
  
  async checkInbox(): Promise<void> {
    await this.checkInboxButton.click();
  }
  
  async getTitleText(): Promise<string> {
    return (await this.title.textContent()) || '';
  }
  
  async getTextContents(): Promise<string[]> {
    const textElements = await this.textElements.all();
    const texts: string[] = [];
    
    for (const element of textElements) {
      const text = await element.textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    
    return texts;
  }
  
  async isEmailIconDisplayed(): Promise<boolean> {
    return await this.emailIcon.isVisible();
  }
  
  async handleModal(action: 'close' | 'resend' | 'checkInbox'): Promise<void> {
    if (await this.waitForDisplay()) {
      switch (action) {
        case 'close':
          await this.close();
          break;
        case 'resend':
          await this.resendVerificationEmail();
          break;
        case 'checkInbox':
          await this.checkInbox();
          break;
      }
    }
  }
}