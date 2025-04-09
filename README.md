
# Lens AI Test Pilot - Setup and Testing Guide

This document provides step-by-step instructions to set up and test the **Lens AI Test Pilot** repository. Follow these steps carefully to ensure a smooth configuration and execution of test cases.

---

## Setup Instructions

### Step 1: Clone the Repository

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/your-org/lens-ai-test-pilot.git
```

Navigate to the cloned repository:

```bash
cd lens-ai-test-pilot
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

**Example Environment Variables:**

```env
HOST_URL=https://demolens.docker.localhost
HOST_KEY=Basic wertyuiohgfghjkjhcghjghjfdfghityuyuytyuyuu==
TARGET_URL=https://qsgbcz.docker.localhost
TARGET_KEY=Basic wertyuiohgfghjkjhcghjghjfdfghityuyuytyuyuu==
DOCTYPE=Test Case Configurator
NODE_TLS_REJECT_UNAUTHORIZED=0
LOGIN_EMAIL=wesupport@lmnas.com
LOGIN_PASSWORD=***********************
```

**Description of Environment Variables:**

- `HOST_URL` → URL where you want to configure the Test Case Configurator.
- `HOST_KEY` → Basic authentication key for the host URL.
- `TARGET_URL` → URL where tests will be executed.
- `TARGET_KEY` → Basic authentication key for the target URL.
- `LOGIN_EMAIL` → Email address to log into the target URL.
- `LOGIN_PASSWORD` → Password to log into the target URL.

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
   - **Key:** Unique site key
   - **Client:** Client name
   - **Doctype List:**

```json
["Customer", "Customer Group", "Lead", "Quotation", "Sales Order", "Design"]
```

3. Save the details.

### Step 8: Upload Test Data

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
