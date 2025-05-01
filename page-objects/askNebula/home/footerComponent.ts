import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the footer section of the AskNebula site
 */
export class FooterComponent extends BaseComponent {
  constructor(root: Locator, page: Page) {
    super(root, page);
  }
  
  /**
   * ----- COMPONENT ELEMENTS -----
   */
  
  get termsLink() { return this.locator('a:has-text("Terms"), a[href*="terms"]'); }
  get privacyLink() { return this.locator('a:has-text("Privacy"), a[href*="privacy"]'); }
  get contactUsLink() { return this.locator('a:has-text("Contact"), a[href*="contact"]'); }
  get faqLink() { return this.locator('a:has-text("FAQ"), a[href*="faq"]'); }
  
  get socialMediaLinks() { return this.locator('.social-links a, .social-media a'); }
  get facebookLink() { return this.locator('a[href*="facebook"], a[aria-label="Facebook"]'); }
  get instagramLink() { return this.locator('a[href*="instagram"], a[aria-label="Instagram"]'); }
  get twitterLink() { return this.locator('a[href*="twitter"], a[aria-label="Twitter"]'); }
  
  get copyrightText() { return this.locator('.copyright, .copyright-text'); }
  
  async isDisplayed(): Promise<boolean> {
    return await this.root.isVisible();
  }
  
  async getCopyrightText(): Promise<string> {
    return await this.copyrightText.textContent() || '';
  }
  
  async clickTermsLink(): Promise<void> {
    if (await this.termsLink.isVisible()) {
      await this.termsLink.click();
    } else {
      throw new Error('Terms link is not visible');
    }
  }
  
  async clickPrivacyLink(): Promise<void> {
    if (await this.privacyLink.isVisible()) {
      await this.privacyLink.click();
    } else {
      throw new Error('Privacy link is not visible');
    }
  }
  
  async clickContactUsLink(): Promise<void> {
    if (await this.contactUsLink.isVisible()) {
      await this.contactUsLink.click();
    } else {
      throw new Error('Contact Us link is not visible');
    }
  }
  
  async clickFAQLink(): Promise<void> {
    if (await this.faqLink.isVisible()) {
      await this.faqLink.click();
    } else {
      throw new Error('FAQ link is not visible');
    }
  }
}