import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the "All Psychics" section
 * This section typically displays a grid of all available psychics with filters
 */
export class AllPsychicsComponent extends BaseComponent {
  constructor(root: Locator, page: Page) {
    super(root, page);
  }
  
  /**
   * ----- COMPONENT ELEMENTS -----
   */
  
  // Won't be implemented for the test task
};