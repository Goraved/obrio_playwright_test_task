import { BasePage } from "../../basePage";
import { NotificationComponent } from './notificationComponent';
import { ChatListItemComponent } from './chatListItemComponent';
import { ChatComponent } from './chatComponent';

export class CrmChatsPage extends BasePage {

    // Locators
    private readonly chatsList = 'div.chats-list';
    private readonly chatItem = '.chat-item';
    private readonly searchInput = 'input[placeholder="Search chats"]';
    private readonly filterButton = 'button.filter-button';
    private readonly allChatsButton = 'button:has-text("ALL CHATS")';
    private readonly inProgressButton = 'button:has-text("IN PROGRESS")';
    private readonly chatEntries = 'a.MuiListItemButton-root';
    private readonly searchByNameInput = 'input[placeholder="Search by name"]';

    async navigate() {
        await this.page.goto('/crm/chats');
    }

    async searchChat(query: string) {
        await this.page.fill(this.searchInput, query);
        await this.page.keyboard.press('Enter');
    }

    async searchByName(name: string) {
        await this.page.fill(this.searchByNameInput, name);
        await this.page.keyboard.press('Enter');
    }

    async openChat(index: number) {
        await this.page.locator(this.chatItem).nth(index).click();
    }

    async getChatItems(): Promise<ChatListItemComponent[]> {
        return await this.getListOfComponents(this.chatEntries, ChatListItemComponent);
    }

    async getNotifications(): Promise<NotificationComponent[]> {
        return await this.getListOfComponents('section.MuiPaper-root.css-s6ipg3', NotificationComponent);
    }

    async getChat(): Promise<ChatComponent> {
        return new ChatComponent(this.page);
    }

    async switchToAllChats() {
        await this.page.locator(this.allChatsButton).click();
    }
    async switchToInProgress() {
        await this.page.locator(this.inProgressButton).click();
    }
}