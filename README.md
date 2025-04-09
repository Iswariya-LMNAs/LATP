# LENS AI Test Pilot

**LENS AI Test Pilot** is a tool that automates the testing of web applications using Cypress. Traditionally, testing was done after development, which caused delays and issues. Now, with LENS AI Test Pilot, you can create automated test scripts before development even begins. This allows testing and development to happen at the same time, speeding up the process and improving product quality.

It simplifies the testing process by automating repetitive tasks, allowing both developers and testers to focus on building the software, not on repetitive testing.


##  Key Features

- **Parallel Testing and Development:** Create test cases first and begin development immediately after. This saves time and speeds up the overall process.
- **Test Case Configurator:** A simple interface that lets users create test cases without writing any code. The tool will automatically generate test scripts for you.
- **Automated Test Script Generation:** Once you define a test scenario, LENS AI Test Pilot automatically creates the necessary test scripts, saving time and reducing errors.
- **Centralized Test Management:** Store all your test data in one place, making it easy to manage and update tests for your application.

---

# Lens AI Test Pilot - Setup and Testing Guide

This document provides step-by-step instructions to set up and test the **Lens AI Test Pilot** repository. Follow these steps carefully to ensure a smooth configuration and execution of test cases.

## Setup Instructions

### Step 1: Clone the Repository

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/your-org/lens-ai-test-pilot.git
```

Navigate to the cloned repository and open it in any text editors like VS Code:

```bash
cd lens-ai-test-pilot
code .
```

### Step 2: Checkout to the Develop Branch

Ensure you are on the correct branch by checking out the develop branch:

```bash
git checkout develop
```

### Step 3: Install Dependencies

Run the following command to install project dependencies:

```bash
npm install
```

Ensure you are using Node.js v20 by executing:

```bash
nvm use v20
```

### Step 4: Configure Environment Variables

1. Locate the `sample_env` file in the project directory. Copy it and create a new `.env` file in the root directory:
2. Edit the `.env` file and update the following variables:
3. Generate Encoded Authentication Key
   To generate your encoded authentication key:
    - Go to the site (Host or Target). Navigate to **Settings → API Access → Generate Keys**. Copy the **API Key** and **API Secret**.
    - Then, generate the secret key by running the following command in your terminal:

```bash
echo -n "YOUR_API_KEY:YOUR_API_SECRET" | base64
```

**Example Environment Variables:**

```env
HOST_URL=https://hostsite.docker.localhost
HOST_KEY=Basic wertyuiohgfghjkjhcghjghjfdfghityuyuytyuyuu==
TARGET_URL=https://targetsite.docker.localhost
TARGET_KEY=Basic wertyuiohgfghjkjhcghjghjfdfghityuyuytyuyuu==
DOCTYPE=Test Case Configurator
NODE_TLS_REJECT_UNAUTHORIZED=0
LOGIN_EMAIL=abc@gmail.com
LOGIN_PASSWORD=***********************
```

### Step 5: Upload Scripts

Run the following command to upload all scripts to the host and target sites:

```bash
npm run setup
```

### Step 6: Verify Uploaded Doctype

1. Go to the host site.
2. Navigate to the **Doctype List**.
3. Search for the following doctypes:
   - Test Case Configurator
   - Site Details
   - Test Fields

### Step 7: Configure Site Details

1. Navigate to **Site Details** on the host site.
2. Add the following details:
   - **Site Name:** Target site name
   - **Key:** Authentication key
   - **Client:** Client name
   - **Doctype List:** ["Customer", "Customer Group", "Lead", "Quotation", "Sales Order", "Design"]
3. Save the details.

### Step 8:  Upload Test Data

Run the following command to upload the test data:

```bash
npm run upload_testdata
```

### Step 9: Verify Test Data

1. Go to the host site.
2. Navigate to **Test Case Configurator**.
3. Search for the sample test data.
4. Verify that test cases related to quotation are available.

### Step 10: Run Cypress Tests

Open Cypress using the following command:

```bash
npx cypress open
```

- Select **End-to-End Testing**.
- Choose the `test2.cy.ts` file.

This will execute the base test for the Quotation module.

---

Following the above steps will ensure a successful setup and execution of tests in the Lens AI Test Pilot repository. For troubleshooting or further information, refer to the official documentation.

**Happy Testing!**

---

##  Explore & Engage

Looking to dive deeper or need help getting started? Check out our full documentation for detailed insights, tips, and support.

###  [Documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/)
