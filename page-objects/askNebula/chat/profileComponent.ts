import { Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

/**
 * Component representing the expert profile sidebar in the chat
 */
export class ChatExpertProfileComponent extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div[data-sentry-component="ChatExpertProfile"]');
    super(rootLocator, page);
  }
  
  get expertAvatar() {
    return this.locator('img._generalAvatar_17s6j_62');
  }
  
  get expertName() {
    return this.locator('h4._name_17s6j_10');
  }
  
  get expertStatus() {
    return this.locator('span[data-testid="expert-status"]');
  }
  
  get favoriteButton() {
    return this.locator('input#favoriteControl');
  }
  
  get mainSpecialization() {
    return this.locator('h5._mainSpecialization_17s6j_26');
  }
  
  get expertRating() {
    return this.locator('span[data-sentry-component="ExpertCardRating"]');
  }
  
  get reviewsCount() {
    return this.locator('span._reviews_15s6e_18');
  }
  
  get specializations() {
    return this.locator('div._specializations_17s6j_73 div[data-sentry-component="Chip"]');
  }
  
  get yearsOfExperience() {
    return this.locator('div._experience_17s6j_40 span._years_1kdk9_6');
  }
  
  get aboutText() {
    return this.locator('div[data-sentry-component="ExpertCardAbout"]');
  }
  
  get viewFullProfileButton() {
    return this.locator('button:has-text("View full profile")');
  }
  
  async addToFavorites(): Promise<void> {
    // Check if already in favorites
    const isChecked = await this.favoriteButton.isChecked();
    
    if (!isChecked) {
        await this.favoriteButton.check();
    }
  }
  
  async removeFromFavorites(): Promise<void> {
    // Check if in favorites
    const isChecked = await this.favoriteButton.isChecked();
    
    if (isChecked) {
      await this.favoriteButton.uncheck();
    } 
  }
  
  async viewFullProfile(): Promise<void> {
    await this.viewFullProfileButton.click();
  }
  
  async getExpertInfo(): Promise<{
    name: string,
    status: string,
    specialization: string,
    rating: string,
    reviewsCount: string,
    yearsOfExperience: string
  }> {
    return {
      name: await this.expertName.textContent() || '',
      status: await this.expertStatus.textContent() || '',
      specialization: await this.mainSpecialization.textContent() || '',
      rating: await this.expertRating.textContent() || '',
      reviewsCount: await this.reviewsCount.textContent() || '',
      yearsOfExperience: await this.yearsOfExperience.textContent() || ''
    };
  }
  
  async getSpecializations(): Promise<string[]> {
    const specializationElements = await this.specializations.all();
    const specs: string[] = [];
    
    for (const elem of specializationElements) {
      const text = await elem.textContent();
      if (text) {
        specs.push(text.trim());
      }
    }
    
    return specs;
  }
}