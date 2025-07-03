import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";

const testData = require("../fixtures/testdata.json");
const testRunData = testData.message.test_run;
const masterScripts = testData.message.master_data;

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

describe("Dynamic Master Test Scripts", () => {
  let currentScript: any;
  masterScripts.forEach((script) => {
    it(`should run test script: ${script.test_script}`, () => {
      currentScript = script;

      // const CaFilteredParent = currentScript as TtestHeaderData[];
      // clActionFactory.executeAction(CaFilteredParent);
      // // cy.log("Log the CaFilteredParent", JSON.stringify(CaFilteredParent));
      // // Filter header actions that contain an 'action' field (e.g., onLoad, onChange, etc.)
      // const CaFilteredActions: TTactionsData = script.actual_test_data.filter((lActionRow) => lActionRow.action);
      // // Loop through each filtered action and execute it using the action factory
      // CaFilteredActions.forEach((lActionRow) => {
      //   const CaActionData: TTactionsData = clActionFactory.filterActionData(script.actual_test_data, lActionRow);
      //   const loAction: ifActionHandler = clActionFactory.createAction(lActionRow.action, CaActionData);
      //   loAction.executeAction();
      // });

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


      clActionFactory.executeAction([currentScript]);

      const CaFilteredActions = currentScript.actual_test_data.filter((row) => row.action);
      CaFilteredActions.forEach((row) => {
        const CaActionData = clActionFactory.filterActionData(currentScript.actual_test_data, row);
        const loAction = clActionFactory.createAction(row.action, CaActionData);
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

    afterEach(() => {
      if (!currentScript) return;

      const targetUrl = Cypress.env("TARGET_URL");
      const authKey = Cypress.env("TARGET_KEY");
      const testResult = isTestPassed ? "Pass" : "Fail";

      const headers = {
        Authorization: `${authKey}`,
        Cookie: "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
        "Content-Type": "application/json",
      };

      const logEntries = [
        ...capturedLogs.map((message) => ({ type: "Log", message })),
        ...capturedErrors.map((message) => ({ type: "Error", message })),
      ];

      const runLogPayload = {
        script_id: currentScript.test_script,
        master_data_id: currentScript.name,
        test_run_id: testRunData.name,
        log_entries: logEntries,
      };

      cy.request({
        method: "POST",
        url: `${targetUrl}/api/resource/Run Log`,
        headers,
        body: JSON.stringify(runLogPayload),
      }).then((logRes: TrunLogResponse) => {
        const runLogId = logRes.body.data.name;
        const { test_run_id, script_id, master_data_id } = logRes.body.data;

        cy.request({
          method: "GET",
          url: `${targetUrl}/api/resource/Test Run/${test_run_id}`,
          headers,
        }).then((testRunRes: TtestRunResponse) => {
          const testLogRows = testRunRes.body.data.test_log;

          const matchingLogRow = testLogRows.find(
            (row) =>
              row.test_script === script_id &&
              row.master_data === master_data_id
          );

          if (matchingLogRow) {
            const testLogRowId = matchingLogRow.name;
            const updateLogPayload = {
              run_log: runLogId,
              result: testResult,
            };

            cy.request({
              method: "PUT",
              url: `${targetUrl}/api/resource/Test Log/${testLogRowId}`,
              headers,
              body: JSON.stringify(updateLogPayload),
            });
          }
        });
      });

      isTestPassed = true;
      capturedErrors = [];
      capturedLogs = [];
      currentScript = null;
    });
  });
});