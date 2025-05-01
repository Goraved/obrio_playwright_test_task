import { Page } from '@playwright/test';
import { BasePage } from '../../basePage';

/**
 * Page object representing the AskNebula signup form
 * Based on the updated HTML structure
 */
export class AskNebulaSignUpForm extends BasePage {
  // Navigation elements
  get loginNavLink() { return this.page.locator('a[href="/app/login"]'); }
  get signUpNavLink() { return this.page.locator('a[href="/app/signup"]'); }
  
  // Step 1 - Gender and Name
  get createAccountTitle() { return this.page.locator('h3._title_13wz0_7'); }
  get womanRadioButton() { return this.page.locator('[data-testid="woman-radio-button"]'); }
  get manRadioButton() { return this.page.locator('[data-testid="man-radio-button"]'); }
  get nameInput() { return this.page.locator('input[name="name"]'); }
  
  // Step 2 - Birthdate selection
  get daySelect() { return this.page.locator('select#day'); }
  get monthSelect() { return this.page.locator('select#month'); }
  get yearSelect() { return this.page.locator('select#year'); }
  
  // Step 3 - Email and Password
  get emailInput() { return this.page.locator('input[name="email"]'); }
  get passwordInput() { return this.page.locator('input[name="password"]'); }
  get confirmPasswordInput() { return this.page.locator('input[name="confirmPassword"]'); }
  get privacyConsentCheckbox() { return this.page.locator('label:has-text("I agree to the AskNebula")'); }
  get emailConsentCheckbox() { return this.page.locator('input#emailConsent[name="emailConsent"]'); }
  get policyCheckboxByTestId() { return this.page.locator('[data-testid="policy-checkbox"]'); }
  get specialOffersCheckboxByTestId() { return this.page.locator('[data-testid="special-offers-checkbox"]'); }
  
  // Common elements
  get continueButton() { return this.page.locator('button[data-testid="submit-button"]'); }
  get stepIndicators() { return this.page.locator('ul._stepList_1g2c3_1 li'); }
  get letsGoButton() { return this.page.locator('button[data-testid="lets-go-button"]'); }
  
  async open(): Promise<void> {
    await this.page.goto('https://stage-asknebula.asknebula.com/app/signup');
    await this.createAccountTitle.waitFor({ state: 'visible' });
  }
  
  async completeStep1(name: string, gender: 'male' | 'female'): Promise<void> {
    // Select gender
    if (gender === 'female') {
      await this.womanRadioButton.click();
    } else {
      await this.manRadioButton.click();
    }
    
    // Enter name
    await this.nameInput.fill(name);
    
    // Continue to next step
    await this.continueButton.click();
    await this.daySelect.waitFor({ state: 'visible' });
  }
  
  async completeStep2(birthDate: string): Promise<void> {
    // Parse the birthdate
    const [day, month, year] = birthDate.split('/');
    
    // Convert month number to month name (1 -> Jan, 2 -> Feb, etc.)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];
    
    // Select day, month, and year
    await this.daySelect.selectOption(day);
    await this.monthSelect.selectOption(monthName);
    await this.yearSelect.selectOption(year);
    
    // Continue to next step
    await this.continueButton.click();
    await this.emailInput.waitFor({ state: 'visible' });
  }
  
  async completeStep3(email: string, password: string): Promise<void> {
    // Enter email and password
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    
    // Check required checkboxes
    await this.privacyConsentCheckbox.click();
    
    // Continue to complete registration
    await this.continueButton.click();
    
    // Wait for redirection to home page after successful signup
    await this.page.waitForURL('**/app/signup/succeed');
  }
  
  async completeSignUp(userData: {
    name: string,
    gender: 'male' | 'female',
    email: string,
    password: string,
    birthDate: string
  }): Promise<void> {
    await this.open();
    await this.completeStep1(userData.name, userData.gender);
    await this.completeStep2(userData.birthDate);
    await this.completeStep3(userData.email, userData.password);
  }
  
  async getCurrentStep(): Promise<number> {
    const activeStep = await this.page.locator('ul._stepList_1g2c3_1 li:has(span._stepCompleted_1g2c3_24)').count();
    return activeStep + 1;
  }
  
  async navigateToLogin(): Promise<void> {
    await this.loginNavLink.click();
  }
}