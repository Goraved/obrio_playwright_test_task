import { BaseComponent } from '../../baseComponent';
import { Locator, Page } from '@playwright/test';

export class NotificationComponent extends BaseComponent {
    readonly progressCircle: Locator;
    readonly progressValue: Locator;
    readonly chatRequestText: Locator;
    readonly clientName: Locator;
    readonly clientType: Locator;
    readonly astrologerName: Locator;
    readonly cancelButton: Locator;
    readonly acceptButton: Locator;

    constructor(root: Locator, page: Page) {
        super(root, page);

        this.progressCircle = this.root.locator('span.MuiCircularProgress-root');
        this.progressValue = this.root.locator('.MuiTypography-caption');
        this.chatRequestText = this.root.locator('p.css-mpdr4u');
        this.clientName = this.root.locator('.css-1j6tmez p.MuiTypography-body1');
        this.clientType = this.root.locator('svg[title="Low client"]').locator('xpath=../../../..');
        this.cancelButton = this.root.locator('button:has-text("Cancel")');
        this.acceptButton = this.root.locator('button:has-text("Accept")');
    }

    async getProgressValue(): Promise<number> {
        const valueText = await this.progressValue.textContent();
        return valueText ? parseInt(valueText.trim(), 10) : 0;
    }

    async getProgressPercentage(): Promise<number> {
        const ariaValue = await this.progressCircle.getAttribute('aria-valuenow');
        return ariaValue ? parseInt(ariaValue, 10) : 0;
    }

    async isMobileClient(): Promise<boolean> {
        const mobileBadgeText = await this.root.locator('.css-zwnr44:has(svg[clip-path="url(#clip0_6129_67851)"]) p').textContent();
        return mobileBadgeText === 'Mobile client';
    }

    async clickCancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async clickAccept(): Promise<void> {
        await this.acceptButton.click();
    }

    async isVisible(): Promise<boolean> {
        return await this.root.isVisible();
    }
}