import { Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Refill Credits Dialog in the chat
 * This dialog appears when a user needs to refill credits to continue a reading
 */
export class RefillCreditsDialog extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div.MuiDialog-paper:has(div[data-sentry-component="DefaultPackages"])');
    super(rootLocator, page);
  }
  
  /**
   * ----- DIALOG ELEMENTS -----
   */
  
  get closeButton() {
    return this.locator('button[data-testid="close-button"]');
  }
  
  get title() {
    return this.locator('h3._title_19qa1_55');
  }
  
  get subtitle() {
    return this.locator('h4._subtitle_19qa1_61');
  }
  
  get creditsAmount() {
    return this.locator('p[data-testid="credits-amount"]');
  }
  
  get discountLabel() {
    return this.locator('div[data-testid="refill-credits-discount"]');
  }
  
  get oldPrice() {
    return this.locator('span[data-testid="refill-credits-old-price"]');
  }
  
  get currentPrice() {
    return this.locator('span[data-testid="refill-credits-price"]');
  }
  
  get continueButton() {
    return this.locator('button[data-testid="top-up-refill-credits-btn"]');
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
  
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
  
  async getExpertName(): Promise<string> {
    const subtitleText = await this.subtitle.textContent() || '';
    // Extract expert name from text like "Refill and continue to get insights with Test astrologer"
    const match = subtitleText.match(/with\s+(.+)$/);
    return match ? match[1].trim() : '';
  }
  
  async getDiscountPercentage(): Promise<string> {
    const discountText = await this.discountLabel.textContent() || '';
    const match = discountText.match(/(-?\d+%)/);
    return match ? match[1] : '';
  }
  
  async getPriceInfo(): Promise<{oldPrice: string, currentPrice: string}> {
    return {
      oldPrice: await this.oldPrice.textContent() || '',
      currentPrice: await this.currentPrice.textContent() || ''
    };
  }
  
  async getDialogInfo(): Promise<{
    expertName: string,
    creditsAmount: string,
    discount: string,
    oldPrice: string,
    currentPrice: string
  }> {
    const [expertName, creditsAmountText, discount, priceInfo] = await Promise.all([
      this.getExpertName(),
      this.creditsAmount.textContent(),
      this.getDiscountPercentage(),
      this.getPriceInfo()
    ]);
    
    const creditsAmount = creditsAmountText || '';
    
    return {
      expertName,
      creditsAmount,
      discount,
      oldPrice: priceInfo.oldPrice,
      currentPrice: priceInfo.currentPrice
    };
  }
}