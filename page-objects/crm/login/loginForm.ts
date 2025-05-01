import { Page } from '@playwright/test';
import { BasePage } from '../../basePage';

/**
 * Page object representing the AstroCRM login form
 * Based on the provided HTML structure
 */
export class CrmLoginForm extends BasePage {
  // Define locators based on the exact HTML structure
  get emailInput() { return this.page.locator('input[name="email"]'); }
  get passwordInput() { return this.page.locator('input[name="password"]'); }
  get loginButton() { return this.page.locator('button[type="submit"]'); }
  get emailLabel() { return this.page.locator('label[for=":r0:"]'); }
  get passwordLabel() { return this.page.locator('label[for=":r1:"]'); }
  get showPasswordButton() { return this.page.locator('button:has(svg[data-testid="VisibilityOffOutlinedIcon"])'); }
  get pageTitle() { return this.page.locator('h1.MuiTypography-h4:has-text("Welcome to AstroCRM")'); }
  get subtitle() { return this.page.locator('p.MuiTypography-body2:has-text("Enter your details")'); }

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('https://stage-astrocrm.obrio.net/login');
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Toggle password visibility to check the password is correct
    if (await this.showPasswordButton.isVisible()) {
      await this.showPasswordButton.click();
    }
    
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForURL('**/chat', { timeout: 20000 });
  }

  async getValidationErrors(): Promise<string[]> {
    const errorMessages = await this.page.locator('.Mui-error, .MuiFormHelperText-root').allTextContents();
    return errorMessages.map(text => text.trim()).filter(text => text.length > 0);
  }

  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible() && 
           await this.emailInput.isVisible() && 
           await this.passwordInput.isVisible() &&
           await this.loginButton.isVisible();
  }
}