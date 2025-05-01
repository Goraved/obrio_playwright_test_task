import { Page } from '@playwright/test';
import { BasePage } from '../../basePage';

export class AskNebulaLoginForm extends BasePage {
  // Page navigation elements
  get loginNavLink() { return this.page.locator('a[href="/app/login"]'); }
  get signUpNavLink() { return this.page.locator('a[href="/app/signup"]'); }
  
  // Login form elements
  get emailInput() { return this.page.locator('input[name="email"]'); }
  get passwordInput() { return this.page.locator('input[name="password"]'); }
  get loginButton() { return this.page.locator('button[type="submit"], button:has-text("Log in")'); }
  get showPasswordButton() { return this.page.locator('button._eyeButton_45klc_52, button:has(svg.._eyeIcon_45klc_60)'); }
  get googleLoginButton() { return this.page.locator('button._google_hqeko_45, button:has-text("Log in with Google")'); }
  get forgotPasswordLink() { return this.page.locator('a[href="/app/forgot-password"]'); }
  
  // Page titles and elements
  get pageTitle() { return this.page.locator('h2._title_hqeko_36, h2:has-text("Welcome back")'); }
  get emailErrorText() { return this.page.locator('span[role="alert"]:below(input[name="email"])'); }
  get passwordErrorText() { return this.page.locator('span[role="alert"]:below(input[name="password"])'); }
  
  async open(): Promise<void> {
    await this.page.goto('https://stage-asknebula.asknebula.com/app/login');
    await this.handleAuthPopup();
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }
  
  private async handleAuthPopup(): Promise<void> {
    try {
      const authPromptHandle = await Promise.race([
        this.page.waitForEvent('dialog', { timeout: 5000 }),
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      
      if (authPromptHandle && authPromptHandle !== null) {
        await (authPromptHandle as any).accept('asknebulastageauth');
      }
    } catch (error) {
      console.log('No authentication dialog detected or handler timed out');
    }
  }

  async navigateToSignUp(): Promise<void> {
    await this.signUpNavLink.click();
    await this.page.waitForSelector('form:has-text("Create an account")', { timeout: 10000 });
  }

  async login(email: string, password: string): Promise<boolean> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    try {
      await this.page.waitForNavigation({ timeout: 10000 });
      return true;
    } catch (error) {
      const hasErrors = await this.hasValidationErrors();
      if (hasErrors) {
        console.log('Login failed due to validation errors');
        return false;
      }
      
      console.log('Login attempt completed but no navigation occurred');
      return false;
    }
  }
  
  async hasValidationErrors(): Promise<boolean> {
    const emailError = await this.emailErrorText.isVisible();
    const passwordError = await this.passwordErrorText.isVisible();
    return emailError || passwordError;
  }
  
  async getValidationErrors(): Promise<{email?: string, password?: string}> {
    const errors: {email?: string, password?: string} = {};
    
    if (await this.emailErrorText.isVisible()) {
      errors.email = await this.emailErrorText.textContent() || '';
    }
    
    if (await this.passwordErrorText.isVisible()) {
      errors.password = await this.passwordErrorText.textContent() || '';
    }
    
    return errors;
  }
  
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('**/forgot-password', { timeout: 10000 });
  }
  
  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordButton.click();
  }
}