import { test, expect } from '../fixtures';

test.describe('Ask Nebula Expert Chat Tests', () => {

    test('Check the successful start of the chat with expert', async ({ pages, expertPage, userPage, expertPages }) => {
        await userPage.bringToFront();

        await test.step('Step 1: Navigate to AskNebula sign up page and create a new account', async () => {
            const userData = {
                name: 'Aqa User',
                gender: 'male' as 'male',
                email: `aqauser+${Date.now()}@gmail.com`,
                password: 'TestPassword123!',
                birthDate: '17/09/1983'
            };

            await pages.askNebula.signUpPage.open();
            await pages.askNebula.signUpPage.completeSignUp(userData);

            // Verify registration was successful by checking the header is visible
            await pages.askNebula.homePage.specialOfferModal.waitForVisible();
            await pages.askNebula.homePage.specialOfferModal.close();
            await pages.askNebula.signUpPage.letsGoButton.click();
        });

        await test.step('Step 2: Open Expert Card page', async () => {
            await pages.askNebula.homePage.navigateToExpertCard('9bbab846-377a-447c-bfa9-30846dec07ea');
            await pages.askNebula.homePage.verifyEmailModal.waitForVisible();
            await pages.askNebula.homePage.verifyEmailModal.close();
            await expect(pages.askNebula.expertCardPage.expertName).toContainText('Test astrologer');
        });

        await test.step('Step 3: Start chat with the expert', async () => {
            await pages.askNebula.expertCardPage.clickChatButton();
            await expect(pages.askNebula.chatPage.chatMain.messageInput).toBeVisible();
        });

        const refillCreditsDialog = await test.step('Step 4: Send initial message to the expert', async () => {
            await pages.askNebula.chatPage.chatMain.sendMessage('Hello, I would like to have a consultation');
            await pages.askNebula.chatPage.connectionDialog.waitForVisible();
            await pages.askNebula.chatPage.connectionDialog.waitForHidden();
            const refillCreditsDialog = pages.askNebula.chatPage.refillCreditsDialog;
            await refillCreditsDialog.waitForVisible();
            await expect(refillCreditsDialog.creditsAmount).toHaveText('160 credits');
            await expect(refillCreditsDialog.currentPrice).toHaveText('$2.99');
            await expect(refillCreditsDialog.oldPrice).toHaveText('$19.99');
            return refillCreditsDialog;
        });

        await test.step('Step 5: Continue with intro offer and choose credit card payment', async () => {
            await refillCreditsDialog.clickContinue();
            await pages.askNebula.chatPage.paymentDialog.waitForVisible();
            await pages.askNebula.chatPage.paymentDialog.creditCardTab.click();
        });

        await test.step('Step 6: Enter payment details and complete purchase', async () => {
            await pages.askNebula.chatPage.paymentDialog.fillCreditCardDetails({
                number: '4242 4242 4242 4242',
                expiry: '12/25',
                cvv: '123',
                name: 'AQA User'
            });
            
            await pages.askNebula.chatPage.paymentDialog.clickBuyButton();
            await pages.askNebula.chatPage.connectionDialog.waitForVisible();
        });

        await test.step('Step 7: Accept chat request as expert', async () => {
            await expertPage.bringToFront();

            // Check that notification appears in CRM
            const notifications = await expertPages.crm.chatsPage.getNotifications();
            await expect(notifications).toHaveLength(1);
            
            // Verify notification contains correct client information
            const notification = notifications[0];
            await expect(notification.clientName).toContainText('Aqa User');
            
            // Accept the chat request
            await notification.clickAccept();
            
            // Verify expert chat page is loaded
            await expect(expertPages.crm.activeChatPage.messageInput).toBeVisible();
            await expect(expertPages.crm.activeChatPage.clientNameLabel).toContainText('Aqa User');
            
            // Verify that chat timer is running
            const initialDuration = await expertPages.crm.activeChatPage.chatDuration.textContent();
            await expertPage.waitForTimeout(3000); // Wait for timer to increment
            const updatedDuration = await expertPages.crm.activeChatPage.chatDuration.textContent();
            expect(initialDuration).not.toEqual(updatedDuration);
            
            // Send message from expert side
            await expertPages.crm.activeChatPage.sendMessage('Hello! How can I help you today?');
        });

        await test.step('Step 8: Verify chat has started successfully on user side', async () => {
            await userPage.bringToFront();
            
            // Verify connection was successful
            await pages.askNebula.chatPage.chatMain.successfulConnection();
            
            // Verify connecting popup is no longer visible
            await expect(pages.askNebula.chatPage.connectionDialog.root).not.toBeVisible();
            
            // Verify the message from expert is visible to user
            await expect(pages.askNebula.chatPage.chatMain.messages).toContainText('Hello! How can I help you today?');
            
            // Send a message back from user to expert
            await pages.askNebula.chatPage.chatMain.sendMessage('Thank you! I have a question about my horoscope.');
            
            // Verify message input remains enabled for continuous conversation
            await expect(pages.askNebula.chatPage.chatMain.messageInput).toBeEnabled();
        });

        await test.step('Step 9: Verify expert received user message', async () => {
            await expertPage.bringToFront();
            
            // Verify the message from user is visible to expert
            await expect(expertPages.crm.activeChatPage.messages.last()).toContainText('Thank you! I have a question about my horoscope.');
        });
    });
});
