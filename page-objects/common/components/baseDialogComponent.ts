import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Base component for handling dialog windows in the application
 * Provides common methods and properties for all dialog types
 */
export class BaseDialog extends BaseComponent {
  private readonly dialogTitle: string;

  /**
   * Constructor
   * 
   * @param page The Playwright page
   * @param dialogTitle The title text of the dialog to locate
   */
  constructor(page: Page, dialogTitle: string) {
    // Find dialog by title
    const rootLocator = page.locator(`section.MuiDialog-paper:has(h2:text-is("${dialogTitle}"))`);
    super(rootLocator, page);
    this.dialogTitle = dialogTitle;
  }

  /**
   * ----- DIALOG ELEMENTS -----
   */
  
  // Dialog title
  get title() {
    return this.locator('h2.MuiDialogTitle-root');
  }
  
  // Dialog content area
  get content() {
    return this.locator('div.MuiDialogContent-root');
  }
  
  // Dialog content text
  get contentText() {
    return this.locator('div.MuiDialogContentText-root');
  }
  
  // Dialog actions area (buttons container)
  get actions() {
    return this.locator('div.MuiDialogActions-root');
  }
  
  // Close button (X in the corner)
  get closeButton() {
    return this.locator('button:has(svg[data-testid="CloseIcon"])');
  }
  
  // Yes/Confirm button
  get confirmButton() {
    return this.actions.locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("OK")');
  }
  
  // No/Cancel button
  get cancelButton() {
    return this.actions.locator('button:has-text("No"), button:has-text("Cancel")');
  }
  
  // Get any button by text
  getButton(text: string): Locator {
    return this.actions.locator(`button:has-text("${text}")`);
  }
  
  // Get input by label
  getInputByLabel(label: string): Locator {
    return this.content.locator(`label:has-text("${label}")`).locator('xpath=../input');
  }
  
  /**
   * ----- DIALOG ACTIONS -----
   */
  
  
  /**
   * Check if the dialog is currently visible
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible();
  }
  
  /**
   * Close the dialog by clicking the X button
   */
  async close(): Promise<void> {
    await this.closeButton.click();
    await this.waitForHidden();
  }
  
  /**
   * Confirm the dialog by clicking the Yes/Confirm/OK button
   */
  async confirm(): Promise<void> {
    await this.confirmButton.click();
    await this.waitForHidden();
  }
  
  /**
   * Cancel the dialog by clicking the No/Cancel button
   * If there's no cancel button, it will use the close button
   */
  async cancel(): Promise<void> {
    if (await this.isVisible()) {
      if (await this.cancelButton.isVisible()) {
        await this.cancelButton.click();
      } else {
        await this.closeButton.click();
      }
      await this.waitForHidden();
    } else {
      throw new Error(`Dialog "${this.dialogTitle}" is not visible, cannot cancel`);
    }
  }
  
  /**
   * Click a button in the dialog by its text
   * 
   * @param text Button text
   */
  async clickButton(text: string): Promise<void> {
    const button = this.getButton(text);
    if (await button.isVisible()) {
      await button.click();
    } else {
      throw new Error(`Button "${text}" not found in dialog "${this.dialogTitle}"`);
    }
  }
  
  /**
   * Enter text into an input field identified by its label
   * 
   * @param label The label text associated with the input
   * @param value The value to enter
   */
  async fillInput(label: string, value: string): Promise<void> {
    const input = this.getInputByLabel(label);
    if (await input.isVisible()) {
      await input.fill(value);
    } else {
      throw new Error(`Input with label "${label}" not found in dialog "${this.dialogTitle}"`);
    }
  }
}