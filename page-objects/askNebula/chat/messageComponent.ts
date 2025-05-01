import { BaseComponent } from '../../baseComponent';
import { Locator, Page } from '@playwright/test';

export class MessageComponent extends BaseComponent {
    readonly messageText: Locator;
    readonly timestamp: Locator;
    readonly saveButton: Locator;
    readonly messageContent: Locator;

    constructor(root: Locator, page: Page) {
        super(root, page);

        this.messageText = this.root.locator('div[data-testid="chat-message-text"]');
        this.timestamp = this.root.locator('div[data-sentry-component="MessageTimestamp"]');
        this.saveButton = this.root.locator('button[data-testid="save-message-button"]');
        this.messageContent = this.root.locator('div[data-sentry-component="MessageContent"]');
    }

    async getMessageId(): Promise<string> {
        const parent = this.root.locator('xpath=..');
        return await parent.getAttribute('data-messageid') || '';
    }

    async getText(): Promise<string> {
        return (await this.messageText.textContent()) || '';
    }

    async getTimestamp(): Promise<string> {
        return (await this.timestamp.textContent()) || '';
    }

    async isIncoming(): Promise<boolean> {
        const classes = await this.root.getAttribute('class') || '';
        return classes.includes('_wrapperIncoming_');
    }

    async isOutgoing(): Promise<boolean> {
        const classes = await this.root.getAttribute('class') || '';
        return classes.includes('_wrapperOutgoing_');
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    async isVisible(): Promise<boolean> {
        return await this.root.isVisible();
    }
}
