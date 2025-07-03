import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";

let capturedErrors: string[] = [];
let capturedLogs: string[] = [];
let isTestPassed = true;

Cypress.on("fail", (error, runnable) => {
  isTestPassed = false;
  capturedErrors.push(`Test Failed: ${runnable.title} — ${error.message}`);
  throw error;
});

Cypress.on("uncaught:exception", (err) => {
  isTestPassed = false;
  capturedErrors.push(`Uncaught Exception: ${err.message}`);
  return false;
});

Cypress.on("log:added", (options) => {
  if (["log", "assert"].includes(options.name)) {
    capturedLogs.push(`[${options.name}] ${options.message}`);
  }
});

describe("Fetching Test scripts", () => {
  let testData: TtestHeaderData[] = [];
  let testRunData
  before(() => {
    cy.task("fetchtestscript").then((result: { message: { test_run, master_data: [] } }) => {
      testData = result.message.master_data;
      testRunData = result.message.test_run
      if (!testData || testData.length === 0) {
        throw new Error("No test scripts found. Failed to create the test run.");
      }
      cy.wrap(testData).as("scripts");
    });
  });

  // Main test to loop through each test script and execute associated actions
  it("loops through each Master Data", function () {
    cy.get("@scripts").then((scripts: TtestHeaderData[]) => {
      scripts.forEach((script) => {
        // Load environment variables
        const targetUrl = Cypress.env("TARGET_URL");
        const loginEmail = Cypress.env("LOGIN_EMAIL");
        const loginPassword = Cypress.env("LOGIN_PASSWORD");
        cy.request({
          method: 'POST',
          url: `${targetUrl}/api/method/login`,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: {
            usr: loginEmail,
            pwd: loginPassword
          }
        })
        cy.visit(`${targetUrl}/app`);
        const CaFilteredParent = testData as TtestHeaderData[];
        clActionFactory.executeAction(CaFilteredParent);
        // cy.log("Log the CaFilteredParent", JSON.stringify(CaFilteredParent));
        // Filter header actions that contain an 'action' field (e.g., onLoad, onChange, etc.)
        const CaFilteredActions: TTactionsData = script.actual_test_data.filter((lActionRow) => lActionRow.action);
        // Loop through each filtered action and execute it using the action factory
        CaFilteredActions.forEach((lActionRow) => {
          const CaActionData: TTactionsData = clActionFactory.filterActionData(script.actual_test_data, lActionRow);
          const loAction: ifActionHandler = clActionFactory.createAction(lActionRow.action, CaActionData);
          loAction.executeAction();
        });
        // Perform logout sequence
        cy.get('.nav-link > .avatar > .avatar-frame').click();
        cy.wait(fnGetDelay("long"));
        cy.get('[onclick="return frappe.app.logout()"]').click();
        cy.wait(3000);
        // Clear session data to isolate each script test
        cy.clearCookies();
        cy.clearLocalStorage();
      });
    });
  });

  afterEach(() => {
    const targetUrl = Cypress.env("TARGET_URL");
    const authKey = Cypress.env("TARGET_KEY");
    const testResult = isTestPassed ? "Pass" : "Fail";

    const headers = {
      Authorization: `${authKey}`,
      Cookie: "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
      "Content-Type": "application/json",
    };

    const logEntries = [
      ...capturedLogs.map(message => ({ type: "Log", message })),
      ...capturedErrors.map(message => ({ type: "Error", message }))
    ];

    const runLogPayload = {
      script_id: testData[0].test_script,
      master_data_id: testData[0].name,
      test_run_id: testRunData.name,
      log_entries: logEntries
    };

    cy.request({
      method: "POST",
      url: `${targetUrl}/api/resource/Run Log`,
      headers,
      body: JSON.stringify(runLogPayload)
    }).then((logRes: TrunLogResponse) => {
      const runLogId = logRes.body.data.name;
      const { test_run_id, script_id, master_data_id } = logRes.body.data;

      cy.request({
        method: "GET",
        url: `${targetUrl}/api/resource/Test Run/${test_run_id}`,
        headers
      }).then((testRunRes: TtestRunResponse) => {
        const testLogRows = testRunRes.body.data.test_log;

        const matchingLogRow = testLogRows.find(row =>
          row.test_script === script_id && row.master_data === master_data_id
        );

        if (matchingLogRow) {
          const testLogRowId = matchingLogRow.name;
          const updateLogPayload = {
            run_log: runLogId,
            result: testResult
          };

          cy.request({
            method: "PUT",
            url: `${targetUrl}/api/resource/Test Log/${testLogRowId}`,
            headers,
            body: JSON.stringify(updateLogPayload)
          });
        }
      });
    });

    isTestPassed = true;
    capturedErrors = [];
    capturedLogs = [];
  });

});