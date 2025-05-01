import { BaseComponent } from '../../baseComponent';
import { Locator, Page } from '@playwright/test';

export class ChatListItemComponent extends BaseComponent {
    private readonly clientName: Locator;
    private readonly clientTypeIcon: Locator;
    private readonly messagePreview: Locator;
    private readonly timeAgo: Locator;
    private readonly astrologerName: Locator;
    private readonly chatLink: Locator;
    private readonly clientBadgeCount: Locator;

    constructor(root: Locator, page: Page) {
        super(root, page);
        
        this.clientName = this.root.locator('.css-n0j4id p.MuiTypography-body1');
        this.clientTypeIcon = this.root.locator('.MuiIconButton-root svg[role="img"]');
        this.messagePreview = this.root.locator('p.css-1wdaq1g');
        this.timeAgo = this.root.locator('p.css-wf1kr5');
        this.astrologerName = this.root.locator('.css-c1mblu p.MuiTypography-body2');
        this.chatLink = this.root.locator('a');
        this.clientBadgeCount = this.root.locator('.MuiBadge-badge');
    }

    async getChatId(): Promise<string> {
        const href = await this.chatLink.getAttribute('href') || '';
        const chatId = href.split('/').pop();
        return chatId || '';
    }

    async isSelected(): Promise<boolean> {
        const classAttribute = await this.root.getAttribute('class') || '';
        return classAttribute.includes('Mui-selected');
    }

}
