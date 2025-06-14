# LENS AI Test Pilot

**LENS AI Test Pilot** is a tool that automates the testing of web applications using Cypress. Traditionally, testing was done after development, which caused delays and issues. Now, with LENS AI Test Pilot, you can create automated test scripts before development even begins. This allows testing and development to happen at the same time, speeding up the process and improving product quality.

It simplifies the testing process by automating repetitive tasks, allowing both developers and testers to focus on building the software, not on repetitive testing.

###  Key Features

- **Parallel Testing and Development:** Create test cases first and begin development immediately after. This saves time and speeds up the overall process.
- **Test Case Configurator:** A simple interface that lets users create test cases without writing any code. The tool will automatically generate test scripts for you.
- **Automated Test Script Generation:** Once you define a test scenario, LENS AI Test Pilot automatically creates the necessary test scripts, saving time and reducing errors.
- **Centralized Test Management:** Store all your test data in one place, making it easy to manage and update tests for your application.


# Lens AI Test Pilot - Setup and Testing Guide
This document provides step-by-step instructions to set up and test the *Lens AI Test Pilot* repository. If you already have the local site, *skip Procedure 1* and continue with *Procedure 2*.

---

### Procedure 1: If You Do Not Have a Local Site
### 1. Launch Codespace and Set Up Site
- Launch the Codespace and wait for 2–3 minutes.
- Open the forwarded site in the browser.
- Login using:
  - *Username:* administrator
  - *Password:* admin
- Complete the setup wizard.
- This site will now act as both:
  - *Host site*: used for configuration.
  - *Target site*: where tests will be executed.

---
### Procedure 2: If You Already Have the Local Site

### 2. Configure the .env File
- Copy sample_env and create a .env file in root folder

- Generate API Key & Secret:
  - Go to *Host site → Profile → My Settings → API Access → Generate Keys*.

- Encode your credentials:
```bash
  echo -n "YOUR_API_KEY:YOUR_API_SECRET" | base64
 ``` 

- Update .env with the following format:
```bash
HOST_URL=https://hostsite.docker.localhost
HOST_KEY=Basic <encoded-key>
TARGET_URL=https://targetsite.docker.localhost
TARGET_KEY=Basic <encoded-key>
DOCTYPE=Test Case Configurator
NODE_TLS_REJECT_UNAUTHORIZED=0
LOGIN_EMAIL=abc@gmail.com
LOGIN_PASSWORD=yourpassword
TESTCASE_TITLE=Sample Test Case
TARGET_PATH=/api/endpoint/path
```
---

### 3. Install Project Dependencies and Verify
- Run the following commands:
  bash
- `npm install`
- `npm install child-process`
- `npm run setup`

- After setup, verify the following Doctypes are available in the *Host site → Doctype List*:
  - Test Case Configurator
  - Site Details
  - Test Fields
  - Test Plan
  - Test Lab
  - Test Run

---

### 4. Run Cypress Tests
Run Cypress using:
` npx cypress run`

---

This will execute the base test for the Quotation module.You can download the video of the test.cy.ts.mp4 execution to see how the test was performed.

Following the above steps will ensure a successful setup and execution of tests in the Lens AI Test Pilot repository. For troubleshooting or further information, refer to the [official documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/).

---
###  Explore & Engage
Looking to dive deeper or need help getting started? Check out our full documentation for detailed insights, tips, and support.

###  [Documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/)
