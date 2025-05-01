import { Page } from '@playwright/test';
import { BasePage } from '../../basePage';
import { FavoritesComponent } from './favoritesComponent';
import { ChatsComponent } from './chatsComponent';
import { ChatMainComponent } from './mainChatComponent';
import { ChatExpertProfileComponent } from './profileComponent';
import { RefillCreditsDialog } from './creditsDialogComponent';
import { ConnectionDialog } from './connectionDialogComponent';
import {PaymentDialogComponent} from './paymentDialogComponent';

/**
 * Page object representing the Chat page in AskNebula
 */
export class AskNebulaChatPage extends BasePage {
    // Chat components
    readonly favorites: FavoritesComponent;
    readonly chats: ChatsComponent;
    readonly chatMain: ChatMainComponent;
    readonly expertProfile: ChatExpertProfileComponent;
    readonly refillCreditsDialog: RefillCreditsDialog;
    readonly connectionDialog: ConnectionDialog;
    readonly paymentDialog: PaymentDialogComponent;

    constructor(page: Page) {
        super(page);

        // Initialize all chat components
        this.favorites = new FavoritesComponent(page);
        this.chats = new ChatsComponent(page);
        this.chatMain = new ChatMainComponent(page);
        this.expertProfile = new ChatExpertProfileComponent(page);
        this.refillCreditsDialog = new RefillCreditsDialog(page);
        this.connectionDialog = new ConnectionDialog(page);
        this.paymentDialog = new PaymentDialogComponent(page);
    }

    async goto(): Promise<void> {
        await this.page.goto('https://stage-asknebula.asknebula.com/app/chat');
        await this.waitForPageLoad();
    }

    async waitForPageLoad(): Promise<void> {
        // Wait for the chat list to be visible
        await this.page.locator('div[data-sentry-component="ChatsList"]').waitFor({ state: 'visible', timeout: 10000 });
    }

    async openChatWithExpert(expertName: string): Promise<void> {
        await this.chats.clickOnChat(expertName);

        // Verify the chat opened with the correct expert
        const isWithExpert = await this.chatMain.isWithExpert(expertName);
        if (!isWithExpert) {
            throw new Error(`Failed to open chat with ${expertName}`);
        }
    }

    async sendMessage(message: string): Promise<void> {
        await this.chatMain.sendMessage(message);
    }

    async hasChats(): Promise<boolean> {
        const chatCount = await this.chats.getChatCount();
        return chatCount > 0;
    }

    async useIceBreakerSuggestion(index: number): Promise<void> {
        await this.chatMain.clickIceBreaker(index);
    }

    async addExpertToFavorites(): Promise<void> {
        await this.expertProfile.addToFavorites();
    }

    async viewExpertFullProfile(): Promise<void> {
        await this.expertProfile.viewFullProfile();
    }

    async canSendMessages(): Promise<boolean> {
        return await this.chatMain.messageInput.isEnabled();
    }

    async openSavedMessages(): Promise<void> {
        await this.favorites.clickSavedMessages();
    }
}