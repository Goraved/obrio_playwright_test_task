import { Page } from '@playwright/test';
import { BaseDialog } from '../../common/components/baseDialogComponent';

/**
 * Dialog component for handling "Start Work" confirmation
 */
export class StartWorkDialog extends BaseDialog {
  constructor(page: Page) {
    // Pass the dialog title to the base constructor
    super(page, 'Start work');
  }
  
  async confirmStartWork(): Promise<void> {
    await this.confirm();
  }
  
  async cancelStartWork(): Promise<void> {
    await this.cancel();
  }
  
  async hasCorrectConfirmationText(): Promise<boolean> {
    const contentText = await this.getText();
    return contentText.includes('Are you sure you want to start work?');
  }
}