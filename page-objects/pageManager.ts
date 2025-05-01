import { Page } from '@playwright/test';
import { HomePage } from './askNebula/home/homePage';
import { AskNebulaLoginForm } from './askNebula/auth/loginForm';
import { AskNebulaSignUpForm } from './askNebula/auth/signUpForm';
import { CrmLoginForm } from './crm/login/loginForm';
import { ExpertCardPage } from './askNebula/expertCardPage';
import { NavigationComponent } from './crm/navigationComponent';
import { CrmHeaderComponent } from './crm/headerComponent';
import { AskNebulaChatPage } from './askNebula/chat/chatPage';
import { CrmChatsPage } from './crm/chats/chatsPage';
import {ActiveChatPage} from './crm/chats/activeChatPage';


/**
 * PageManager provides centralized access to all page objects in the application.
 * It organizes page objects by application section: AskNebula and CRM.
 */
export class PageManager {
    readonly page: Page;

    // Main sections
    readonly askNebula: {
        homePage: HomePage;
        loginPage: AskNebulaLoginForm;
        signUpPage: AskNebulaSignUpForm;
        expertCardPage: ExpertCardPage;
        chatPage: AskNebulaChatPage;
        // Add other AskNebula pages as needed
    };

    readonly crm: {
        loginPage: CrmLoginForm;
        navigation: NavigationComponent;
        header: CrmHeaderComponent;
        chatsPage: CrmChatsPage;
        activeChatPage: ActiveChatPage;
        // Add other CRM pages as needed
    };

    // Legacy flat references for backward compatibility
    readonly homePage: HomePage;
    readonly loginPage: AskNebulaLoginForm;
    readonly signUpPage: AskNebulaSignUpForm;
    readonly crmLoginPage: CrmLoginForm;

    /**
     * Create a new PageManager with all page objects initialized and organized by section
     * 
     * @param page The Playwright page object
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize AskNebula section
        this.askNebula = {
            homePage: new HomePage(page),
            loginPage: new AskNebulaLoginForm(page),
            signUpPage: new AskNebulaSignUpForm(page),
            expertCardPage: new ExpertCardPage(page),
            chatPage: new AskNebulaChatPage(page),
            // Initialize other AskNebula pages here
        };

        // Initialize CRM section
        this.crm = {
            loginPage: new CrmLoginForm(page),
            navigation: new NavigationComponent(page),
            header: new CrmHeaderComponent(page),
            chatsPage: new CrmChatsPage(page),
            activeChatPage: new ActiveChatPage(page),
            // Initialize other CRM pages here
        };

    }
}