import { Page } from '@playwright/test';
import { BaseComponent } from '../../baseComponent';

export class PaymentDialogComponent extends BaseComponent {
  constructor(page: Page) {
    const rootLocator = page.locator('div._wrapper_e9uun_1[data-sentry-component="PaymentForm"]');
    super(rootLocator, page);
  }

  // Order details
  get orderDetailsLabel() { return this.locator('h5._detailsLabel_1vx15_26'); }
  get creditsAmount() { return this.locator('span[data-testid="payment-form-credits"]'); }
  get totalPrice() { return this.locator('span[data-testid="payment-form-total-price"]'); }

  // Payment method tabs
  get payPalTab() { return this.locator('[data-testid="payment-form-pay-pal-option"]'); }
  get creditCardTab() { return this.locator('[data-testid="payment-form-credit-card-option"]'); }

  // Credit card form (inside iframe)
  get creditCardIframe() { return this.page.frameLocator('#solid-payment-form-iframe'); }

  // Security labels
  get securityLabel() { return this.locator('div[data-sentry-component="PaymentGuaranteeLabel"]'); }

  async selectCreditCardPayment() {
    await this.creditCardTab.click();
  }

  async selectPayPalPayment() {
    await this.payPalTab.click();
  }

  async fillCreditCardDetails(cardDetails: {
    number: string,
    expiry: string,
    cvv: string,
    name: string
  }) {
    // Fill card details within the iframe
    const frameContent = this.creditCardIframe;

    // Fill card number
    await frameContent.locator('input[name="cardNumber"]').fill(cardDetails.number);

    // Fill expiration date
    await frameContent.locator('input[name="cardExpiryDate"]').fill(cardDetails.expiry);

    // Fill CVV
    await frameContent.locator('input[name="cardCvv"]').fill(cardDetails.cvv);

    // Fill cardholder name
    await frameContent.locator('input[name="cardHolder"]').fill(cardDetails.name);
  }

  async clickBuyButton() {
    const frameContent = this.creditCardIframe;
    await frameContent.locator('button[data-testid="submit-button"]').click();
  }

  // New method that combines filling card details and clicking the buy button
  async fillCardDetailsAndSubmit(cardDetails: {
    number: string,
    expiry: string,
    cvv: string,
    name: string
  }) {
    await this.fillCreditCardDetails(cardDetails);
  }

  async getOrderDetails() {
    const credits = await this.creditsAmount.textContent() || '';
    const total = await this.totalPrice.textContent() || '';

    return {
      credits,
      total
    };
  }

}