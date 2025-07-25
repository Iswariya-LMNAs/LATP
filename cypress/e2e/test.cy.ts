import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";

const testLab = require("../fixtures/testlab.json");
const testLabData = testLab.message.test_lab.test_lab_script;
const testRunName = Cypress.env("FETCHED_TEST_RUN");
const testScriptData = Cypress.env("FETCHED_MASTER_DATA");

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

describe("Automated Test Run", () => {
  let currentScript: any;
  const storeDocname: { idx: number; docname: string }[] = [];
  let createdDocnames: string[] = [];
  let createdDocsByIndex: { [key: number]: string }[] = [];

  testScriptData.forEach((script) => {
    it(`should run test script: ${script.name}`, () => {
      currentScript = script;

      const targetUrl = Cypress.env("TARGET_URL");
      let loginEmail: string;
      let loginPassword: string;

      if (currentScript.is_workflow_test_script && currentScript.workflow_user) {
        const envPrefix = currentScript.workflow_user.trim().toUpperCase().replace(/\s+/g, "_");
        const emailKey = `${envPrefix}_EMAIL`;
        const passwordKey = `${envPrefix}_PASSWORD`;

        loginEmail = Cypress.env(emailKey);
        loginPassword = Cypress.env(passwordKey);

        if (!loginEmail || !loginPassword) {
          throw new Error(`❌ Missing credentials for workflow user "${currentScript.workflow_user}". Ensure ${emailKey} and ${passwordKey} exist in .env`);
        }
      } else {
        loginEmail = Cypress.env("LOGIN_EMAIL");
        loginPassword = Cypress.env("LOGIN_PASSWORD");
      }

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
      });

      cy.visit(`${targetUrl}/app`);

      if (currentScript.actual_test_data) {
        // For connected combined master data, `use_docname` logic can be handled if needed, or skip
        // Inject document only if script.use_docname is valid
        if (script.use_docname && script.use_docname !== 0) {
          const stored = storeDocname.find(item => Number(item.idx) === Number(script.use_docname));
          if (stored?.docname) {
            currentScript.document = stored.docname;
            cy.log(`✅ Injected matchedScript.document = ${currentScript.document}`);
          } else {
            cy.log(`⚠️ No matching docname found for idx: ${script.use_docname}`);
          }
        }

        clActionFactory.executeAction([currentScript]);

        const CaFilteredActions = currentScript.actual_test_data.filter((row) => row.action);
        CaFilteredActions.forEach((row) => {
          const CaActionData = clActionFactory.filterActionData(currentScript.actual_test_data, row);
          const loAction = clActionFactory.createAction(row.action, CaActionData);
          loAction.executeAction();
        });

        if (
          currentScript.connection === "Create" &&
          currentScript.connection_doctype
        ) {
          clActionFactory.handleConnection(currentScript).then((createdDocname) => {
            if (typeof createdDocname === "string") {
              createdDocnames.push(createdDocname);
              currentScript.linked_docname = createdDocname;
              createdDocsByIndex.push({ [currentScript.idx]: createdDocname });
            }
          });
        }
      }

      cy.wait(fnGetDelay("medium"));

      cy.url().then((currentUrl: string) => {
        const parts = currentUrl.split('/');
        const docname = parts.pop() || parts.pop(); // handles trailing slash
        if (docname) {
          storeDocname.push({ idx: script.idx, docname });
          // cy.log(JSON.stringify(storeDocname));
        }
      });

      cy.request({
        method: 'GET',
        url: `${targetUrl}/api/method/logout`,
        headers: { 'Accept': 'application/json' }
      });

      cy.wait(3000);
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    afterEach(() => {
      if (!currentScript) return;

      const connectionType = currentScript.connection?.toString().trim();
      let foundEntry: { [key: number]: string } | undefined;

      if (connectionType === "Read" && currentScript.connection_from != null) {
        const connectionFromIndex = currentScript.connection_from;

        foundEntry = createdDocsByIndex.find(
          (entry) => Number(Object.keys(entry)[0]) === connectionFromIndex
        );
      }

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

      let masterDataNames: string[] = [];
      if (currentScript.name.includes("$")) {
        masterDataNames = currentScript.name.split("$").map((name) => name.trim());
      } else {
        masterDataNames = [currentScript.name];
      }

      for (const masterName of masterDataNames) {
        currentScript.master_data = masterName;

        // Match the master name with test lab to get correct test_script
        const matchedTestScript = testLabData.find(
          (script: any) => script.master_data === masterName
        );

        if (!matchedTestScript) {
          cy.log(`No matching test_lab_script found for master_data: ${masterName}`);
          continue; // Skip this iteration if no match found
        }

        currentScript.test_script = matchedTestScript.test_script;

        const runLogPayload = {
          script_id: currentScript.test_script,
          master_data_id: currentScript.master_data,
          test_run_id: testRunName,
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

              const updateLogPayload: any = {
                run_log: runLogId,
                result: testResult,
              };

              if (
                connectionType === "Read" &&
                currentScript.connection_from != null &&
                foundEntry
              ) {
                const connectionFromIndex = currentScript.connection_from;
                updateLogPayload.linked_document = foundEntry[connectionFromIndex];
              }

              cy.request({
                method: "PUT",
                url: `${targetUrl}/api/resource/Test Log/${testLogRowId}`,
                headers,
                body: JSON.stringify(updateLogPayload),
              });
            }
          });
        });
      }

      isTestPassed = true;
      capturedErrors = [];
      capturedLogs = [];
      currentScript = null;
    });
  });
});
