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
git clone https://github.com/lmnaslimited/lens_ai_test_pilot.git
```

Navigate to the cloned repository and open it in any text editors like VS Code:

```bash
cd lens_ai_test_pilot
code .
```


### Step 2: Install Dependencies

Run the following command to install project dependencies:

```bash
npm install
```

Ensure you are using Node.js v20 by executing:

```bash
nvm use v20
```


### Step 3: Set Up Local LENS Sites

To run the **Lens AI Test Pilot**, you need two LENS sites:

- The **Host site** is used for configuration.  
- The **Target site** is where tests will be executed.
   - If you already have two LENS sites, just identify which one will act as the host and which as the target.
   - If you don’t have the sites set up, follow the instructions below to spin up local instances.

Install Docker: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

Then run the following command to start two local LENS sites:

```bash
docker compose -f pwd.yml up -d
```

open the `/etc/hosts` file:

```bash
sudo vi /etc/hosts
```

Insert the following line, then save and exit the vi.

```
127.0.0.1   lenshost.localhost  lenstarget.localhost
```



Wait for a couple of minutes, then open your browser and visit:

- [http://lenshost.localhost:8080](http://lenshost.localhost:8080)
- [http://lenstarget.localhost:8080](http://lenstarget.localhost:8080)

Use the following credentials to log in:

- **Username:** `administrator`
- **Password:** `admin`

Proceed with the Frappe setup wizard on both sites. Once completed, your local Host and Target LENS sites will be ready to use.

### Step 4: Configure Environment Variables

1. Locate the `sample_env` file in the project directory. Copy it and create a new `.env` file in the root directory:
2. Edit the `.env` file and update the following variables:
3. Generate Encoded Authentication Key
   To generate your encoded authentication key:
    - Go to the site (Host or Target), navigate to **Profile → My Settings → API Access → Generate Keys**, and copy the **API Key** and **API Secret**.
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
TESTCASE_TITLE=<Title-of-test-case>
TARGET_PATH=<Doctype-Endpoint>
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
   - **Site Name:** Target site url
   - **Key:** Authentication key (basic key)
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
- Choose the `test.cy.ts` file.

This will execute the base test for the Quotation module.

---

Following the above steps will ensure a successful setup and execution of tests in the Lens AI Test Pilot repository. For troubleshooting or further information, refer to the [official documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/).

**Happy Testing!**

---

##  Explore & Engage

Looking to dive deeper or need help getting started? Check out our full documentation for detailed insights, tips, and support.

###  [Documentation](https://lmnaslimited.github.io/lens_ai_test_pilot_docs/ai-test-pilot/introduction/lens_ai_test_pilot/)
