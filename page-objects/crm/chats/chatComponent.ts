import { BaseComponent } from '../../baseComponent';
import { Locator, Page } from '@playwright/test';

export class ChatComponent extends BaseComponent {
    private readonly clientNameLabel: Locator;
    private readonly clientTypeIcon: Locator;
    private readonly clientBalanceText: Locator;
    private readonly clientBonusText: Locator;
    private readonly astrologerName: Locator;
    private readonly ratePerMinute: Locator;
    private readonly messageInput: Locator;
    private readonly sendButton: Locator;
    private readonly messagesContainer: Locator;
    private readonly supportButtons: Locator;

    constructor(page: Page) {
        const rootLocator = page.locator('section.MuiPaper-root.css-1lsnlgw').first();
        super(rootLocator, page);

        this.clientNameLabel = this.root.locator('.css-1wxdplh div');
        this.clientTypeIcon = this.root.locator('button svg[role="img"]');
        this.clientBalanceText = this.root.locator('.css-j7qwjs p.css-gcu0o4');
        this.clientBonusText = this.root.locator('.css-j7qwjs p.css-15ur9bs');
        this.astrologerName = this.root.locator('.css-yd8sa2 p.css-ignczi').first();
        this.ratePerMinute = this.root.locator('.css-15gai4d p.css-ignczi').first();
        this.messageInput = this.page.locator('textarea._input-new-message_ww1z2_4');
        this.sendButton = this.page.locator('button:has-text("Send")');
        this.messagesContainer = this.page.locator('div[data-testid="virtuoso-scroller"]');
        this.supportButtons = this.page.locator('.css-osyylf button');
    }

    async getClientName(): Promise<string> {
        return await this.clientNameLabel.textContent() || '';
    }

    async getClientType(): Promise<string> {
        const title = await this.clientTypeIcon.getAttribute('title') || '';
        return title;
    }

    async getClientBalance(): Promise<string> {
        return await this.clientBalanceText.textContent() || '';
    }

    async getClientBonus(): Promise<string> {
        return await this.clientBonusText.textContent() || '';
    }

    async getAstrologerName(): Promise<string> {
        return await this.astrologerName.textContent() || '';
    }

    async getRatePerMinute(): Promise<string> {
        return await this.ratePerMinute.textContent() || '';
    }

    async sendMessage(message: string): Promise<void> {
        await this.messageInput.fill(message);
        await this.sendButton.click();
    }

    async getMessages(): Promise<Locator[]> {
        return this.messagesContainer.locator('[data-message-id]').all();
    }

    async getMessageText(index: number): Promise<string> {
        const messages = await this.getMessages();
        if (index < messages.length) {
            return await messages[index].locator('.css-cbnw7b').textContent() || '';
        }
        return '';
    }

    async clickSupportButton(buttonText: string): Promise<void> {
        await this.supportButtons.filter({ hasText: buttonText }).click();
    }

    async isInputEnabled(): Promise<boolean> {
        return !(await this.messageInput.isDisabled());
    }

    async isSendButtonEnabled(): Promise<boolean> {
        return !(await this.sendButton.isDisabled());
    }
}

