import { Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';
import { MessageComponent } from './messageComponent';

/**
 * Component representing the main chat area
 */
export class ChatMainComponent extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div[data-sentry-component="ChatMain"]');
    super(rootLocator, page);
  }
  
  get expertInfoContainer() {
    return this.locator('div._astrologerInfoContainer_o02ev_40');
  }
  
  get expertAvatar() {
    return this.locator('svg._iconAvatar_mqy2a_10, img._avatar_o02ev_50');
  }
  
  get expertName() {
    return this.locator('div._astrologerName_o02ev_57');
  }
  
  get expertStatus() {
    return this.locator('span[data-testid="chat-header-expert-status"]');
  }
  
  get speechBubble() {
    return this.locator('div[data-sentry-component="SpeechBubble"]');
  }
  
  get chatRules() {
    return this.locator('div[data-sentry-component="ChatRules"]');
  }
  
  get messageInput() {
    return this.locator('textarea[data-testid="chat-message-textarea"]');
  }
  
  get sendButton() {
    return this.locator('button[data-testid="send-message-button"]');
  }
  
  get iceBreakers() {
    return this.locator('div[data-sentry-component="ChatFooterIceBreakingTips"]');
  }
  
  get iceBreakingTips() {
    return this.page.locator('div[data-testid="ice-breaking-tip"] span._tipLabel_12xjp_15');
  }
  
  get chatCostInfo() {
    return this.locator('div[data-sentry-component="ChatPrompt"] span._text_m7lpc_8');
  }

  // Chat messages section locators
  readonly messagesListContainer = this.page.locator('div[data-sentry-component="ChatMessagesList"]');
  readonly messagesList = this.messagesListContainer.locator('ul#messagesListId');
  readonly messageWrappers = this.page.locator('div[data-sentry-component="MessageWrapper"]');
  readonly messages = this.page.locator('div[data-testid="chat-message-text"]');
  
  async successfulConnection(): Promise<void> {
    await this.locator('h3:has-text("Successful connection")').waitFor({ state: 'visible' });
  }
  
  // Chat message interaction methods
  async sendMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }
  
  async clickIceBreaker(index: number): Promise<void> {
    const tips = await this.iceBreakingTips.all();
    
    if (index >= 0 && index < tips.length) {
      await tips[index].click();
    } else {
      throw new Error(`Ice breaker index ${index} out of range. Available tips: ${tips.length}`);
    }
  }
  
  async getIceBreakerTips(): Promise<string[]> {
    const tips = await this.iceBreakingTips.all();
    const tipTexts: string[] = [];
    
    for (const tip of tips) {
      const text = await tip.textContent();
      if (text) {
        tipTexts.push(text.trim());
      }
    }
    
    return tipTexts;
  }
  
  async getExpertInfo(): Promise<{name: string, status: string}> {
    const name = await this.expertName.textContent() || '';
    const status = await this.expertStatus.textContent() || '';
    
    return {
      name: name.trim(),
      status: status.trim()
    };
  }
  
  async isWithExpert(expertName: string): Promise<boolean> {
    const name = await this.expertName.textContent() || '';
    return name.trim() === expertName;
  }
  
  async getMessages(): Promise<MessageComponent[]> {
    const messageWrappers = await this.page.locator('div[data-sentry-component="MessageWrapper"]').all();
    const messageComponents: MessageComponent[] = [];
    
    for (const wrapper of messageWrappers) {
      messageComponents.push(new MessageComponent(wrapper, this.page));
    }
    
    return messageComponents;
  }
  
  async getLatestMessage(): Promise<MessageComponent | null> {
    const messages = await this.getMessages();
    if (messages.length === 0) {
      return null;
    }
    return messages[messages.length - 1];
  }
  
  async getMessagesBySender(incoming: boolean): Promise<MessageComponent[]> {
    const allMessages = await this.getMessages();
    const filteredMessages: MessageComponent[] = [];
    
    for (const message of allMessages) {
      const isIncomingMessage = await message.isIncoming();
      if ((incoming && isIncomingMessage) || (!incoming && !isIncomingMessage)) {
        filteredMessages.push(message);
      }
    }
    
    return filteredMessages;
  }
  
  async getExpertMessages(): Promise<MessageComponent[]> {
    return this.getMessagesBySender(true);
  }
  
  async getUserMessages(): Promise<MessageComponent[]> {
    return this.getMessagesBySender(false);
  }
  
  async getLastMessageText(): Promise<string> {
    const lastMessage = await this.getLatestMessage();
    if (lastMessage) {
      return await lastMessage.getText();
    }
    return '';
  }
  
}