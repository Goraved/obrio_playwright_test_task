# AskNebula Playwright Test Task

This repository contains a test task created for the technical interview with Obrio company. It demonstrates a Playwright automation framework for testing the chat functionality with experts on the AskNebula platform.

> **Note:** This is a proof of concept completed within time constraints of an unpaid test task. In a real production environment, many improvements would be implemented as detailed below.

## What would be implemented in a real project

For a production-ready framework, the following improvements would be necessary:

- Write more comprehensive components for each page
- Use `.env` file with dotenv library for environment configuration
- Implement a proper secret manager for sensitive data
- Add teardowns to properly clean up after tests
- Implement login using API instead of UI for faster test execution
- Create users, experts, chats, etc. using API and DB for test prerequisites
- Refactor the existing approach as it was built within a few hours
- Debug and improve the approach with the split mode URL (https://stage-astrocrm.obrio.net/chat?mode=split), as there are issues when an expert doesn't have any active chat or only has one

## Table of Contents

- [Overview](#overview)
- [Project Architecture](#project-architecture)
  - [Architecture Diagram](#architecture-diagram)
  - [Key Components](#key-components)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
  - [Page Object Model](#page-object-model)
  - [Components](#components)
  - [Elements](#elements)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Tests](#running-tests)
- [Docker Support](#docker-support)
- [Test Case](#test-case)
  - [Chat with Expert Test Steps](#chat-with-expert-test-steps)

## Overview

This framework provides an automated test solution for verifying the chat functionality with experts on the AskNebula platform. It uses Playwright with TypeScript and implements the Page Object Model (POM) pattern for maintainable, reusable, and readable tests.

Key features:
- Component-based architecture for reusing UI elements
- TypeScript for type safety and better IDE support
- Page Object Model for better test maintenance
- Step-by-step test organization for better readability
- Multi-browser testing capability
- Multi-user session handling (user and expert)

## Project Architecture

The project architecture is built on the Page Object Model (POM) pattern, which separates the logic of pages, components, and elements of web applications.

### Architecture Diagram

```
Tests
  │
  ├── Pages (Page Object Model)
  │     │
  │     ├── Components (Reusable UI sections)
  │     │     │
  │     │     └── Elements (Individual UI elements)
  │     │
  │     └── Page-specific methods
  │
  ├── Fixtures (Test setup and configuration)
  │
  └── Test Steps (Logical test grouping)
```

### Key Components

- **BasePage**: Base class for all pages, containing common methods for working with web pages (e.g., navigation).
- **BaseComponent**: Base class for components (e.g., chat widgets, modal windows) consisting of multiple elements.
- **BaseElement**: Class for working with individual web elements (buttons, input fields, etc.), containing basic interaction methods.
- **Fixtures**: Reusable setup components that run before tests (e.g., browser configuration, authentication).
- **Tests**: Individual test files that use the framework to automate test scenarios.

## Project Structure

```
├── fixtures.ts                  # Custom test fixtures
├── page-objects/                # Page objects and components
│   ├── askNebula/
│       ├── HomePage.ts          # Home page implementation
│       ├── SignUpPage.ts        # Sign up page implementation
│       ├── ExpertCardPage.ts    # Expert card page implementation
│       ├── ChatPage.ts          # Chat page implementation
│       ├── components/
│           ├── ChatMain.ts      # Chat main component
│           ├── ConnectionDialog.ts # Connection dialog component
│           ├── RefillCreditsDialog.ts # Credits dialog component
│           ├── PaymentDialog.ts # Payment dialog component
│   ├── crm/
│       ├── ChatsPage.ts         # CRM chats page implementation
│       ├── ActiveChatPage.ts    # Active chat page implementation
│       ├── components/
│           ├── Notification.ts  # Chat notification component
├── tests/                       # Test files
│   ├── chat.spec.ts             # Chat with expert test
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## Core Concepts

### Page Object Model

The Page Object Model (POM) is a design pattern that creates an object repository for web UI elements. Each web page in the application is represented as a class, and the elements on that page are defined as variables in the class.

**Advantages of Using POM:**
- **Code Readability and Maintenance**: Tests become easier to read as page logic is moved into separate classes.
- **Code Reuse**: Page objects can be reused across multiple test cases.
- **Reduced Duplication**: Common functionality is implemented once in the page object.
- **Improved Test Maintainability**: When the UI changes, only the page object needs to be updated, not the tests.

**Example of a Page Object:**

```typescript
export class SignUpPage {
  readonly page: Page;
  
  // Page elements
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly genderSelect: Locator;
  readonly birthDateInput: Locator;
  readonly signUpButton: Locator;
  readonly letsGoButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('[data-test="name-input"]');
    this.emailInput = page.locator('[data-test="email-input"]');
    this.passwordInput = page.locator('[data-test="password-input"]');
    this.genderSelect = page.locator('[data-test="gender-select"]');
    this.birthDateInput = page.locator('[data-test="birth-date-input"]');
    this.signUpButton = page.locator('[data-test="signup-button"]');
    this.letsGoButton = page.locator('[data-test="lets-go-button"]');
  }

  // Page actions
  async open(): Promise<void> {
    await this.page.goto('/signup');
  }

  async completeSignUp(userData: {
    name: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
    birthDate: string;
  }): Promise<void> {
    await this.nameInput.fill(userData.name);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.genderSelect.selectOption(userData.gender);
    await this.birthDateInput.fill(userData.birthDate);
    await this.signUpButton.click();
  }
}
```

### Components

Components represent reusable UI elements that may appear on multiple pages. By encapsulating components, we create more maintainable and reusable code.

**Advantages of Component-Based Approach:**
- **Reusability**: Components can be used across different pages.
- **Encapsulation**: Component logic is isolated and self-contained.
- **Easier Maintenance**: When a component changes, you only need to update it in one place.
- **Better Organization**: Code is organized by UI structure, making it more intuitive.

**Example of a Component:**

```typescript
export class ChatMain {
  readonly root: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly messages: Locator;
  
  constructor(page: Page) {
    this.root = page.locator('.chat-main-container');
    this.messageInput = this.root.locator('[data-test="message-input"]');
    this.sendButton = this.root.locator('[data-test="send-button"]');
    this.messages = this.root.locator('.message-container');
  }

  async sendMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async successfulConnection(): Promise<void> {
    // Wait for successful connection indicators
    await this.root.locator('.connection-success-indicator').waitFor();
  }
}
```

### Elements

Elements represent individual UI controls such as buttons, input fields, dropdowns, etc. They encapsulate the basic interactions with these controls.

**Example of Element Interactions:**

```typescript
// Base element interactions typically implemented in a BaseElement class
async click(): Promise<void> {
  await this.element.click();
}

async fill(text: string): Promise<void> {
  await this.element.fill(text);
}

async getText(): Promise<string> {
  const text = await this.element.textContent();
  return text ? text.trim() : '';
}

async isVisible(): Promise<boolean> {
  return this.element.isVisible();
}
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/obrio_playwright_test_task.git
   cd obrio_playwright_test_task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
   
   This command installs the browsers needed by Playwright (Chromium, Firefox, and WebKit). You can also install specific browsers:
   ```bash
   npx playwright install chromium
   npx playwright install firefox
   npx playwright install webkit
   ```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run tests in headed browsers
npx playwright test --headed

# Run a specific test file
npx playwright test tests/chat.spec.ts

# Run in debug mode
npx playwright test --debug

# Show HTML report
npx playwright show-report
```

## Docker Support

This framework includes Docker support for consistent test execution across environments.

### Running Tests with Docker

```bash
# Build the Docker image
docker build -t playwright-tests .

# Run tests in a container
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report playwright-tests
```

The HTML report will be available in the `playwright-report` directory after the tests complete.

## Test Case

### Chat with Expert Test Steps

**Test Case**: Check the successful start of the chat with expert

The test case verifies that a user can successfully start a chat with an expert on the AskNebula platform. Here's a detailed breakdown of the test steps:

1. **Navigate to AskNebula sign up page and create a new account**
   - Open the sign-up page
   - Fill in user details (name, gender, email, password, birth date)
   - Complete the sign-up process
   - Verify registration was successful
   - Close any promotional modals
   - Click "Let's Go" to continue

2. **Open Expert Card page**
   - Navigate to a specific expert's card page
   - Close any email verification modals
   - Verify the expert name is displayed correctly

3. **Start chat with the expert**
   - Click on the chat button
   - Verify that the message input field is visible

4. **Send initial message to the expert**
   - Send a greeting message
   - Wait for connection dialog to appear and disappear
   - Verify the refill credits dialog appears
   - Verify the credits amount, current price, and old price are displayed correctly

5. **Continue with intro offer and choose credit card payment**
   - Click Continue on the credits dialog
   - Wait for payment dialog to appear
   - Select credit card payment option

6. **Enter payment details and complete purchase**
   - Fill in credit card details (card number, expiry, CVV, name)
   - Click the buy button
   - Wait for the connection dialog to appear

7. **Accept chat request as expert**
   - Switch to expert browser context
   - Verify notification appears in CRM
   - Verify client name in notification
   - Accept the chat request
   - Verify expert chat page is loaded
   - Verify chat duration timer is running
   - Send welcome message from expert

8. **Verify chat has started successfully on user side**
   - Switch back to user browser context
   - Verify successful connection
   - Verify connection dialog is no longer visible
   - Verify expert's welcome message is displayed
   - Send a response message from user
   - Verify message input remains enabled

9. **Verify expert received user message**
   - Switch to expert browser context
   - Verify the user's message is visible to the expert

This comprehensive test case verifies the full flow of starting a chat with an expert, including account creation, payment processing, and bidirectional message exchange.
