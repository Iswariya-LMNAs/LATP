# LENS AI Test Pilot

**LENS AI Test Pilot** is a tool that automates the testing of web applications using Cypress. Traditionally, testing was done after development, which caused delays and issues. Now, with LENS AI Test Pilot, you can create automated test scripts before development even begins. This allows testing and development to happen at the same time, speeding up the process and improving product quality.

It simplifies the testing process by automating repetitive tasks, allowing both developers and testers to focus on building the software, not on repetitive testing.

###  Key Features

- **Parallel Testing and Development:** Create test cases first and begin development immediately after. This saves time and speeds up the overall process.
- **Test Case Configurator:** A simple interface that lets users create test cases without writing any code. The tool will automatically generate test scripts for you.
- **Automated Test Script Generation:** Once you define a test scenario, LENS AI Test Pilot automatically creates the necessary test scripts, saving time and reducing errors.
- **Centralized Test Management:** Store all your test data in one place, making it easy to manage and update tests for your application.


# Lens AI Test Pilot - Setup and Testing Guide

This document provides step-by-step instructions to set up and test the **Lens AI Test Pilot** repository. Follow these steps carefully to ensure a smooth configuration and execution of test cases.

### Procedure 1: If You Do Not Have a Local Site

### Step 1: Set Up Local Lens Site 

1. Open the **Codespace**.  
2. Run the command in the terminal:

   ```bash
   npm install local
   ```

  Once your local site is up and running, continue with **Procedure 2** to set up and run the `lens-ai-test-pilot`.
  
  ---

###  Procedure 2:  If You Already Have a Local Site


### Step 1: Clone the Test Pilot Repository

1. Run the following command in the terminal to clone the repository:

   ```bash
   git clone https://github.com/lmnaslimited/lens_ai_test_pilot.git
   ```

2. Navigate to the project folder and open it in VS Code ( or your preferred code editor ):

   ```bash
   cd lens_ai_test_pilot
   code .
   ```


### Step 2: Install Dependencies

1. In the code editor terminal, install the project dependencies:
   ```bash
   npm install
   nvm use v20
   ```
   
###  Step 3: Configure Environment Variables

1. Copy the `sample_env` and create a `.env` file in root folder and make the following changes.
2. To generate the encoded auth key:
   - Go to **Profile → My Settings → API Access →Generate Keys** on the Host/Target site.
   - Copy the **API Key** and **API Secret**.
   - Run the command  in your terminal:

     ```bash
     echo -n "YOUR_API_KEY:YOUR_API_SECRET" | base64
     ```
     
> **Note:**  In case of single site , **same site** can be used for both **Host and Target** .
3. Example `.env` variables:
   ```env
   HOST_URL=https://hostsite.docker.localhost
   HOST_KEY=Basic <base64-encoded-key>
   TARGET_URL=https://targetsite.docker.localhost
   TARGET_KEY=Basic <base64-encoded-key>
   DOCTYPE=Test Case Configurator
   NODE_TLS_REJECT_UNAUTHORIZED=0
   LOGIN_EMAIL=abc@gmail.com
   LOGIN_PASSWORD=yourpassword
   TESTCASE_TITLE=Sample Test Case
   TARGET_PATH=/api/endpoint/path
   ```
### Step 4: Upload Scripts & Configure Host Site
1. Run the Command to upload all  the scripts to the Host and Target sites
   ```bash
   npm run setup
   ```

2. Once completed, go to the **Host site** and verify the following Doctypes are available in the **Doctype List**: 
   - Test Case Configurator
   - Site Details
   - Test Fields

### Step 5: Configure Site Details on Host

- Refer to the vedio [Configure Site Details](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/configure_test_pilot/setting_up_configurator/)
- Navigate to **Site Details** on the Host site and do the following:
   - Click **Add New**. Set **Site Name** to the Target site URL.
   - Set **Key** to the authentication key (Base64 encoded).
   - Set **Client** to the name of the client.
   - Set **Doctype List** Give the Doctype Names to be Tested:  Eg : `["Customer", "Quotation"] `
   - Click **Save** to complete the setup.
   


### Step 6: Upload and Verify Test Data

1. Run the following command to upload the sample test data in the code editor terminal:
    ```bash
    npm run upload_testdata
    ```
2. After the upload completes, verify that the test data has been uploaded correctly:
    - Go to the host site.
    - Navigate to **Test Case Configurator**.
    - Search for the sample test data.
    - Confirm that test cases related to quotations are available.

### Step 7: Run Cypress Tests

Open Cypress using the following command:

```bash
npx cypress open
```

- Select **End-to-End Testing**.
- Choose the `test.cy.ts` file.

This will execute the base test for the Quotation module.

Following the above steps will ensure a successful setup and execution of tests in the Lens AI Test Pilot repository. For troubleshooting or further information, refer to the [official documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/).

---
###  Explore & Engage
Looking to dive deeper or need help getting started? Check out our full documentation for detailed insights, tips, and support.

###  [Documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/)
