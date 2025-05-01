import { Page, Locator } from '@playwright/test';

export class ExpertCardPage {
  private page: Page;
  
  expertCardWrapper: Locator;
  expertName: Locator;
  expertAvatar: Locator;
  expertMainSpecialization: Locator;
  expertStatus: Locator;
  expertLanguagesList: Locator;
  expertSkillsList: Locator;
  expertRating: Locator;
  expertReviews: Locator;
  expertPrice: Locator;

  favoriteButton: Locator;
  chatButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.expertCardWrapper = page.locator('div._cardExpertWrapper_ubduj_40');
    
    this.expertName = this.expertCardWrapper.locator('[data-testid="expert-card-name"]');
    this.expertAvatar = this.expertCardWrapper.locator('[data-testid="expert-card-avatar"]');
    this.expertMainSpecialization = this.expertCardWrapper.locator('span._mainSpecialization_ou3s5_97');
    this.expertStatus = this.expertCardWrapper.locator('[data-testid="expert-status"]');
    this.expertLanguagesList = this.expertCardWrapper.locator('[data-testid="expert-card-languages-list"]');
    this.expertSkillsList = this.expertCardWrapper.locator('[data-testid="expect-card-skills-list"]');
    this.expertRating = this.expertCardWrapper.locator('._rating_ou3s5_105');
    this.expertReviews = this.expertCardWrapper.locator('._ratingReviews_ou3s5_124');
    this.expertPrice = this.expertCardWrapper.locator('[data-testid="expert-price-info"]');
    
    this.favoriteButton = this.expertCardWrapper.locator('input#favoriteControl');
    this.chatButton = this.expertCardWrapper.locator('[data-testid="expert-card-chat-button"]');
  }

  async getExpertReviewsCount(): Promise<number> {
    const reviewsText = await this.expertReviews.textContent() || '';
    const match = reviewsText.match(/Based on (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getExpertSkills(): Promise<string[]> {
    const skillItems = this.expertSkillsList.locator('li');
    const count = await skillItems.count();
    const skills: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const skill = await skillItems.nth(i).locator('span._label_11j24_18').textContent();
      if (skill) skills.push(skill);
    }
    
    return skills;
  }

  async isExpertCardDisplayed(): Promise<boolean> {
    return await this.expertCardWrapper.isVisible();
  }

  async isChatButtonEnabled(): Promise<boolean> {
    return await this.chatButton.isEnabled();
  }

  async toggleFavorite(): Promise<void> {
    await this.favoriteButton.click();
  }

  async isExpertFavorite(): Promise<boolean> {
    return await this.favoriteButton.isChecked();
  }

  async clickChatButton(): Promise<void> {
    await this.chatButton.click();
  }
}
