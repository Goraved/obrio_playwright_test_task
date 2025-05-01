import { Page } from '@playwright/test';
import { BasePage } from '../../basePage';
import { HeaderComponent } from './headerComponent';
import { ExpertsCategoryComponent } from './expertsCategoryComponent';
import { PsychicOfDayComponent } from './psychicOfDayComponent';
import { AppPromoComponent } from './appPromoComponent';
import { AllPsychicsComponent } from './allPsychicsComponent';
import { FooterComponent } from './footerComponent';
import { SpecialOfferModal } from './specialOfferModal';
import { VerifyEmailModal } from './verifyEmailModal';

/**
 * Page object representing the AskNebula Home/Experts page
 */
export class HomePage extends BasePage {
  // Page components
  readonly header: HeaderComponent;
  readonly votedMostAccurate: ExpertsCategoryComponent;
  readonly bestInLoveReadings: ExpertsCategoryComponent;
  readonly psychicOfTheDay: PsychicOfDayComponent;
  readonly recommendedForYou: ExpertsCategoryComponent;
  readonly appPromo: AppPromoComponent;
  readonly topRated: ExpertsCategoryComponent;
  readonly allPsychics: AllPsychicsComponent;
  readonly footer: FooterComponent;
  readonly specialOfferModal: SpecialOfferModal;
  readonly verifyEmailModal: VerifyEmailModal;
  
  constructor(page: Page) {
    super(page);
    
    // Initialize page components with their locators
    this.header = new HeaderComponent(page.locator('header._header_1c9zl_1'), page);
    this.votedMostAccurate = new ExpertsCategoryComponent(
      page.locator('[data-testid="experts-category"]:has-text("Voted most accurate")'), 
      page,
      'Voted most accurate'
    );
    this.bestInLoveReadings = new ExpertsCategoryComponent(
      page.locator('[data-testid="experts-category"]:has-text("Best in love readings")'), 
      page,
      'Best in love readings'
    );
    this.psychicOfTheDay = new PsychicOfDayComponent(
      page.locator('[data-sentry-component="ExpertsDayExpert"]'), 
      page
    );
    this.recommendedForYou = new ExpertsCategoryComponent(
      page.locator('[data-testid="experts-category"]:has-text("Recommended for you")'), 
      page,
      'Recommended for you'
    );
    this.appPromo = new AppPromoComponent(
      page.locator('[data-sentry-component="ExpertsNativeAppCreditsPromo"]'), 
      page
    );
    this.topRated = new ExpertsCategoryComponent(
      page.locator('[data-testid="experts-category"]:has-text("Top rated")'), 
      page,
      'Top rated'
    );
    this.allPsychics = new AllPsychicsComponent(
      page.locator('[data-sentry-component="ExpertsVaried"]'), 
      page
    );
    this.footer = new FooterComponent(page.locator('footer'), page);
    this.specialOfferModal = new SpecialOfferModal(page);
    this.verifyEmailModal = new VerifyEmailModal(page);
  }
  
  async open(): Promise<void> {
    await this.page.goto('https://stage-asknebula.asknebula.com/app/experts');
    await this.handleAuthPopup();
    await this.header.waitForVisible();
  }
  
  private async handleAuthPopup(): Promise<void> {
    try {
      // Try to detect authentication dialog
      const authPromptHandle = await Promise.race([
        // Wait for either a dialog or timeout
        this.page.waitForEvent('dialog', { timeout: 5000 }),
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      
      // If dialog was detected, handle it
      if (authPromptHandle && authPromptHandle !== null) {
        await (authPromptHandle as any).accept('asknebulastageauth');
      }
    } catch (error) {
    }
  }
  
  async navigateToExpertCard(expertId: string): Promise<void> {
    await this.page.goto(`https://stage-asknebula.asknebula.com/app/expert/${expertId}`);
  }
  
  async handleSpecialOffer(accept: boolean = false): Promise<void> {
    if (await this.specialOfferModal.isDisplayed()) {
      await this.specialOfferModal.handleOffer(accept);
    }
  }
  
  async isLoggedIn(): Promise<boolean> {
    return await this.header.isUserLoggedIn();
  }
}