import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the Header section of the AskNebula site
 * Based on the provided HTML structure
 */
export class HeaderComponent extends BaseComponent {
  /**
   * ----- HEADER ELEMENTS -----
   */
  
  get logo() { return this.locator('a._logoWrapper_v6bwk_42'); }
  
  get navLinks() { return this.locator('nav._nav_t3u3h_48 ul._navList_t3u3h_53 li'); }
  get psychicsNavLink() { return this.locator('a[href="/app/experts"]'); }
  get chatroomNavLink() { return this.locator('a[href="/app/chat"]'); }
  get horoscopeNavLink() { return this.locator('a[href="/app/horoscope"]'); }
  
  get userMenuDropdown() { return this.locator('div._userDropdown_t3u3h_75'); }
  get userAvatar() { return this.locator('div._nameAvatar_mqy2a_9'); }
  get userAvatarText() { return this.userAvatar.locator('text=*'); } // Gets the user's initials in the avatar
  
  get dropdownMenu() { return this.page.locator('div._menu_7hy32_1'); }
  get profileLink() { return this.dropdownMenu.locator('a[href="/app/profile"]'); }
  get settingsLink() { return this.dropdownMenu.locator('a[href="/app/settings/personal"]'); }
  get faqLink() { return this.dropdownMenu.locator('a[href="/app/faq"]'); }
  get contactUsLink() { return this.dropdownMenu.locator('a[href="/app/support"]'); }
  get logoutButton() { return this.dropdownMenu.locator('div._link_1p7jx_15[role="button"]:has-text("Log out")'); }
  
  constructor(root: Locator, page: Page) {
    super(root, page);
  }
  
  async isUserLoggedIn(): Promise<boolean> {
    return await this.userAvatar.isVisible();
  }
  
  async openUserMenu(): Promise<void> {
    if (!(await this.dropdownMenu.isVisible())) {
      await this.userMenuDropdown.click();
      // Wait for menu to be visible
      await this.dropdownMenu.waitFor({ state: 'visible', timeout: 5000 });
    }
  }
  
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
    
    // Wait for redirect to login page
    await this.page.waitForURL('**/login', { timeout: 10000 });
  }
  
  async navigateToProfile(): Promise<void> {
    await this.openUserMenu();
    await this.profileLink.click();
    
    // Wait for navigation
    await this.page.waitForURL('**/profile', { timeout: 10000 });
  }
  
  async navigateTo(section: 'psychics' | 'chatroom' | 'horoscope'): Promise<void> {
    switch (section) {
      case 'psychics':
        await this.psychicsNavLink.click();
        await this.page.waitForURL('**/experts', { timeout: 10000 });
        break;
      case 'chatroom':
        await this.chatroomNavLink.click();
        await this.page.waitForURL('**/chat', { timeout: 10000 });
        break;
      case 'horoscope':
        await this.horoscopeNavLink.click();
        await this.page.waitForURL('**/horoscope', { timeout: 10000 });
        break;
    }
  }
  
  async getUserInitials(): Promise<string> {
    return await this.userAvatarText.textContent() || '';
  }
}