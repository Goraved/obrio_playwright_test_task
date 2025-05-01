import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../baseComponent';
import { StartWorkDialog } from './components/startWorkDialog';
import { StopWorkDialog } from './components/stopWorkDialog';

/**
 * Component representing the header in AstroCRM
 * Based on the provided HTML structure
 */
export class CrmHeaderComponent extends BaseComponent {
    constructor(page: Page) {
        const rootLocator = page.locator('header.MuiAppBar-root');
        super(rootLocator, page);
    }

    /**
     * ----- COMPONENT ELEMENTS -----
     */

    get menuButton() {
        return this.locator('button[aria-label="open drawer"]');
    }

    get pageTitle() {
        return this.locator('h1.MuiTypography-h6');
    }

    get networkStatus() {
        return this.locator('span[aria-label="Status of your network connection"] div');
    }

    get onlineStatus() {
        return this.locator('span[aria-label="Status of your profiles on platforms"] div');
    }

    get busyToggle() {
        return this.locator('span.MuiSwitch-root');
    }

    get busyToggleInput() {
        return this.busyToggle.locator('input[type="checkbox"]');
    }

    get busyText() {
        return this.locator('p:has-text("Make me busy")');
    }

    get startWorkButton() {
        return this.locator('button:has-text("Start work"), button:has(svg[data-testid="PlayArrowIcon"])');
    }

    get stopWorkButton() {
        return this.locator('button:has-text("Stop work"), button:has(svg[data-testid="StopIcon"])');
    }

    get userAvatar() {
        return this.locator('div.MuiAvatar-root img');
    }

    get userName() {
        return this.locator('p.MuiTypography-body1:not(:has-text("Make me busy"))');
    }

    get userRole() {
        return this.locator('span.MuiTypography-caption:has-text("Astrologer")');
    }

    get userBalance() {
        return this.locator('span.MuiTypography-body2:contains("$")');
    }

    get notificationButton() {
        return this.locator('button:has(.MuiBadge-badge)');
    }

    get notificationCount() {
        return this.locator('.MuiBadge-badge');
    }

    get userMenuButton() {
        return this.locator('button:has(svg[data-testid="KeyboardArrowDownIcon"])');
    }

    getStartWorkDialog(): StartWorkDialog {
        return new StartWorkDialog(this.page);
    }

    getStopWorkDialog(): StopWorkDialog {
        return new StopWorkDialog(this.page);
    }

    /**
     * ----- COMPONENT ACTIONS -----
     */

    async toggleMenu(): Promise<void> {
        await this.menuButton.click();
    }

    async toggleBusyStatus(): Promise<void> {
        await this.busyToggle.click();
    }

    async isBusy(): Promise<boolean> {
        return await this.busyToggleInput.isChecked();
    }

    async startWork(): Promise<void> {
        await this.startWorkButton.click();
        const dialog = await this.getStartWorkDialog();
        await dialog.confirm();
    }

    async stopWork(): Promise<void> {
        await this.stopWorkButton.click();
        const dialog = await this.getStopWorkDialog();
        await dialog.confirm();
    }

    async getUserRole(): Promise<string> {
        const roleText = await this.userRole.textContent() || '';
        // Extract role from text (e.g., "Astrologer · $426.00" -> "Astrologer")
        return roleText.split('·')[0].trim();
    }

    async getNotificationCount(): Promise<number> {
        const countText = await this.notificationCount.textContent() || '0';
        return parseInt(countText);
    }

    async clickNotifications(): Promise<void> {
        await this.notificationButton.click();
    }

    async openUserMenu(): Promise<void> {
        await this.userMenuButton.click();
    }

    async getUserInfo(): Promise<{ name: string, role: string, balance: string }> {
        return {
            name: await this.userName.textContent() || '',
            role: await this.getUserRole(),
            balance: await this.userBalance.textContent() || ''
        };
    }
}