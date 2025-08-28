# LENS AI Test Pilot

**LENS AI Test Pilot** is a tool that automates the testing of web applications using Cypress. Traditionally, testing was done after development, which caused delays and issues. Now, with LENS AI Test Pilot, you can create automated test scripts before development even begins. This allows testing and development to happen at the same time, speeding up the process and improving product quality.

It simplifies the testing process by automating repetitive tasks, allowing both developers and testers to focus on building the software, not on repetitive testing.

### Key Features

-  **Parallel Testing and Development:** Create test cases first and begin development immediately after. This saves time and speeds up the overall process.

-  **Test Case Configurator:** A simple interface that lets users create test cases without writing any code. The tool will automatically generate test scripts for you.

-  **Automated Test Script Generation:** Once you define a test scenario, LENS AI Test Pilot automatically creates the necessary test scripts, saving time and reducing errors.

-  **Centralized Test Management:** Store all your test data in one place, making it easy to manage and update tests for your application.

# Lens AI Test Pilot - Setup and Testing Guide

This guide explains how to set up **Lens AI Test Pilot** in two scenarios:

-   **Scenario A – Using Codespace** (if you do not have a local instance).  [Using Codespace](#-scenario-a-set-up-host-system-with-codespace)
    
-   **Scenario B – Using Local Instance** (if you already have one).  [Using Local LENS Instance](#-scenario-b-if-you-already-have-a-local-lens-instance)
----

### 🔹 Scenario A: Set Up Host System with Codespace

1.  **Launch Codespace & Set Up Site**
    
    -   Launch the Codespace in the repository [lens_ai_test_pilot](https://github.com/lmnaslimited/lens_ai_test_pilot) and wait for 2–3 minutes.
        
    -   Open the forwarded site in your browser.
        
    -   Login using:
        
        -   **Username:** `administrator`
            
        -   **Password:** `admin`
            
    -   Complete the setup wizard.

    This site will act as both:
    
    -   **Host site** → used for configuration.
        
    -   **Target site** → where tests will be executed.

    > ⚠️ Note: Cypress tests cannot run directly inside Codespace. You must clone the repository locally to run tests.

2.  **Generate Access Keys**
    
    -   In your **Host site**:
        
        -   Go to `Profile → My Settings → API Access`.
            
        -   Click **Generate Keys**.
            
        -   Copy both **API Key** and **API Secret**.

3.  **Install Project Dependencies & Configure Environment**

In Codespace Terminal, do the below command

    ```bash
    npm install
    ```
    ```bash
    npm run env
    ```
    > ⚠️ The above command will ask for API Key and Secret.

    ```bash
    npm run setup
    ```
    
	✅ After setup, check that the following Doctypes exist in your in the *Host site → Doctype List*:
    
    -   Test Case Configurator
    -   Master Data   
    -   Site Details  
    -   Test Fields  
    -   Test Plan  
    -   Test Lab
    -   Test Run
    
	✅ Check "TL-001-Sample Test Lab" is created in Test Lab list

4.  **Clone the Repository Locally and install dependency**

    ```bash
    git clone https://github.com/lmnaslimited/lens_ai_test_pilot.git
    ```

    ```bash
    cd lens_ai_test_pilot
    ```

    ```bash
    npm install
    ```

5.  **Copy Environment File from Codespace**
    
    -   Locate the `.env` file inside your Codespace.
        
    -   Copy it into your locally cloned repository folder.

6.  **Run Cypress Tests**

    ```bash
    npm run ui_test 
    ```

    This will open the Cypress Test Runner and execute the sample **Quotation module test** against your target site.

----------

### 🔹 Scenario B: If You Already Have a Local LENS Instance

> ⚠️  Make sure your local LENS instance has server script enabled. [document](https://lmnaslimited.github.io/lens-docs/04-developer-cheat-sheet/01-infrastructure/03-bench-commands/#enabling-server-script-in-version-15-bench)

1.  **Generate Access Keys**
    
    -   In your **Host site**:
        
        -   Go to `Profile → My Settings → API Access`.
            
        -   Click **Generate Keys**.
            
        -   Copy both **API Key** and **API Secret**.

2.  **Clone the Repository Locally and install dependency**
    ```bash
    git clone https://github.com/lmnaslimited/lens_ai_test_pilot
    ```
    ```bash
    cd lens_ai_test_pilot
    ```
    ```bash
    npm install
    ```
            
3.  **Install Project Dependencies & Configure Environment**

    ```bash
    npm run env
    ```
    > ⚠️  This command will prompt for API Key and Secret.  
After it runs, open the `.env` file in your `lens_ai_test_pilot` folder and update **HOST_URL** and **TARGET_URL** with your local LENS instance domain.
    
    ```bash
    npm run setup
    ```
    
    ✅ After setup, check that the following Doctypes exist in your in the *Host site → Doctype List*:
    
    -   Test Case Configurator
    -   Master Data   
    -   Site Details  
    -   Test Fields  
    -   Test Plan  
    -   Test Lab
    -   Test Run
    
	✅ Check "TL-001-Sample Test Lab" is created in Test Lab list
        
4.  **Run Cypress Tests**
    ```bash
    npm run ui_test 
    ```
    
    This will open the Cypress Test Runner and execute the sample **Quotation module test** against your target site.

## 📖 Documentation & Help

For deeper insights, troubleshooting, and advanced configurations, check out our official documentation:  
👉 [Lens AI Test Pilot Docs](https://lmnaslimited.github.io/lens-docs/03-lens-ai-test-pilot/01-introduction/01-lens_ai_test_pilot)

----------