import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the "Accurate insights in your App" promo section
 * This promotes the mobile app to users with free credits offer
 */
export class AppPromoComponent extends BaseComponent {
  constructor(root: Locator, page: Page) {
    super(root, page);
  }
  
  /**
   * ----- COMPONENT ELEMENTS -----
   */
  
    // Won't be implemented for the test task
};