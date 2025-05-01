import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../baseComponent';

/**
 * Component representing the navigation sidebar in AstroCRM
 * Based on the provided HTML structure
 */
export class NavigationComponent extends BaseComponent {
  constructor(page: Page) {
    // Find the navigation drawer in the document
    const rootLocator = page.locator('section.MuiDrawer-paper');
    super(rootLocator, page);
  }
  
  /**
   * ----- COMPONENT ELEMENTS -----
   */
  
  // Expand/collapse button
  get expandButton() { 
    return this.locator('button svg[viewBox="0 0 24 24"]:has(path[d*="M16.4058 12L12.3481"])'); 
  }
  
  // Navigation menu items
  get workflowButton() { 
    return this.locator('div.MuiListItemButton-root:has(p:text("Workflow"))'); 
  }
  
  get salaryButton() { 
    return this.locator('div.MuiListItemButton-root:has(p:text("Salary"))'); 
  }
  
  get userManagementButton() { 
    return this.locator('div.MuiListItemButton-root:has(p:text("User management"))'); 
  }
  
  /**
   * ----- ADDITIONAL SELECTORS - Add more as needed -----
   */
  
  // Generic method to get any navigation item by text
  getNavigationItem(text: string) {
    return this.locator(`div.MuiListItemButton-root:has(p:text("${text}"))`);
  }
  
  /**
   * ----- COMPONENT ACTIONS -----
   */
  
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible();
  }
  
  async expand(): Promise<void> {
    // Check if the navigation is already expanded
    const isExpanded = await this.isExpanded();
    
    if (!isExpanded) {
      await this.expandButton.click();
    }
  }
  
  async collapse(): Promise<void> {
    // Check if the navigation is already collapsed
    const isExpanded = await this.isExpanded();
    
    if (isExpanded) {
      await this.expandButton.click();
    }
  }
  
  async isExpanded(): Promise<boolean> {
    // This implementation might need adjustment based on actual UI behavior
    // Here we're checking if navigation text is visible as an indicator
    const textVisible = await this.locator('p.MuiTypography-body1').first().isVisible();
    return textVisible;
  }
  
  async navigateToWorkflow(): Promise<void> {
    await this.workflowButton.click();
  }
  
  async navigateToSalary(): Promise<void> {
    await this.salaryButton.click();
  }
  
  async navigateToUserManagement(): Promise<void> {
    await this.userManagementButton.click();
  }
  
  async navigateToSection(sectionName: string): Promise<void> {
    const navigationItem = this.getNavigationItem(sectionName);
    
    if (await navigationItem.count() === 0) {
      throw new Error(`Navigation section "${sectionName}" not found`);
    }
    
    await navigationItem.click();
  }
  
  async getAvailableSections(): Promise<string[]> {
    const sectionElements = await this.locator('div.MuiListItemButton-root p').all();
    const sections: string[] = [];
    
    for (const element of sectionElements) {
      const text = await element.textContent();
      if (text) {
        sections.push(text.trim());
      }
    }
    
    return sections;
  }
  
  async hasSection(sectionName: string): Promise<boolean> {
    const navigationItem = this.getNavigationItem(sectionName);
    return await navigationItem.count() > 0;
  }
}