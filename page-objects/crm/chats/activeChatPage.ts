import { BasePage } from "../../basePage";
import { Locator, Page } from '@playwright/test';

export class ActiveChatPage extends BasePage {
    // Header section locators
    readonly clientNameLabel: Locator;
    readonly astrologerName: Locator;
    readonly clientTypeIcon: Locator;
    readonly clientBalance: Locator;
    readonly clientBonus: Locator;
    readonly chatDuration: Locator;
    readonly ratePerMinute: Locator;
    readonly stopButton: Locator;

    // Chat section locators
    readonly messageContainer: Locator;
    readonly messageInput: Locator;
    readonly sendButton: Locator;
    readonly expandButton: Locator;
    readonly supportButtons: Locator;
    readonly messages: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize header section locators
        this.clientNameLabel = this.page.locator('.css-rewu0l .css-1wxdplh div');
        this.astrologerName = this.page.locator('.css-zwnr44 + p.css-1nxyfug');
        this.clientTypeIcon = this.page.locator('button svg[role="img"][title]');
        this.clientBalance = this.page.locator('.css-j7qwjs p.css-gcu0o4');
        this.clientBonus = this.page.locator('.css-j7qwjs p.css-15ur9bs');
        this.chatDuration = this.page.locator('.css-15gai4d p.css-ignczi').first();
        this.ratePerMinute = this.page.locator('.css-15gai4d p.css-ltqkql');
        this.stopButton = this.page.locator('button:has-text("Stop")');

        // Initialize chat section locators
        this.messageContainer = this.page.locator('[data-testid="virtuoso-scroller"]');
        this.messageInput = this.page.locator('textarea._input-new-message_ww1z2_4');
        this.sendButton = this.page.locator('button:has-text("Send")');
        this.expandButton = this.page.locator('.css-1544mbg');
        this.supportButtons = this.page.locator('.css-osyylf button');
        this.messages = this.page.locator('[data-message-id]');
    }

    // Chat interaction methods
    async sendMessage(message: string): Promise<void> {
        await this.messageInput.fill(message);
        await this.sendButton.click();
    }

    async stopChat(reason?: string): Promise<void> {
        // Click the initial stop button
        await this.stopButton.click();
        
        // Wait for the dialog to appear
        const reasonDialog = this.page.locator('section[role="dialog"] h2:has-text("Stop chat")').first();
        await reasonDialog.waitFor({ state: 'visible' });
        
        // Select a reason (default to the first one if not specified)
        const reasonToSelect = reason || "The client is repeatedly rude or uses obscene language";
        await this.page.locator(`p:has-text("${reasonToSelect}")`).click();
        
        // Click the Stop button in the dialog
        await this.page.locator('section[role="dialog"] button:has-text("Stop")').click();
    }

    async clickSupportButton(buttonText: string): Promise<void> {
        await this.supportButtons.filter({ hasText: buttonText }).click();
    }

    async toggleExpand(): Promise<void> {
        await this.expandButton.click();
    }

    // Chat information methods
    async getChatDuration(): Promise<string> {
        return await this.chatDuration.textContent() || '';
    }

    async getRatePerMinute(): Promise<string> {
        return await this.ratePerMinute.textContent() || '';
    }

    async getMessages(): Promise<Locator[]> {
        return await this.messages.all();
    }

    async getLastMessageText(): Promise<string> {
        const messages = await this.getMessages();
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            return await lastMessage.locator('.css-cbnw7b').textContent() || '';
        }
        return '';
    }

    async isSendButtonEnabled(): Promise<boolean> {
        return !(await this.sendButton.isDisabled());
    }
}
