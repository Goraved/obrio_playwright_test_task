import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import { PageManager } from './page-objects/pageManager';
import { CrmLoginForm } from './page-objects/crm/login/loginForm';
import { CrmHeaderComponent } from './page-objects/crm/headerComponent';
import { CrmChatsPage } from './page-objects/crm/chats/chatsPage';
import { ActiveChatPage } from './page-objects/crm/chats/activeChatPage';

// Define our fixture types
type AskNebulaFixtures = {
  // Single context and multiple pages
  context: BrowserContext;
  userPage: Page;
  expertPage: Page;

  // Page managers
  pages: PageManager;          // User pages
  expertPages: PageManager;    // Expert pages
};

// Expert credentials for CRM
const EXPERT_EMAIL = 'shumitska@gmail.com';
const EXPERT_PASSWORD = 'Bn57!aF790';

// Export the extended test fixture
export const test = base.extend<AskNebulaFixtures>({
  // Create a single browser context for both user and expert
  context: async ({ browser }, use) => {
    const context = await browser.newContext();

    // Handle auth popup for staging environment
    context.on('dialog', async dialog => {
      if (dialog.type() === 'prompt') {
        await dialog.accept('asknebulastageauth');
      }
    });

    await use(context);
  },

  // Create a page for user interactions
  userPage: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },

  // Create a page for expert interactions and pre-authenticate
  expertPage: async ({ context, userPage }, use) => {
    // Store the original URL from the user page to return to it later if needed
    const originalUrl = userPage.url();

    // Create a page in the shared context
    const page = await context.newPage();

    // Authenticate as expert in CRM
    const loginForm = new CrmLoginForm(page);
    await loginForm.open();
    await loginForm.login(EXPERT_EMAIL, EXPERT_PASSWORD);

    const header = new CrmHeaderComponent(page);
    await header.waitForVisible();
    await page.waitForResponse('**/active-sessions');
    await expect(header.networkStatus).toContainText('Connected');

    if (await header.stopWorkButton.isVisible()) {
      if (await header.onlineStatus.textContent() === 'Busy') {
          await new CrmChatsPage(page).switchToInProgress();
          await new ActiveChatPage(page).stopChat();
      }
      await header.stopWork();
      await expect(header.onlineStatus).toContainText('Offline');

    }
    await header.startWork();
    await expect(header.onlineStatus).toContainText('Online');


    // Switch back to the user page after login
    if (originalUrl) {
      await userPage.bringToFront();
    }

    await use(page);
  },

  // Create a page manager for user pages
  pages: async ({ userPage }, use) => {
    const pages = new PageManager(userPage);
    await use(pages);
  },

  // Create a page manager for expert pages
  expertPages: async ({ expertPage }, use) => {
    const expertPages = new PageManager(expertPage);
    await use(expertPages);
  },
});

// Export expect for convenience
export { expect } from '@playwright/test';