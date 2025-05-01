import { Locator, Page } from '@playwright/test';

export class BaseComponent {
    readonly root: Locator;
    readonly page: Page;

    /**
     * Base class for UI components
     * 
     * @param root The root element that defines the component's scope
     * @param page The Playwright Page instance
     */
    constructor(root: Locator, page: Page) {
        this.root = root;
        this.page = page;
    }

    /**
     * Find a child element within this component's root
     * More resilient implementation that handles possible detached elements
     * 
     * @param selector CSS or XPath selector relative to this component's root
     */
    locator(selector: string): Locator {
        return this.root.locator(selector);
    }

    /**
     * Check if the component is visible with retry logic
     */
    async isVisible(timeout = 5000): Promise<boolean> {
        return await this.root.isVisible();
    }

    /**
     * Wait for the component to be visible with better error handling
     * 
     * @param options Waiting options
     */
    async waitForVisible(options: { timeout?: number } = {}): Promise<boolean> {
        try {
            await this.root.waitFor({ state: 'visible', timeout: options.timeout || 10000 });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Wait for the component to be hidden with better error handling
     * 
     * @param options Waiting options
     */
    async waitForHidden(options: { timeout?: number } = {}): Promise<boolean> {
        try {
            await this.root.waitFor({ state: 'hidden', timeout: options.timeout || 10000 });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * More resilient click that handles potential element detachment
     */
    async click(options: { force?: boolean, timeout?: number } = {}): Promise<boolean> {
        try {
            await this.root.waitFor({ state: 'attached', timeout: options.timeout || 1000 });
            await this.root.click({ force: options.force || false });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Safely get text content with fallback
     */
    async getText(): Promise<string> {
        try {
            await this.root.waitFor({ state: 'attached', timeout: 1000 });
            const text = await this.root.textContent();
            return text ? text.trim() : '';
        } catch (e) {
            return '';
        }
    }

}