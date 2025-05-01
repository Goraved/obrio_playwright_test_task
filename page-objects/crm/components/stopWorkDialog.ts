import { Page } from '@playwright/test';
import { BaseDialog } from '../../common/components/baseDialogComponent';

/**
 * Dialog component for handling "Stop Work" confirmation
 */
export class StopWorkDialog extends BaseDialog {
  constructor(page: Page) {
    // Pass the dialog title to the base constructor
    super(page, 'Stop work');
  }
  
  async confirmStopWork(): Promise<void> {
    await this.confirm();
  }
  
  async cancelStopWork(): Promise<void> {
    await this.cancel();
  }
}