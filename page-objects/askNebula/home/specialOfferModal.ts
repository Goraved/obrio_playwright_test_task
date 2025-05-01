import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Special Offer Modal that appears after signup
 * Based on the provided HTML structure
 */
export class SpecialOfferModal extends BaseComponent {
  get closeButton() { 
    return this.locator('button[data-testid="close-button"]'); 
  }
  
  get continueButton() { 
    return this.locator('button:has-text("Continue")'); 
  }
  
  get packageOffers() { 
    return this.locator('div[data-testid="refill-credits-offer"]'); 
  }
  
  get bestValuePackage() { 
    return this.locator('div[data-testid="refill-credits-offer"]:has(div._labelBestValue_1qsre_150)'); 
  }
  
  constructor(page: Page) {
    // Use a selector that uniquely identifies the special offer modal
    const rootLocator = page.locator('div[data-sentry-component="LiveOpsPackages"]');
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
      console.log('Special offer modal did not appear within the timeout period');
      return false;
    }
  }
  
  async close(): Promise<void> {
    await this.closeButton.click();
      
    // Wait for modal to disappear
    await this.root.waitFor({ state: 'hidden', timeout: 5000 })
      .catch(() => console.log('Modal did not hide after clicking close'));
  }
  
  async selectPackageByIndex(index: number): Promise<void> {
    const packages = await this.packageOffers.all();
    
    if (index < 0 || index >= packages.length) {
      throw new Error(`Invalid package index: ${index}. Available packages: ${packages.length}`);
    }
    
    await packages[index].click();
  }
  
  async selectPackageByPrice(price: string): Promise<void> {
    const packageWithPrice = this.locator(`div[data-testid="refill-credits-offer"]:has(span[data-testid="refill-credits-price"]:text-is("${price}"))`);
    
    if (await packageWithPrice.count() === 0) {
      throw new Error(`No package found with price ${price}`);
    }
    
    await packageWithPrice.click();
  }
  
  async getPackageDetails(): Promise<Array<{
    price: string;
    credits: string;
    extraCredits: string;
    isBestValue: boolean;
  }>> {
    const packages = await this.packageOffers.all();
    const details: Array<{
      price: string;
      credits: string;
      extraCredits: string;
      isBestValue: boolean;
    }> = [];
    
    for (const pkg of packages) {
      const price = await pkg.locator('span[data-testid="refill-credits-price"]').textContent() || '';
      const credits = await pkg.locator('p[data-testid="credits-amount"]').textContent() || '';
      const extraCredits = await pkg.locator('strong[data-testid="extra-credits-amount"]').textContent() || '';
      const bestValueLabel = await pkg.locator('div._labelBestValue_1qsre_150').count() > 0;
      
      details.push({
        price: price.trim(),
        credits: credits.trim(),
        extraCredits: extraCredits.trim(),
        isBestValue: bestValueLabel
      });
    }
    
    return details;
  }
  
  async continueWithSelectedPackage(): Promise<void> {
    await this.continueButton.click();
    
    // Wait for navigation or next step
    await this.page.waitForTimeout(2000);
  }
  
  async handleOffer(accept: boolean): Promise<void> {
    if (await this.waitForDisplay()) {
      if (accept) {
        await this.continueWithSelectedPackage();
      } else {
        await this.close();
      }
    }
  }
}