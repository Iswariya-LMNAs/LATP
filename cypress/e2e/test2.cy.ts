import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";
import { clTestLabFactory } from "../../src/testLab";

const targetUrl = Cypress.env("TARGET_URL");
const authKey = Cypress.env("TARGET_KEY");
const hostUrl = Cypress.env("HOST_URL");
const hostKey = Cypress.env("HOST_KEY");
const testLabData = Cypress.env("FETCHED_TEST_LAB");
const testRunName = Cypress.env("FETCHED_TEST_RUN");
const testMasterData = Cypress.env("FETCHED_MASTER_DATA");

let capturedErrors: string[] = [];
let capturedLogs: string[] = [];
let isTestPassed = true;

const requestHeaders = {
  Authorization: `${authKey}`,
  Cookie: "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
  "Content-Type": "application/json",
};

const requestHeaders2 = {
  Authorization: `${hostKey}`,
  Cookie: "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
  "Content-Type": "application/json",
};

// Helper: Perform login
const login = (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `${targetUrl}/api/method/login`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      usr: email,
      pwd: password,
    },
  });
};

// Helper: Perform logout
const logout = () => {
  cy.request({
    method: 'GET',
    url: `${targetUrl}/api/method/logout`,
    headers: {
      'Accept': 'application/json',
    },
  });
  cy.wait(3000);
  cy.clearCookies();
  cy.clearLocalStorage();
};

Cypress.on("fail", (error, runnable) => {
  isTestPassed = false;
  capturedErrors.push(`Test Failed: ${runnable.title} — ${error.message}`);
  throw error;
});

Cypress.on("uncaught:exception", (err) => {
  // isTestPassed = false;
  // capturedErrors.push(`Uncaught Exception: ${err.message}`);
  return false;
});

Cypress.on("log:added", (options) => {
  if (["log", "assert"].includes(options.name)) {
    capturedLogs.push(`[${options.name}] ${options.message}`);
  }
});

describe("Automated Test Run", () => {
  // it(`First`, () => {
  //   cy.log(JSON.stringify(testMasterData));
  // })
  let currentScript: any;
  // const storeDocname: { idx: number; docname: string }[] = [];
  // let createdDocnames: string[] = [];
  // let createdDocsByIndex: { idx: number; docname: string }[] = [];

  testMasterData.forEach((script) => {
    it(`should run test script: ${script.name}`, () => {
      currentScript = script;

      const targetUrl = Cypress.env("TARGET_URL");
      let loginEmail: string;
      let loginPassword: string;

      // if (currentScript.is_workflow_test_script && currentScript.workflow_user) {
      //   const envPrefix = currentScript.workflow_user.trim().toUpperCase().replace(/\s+/g, "_");
      //   const emailKey = `${envPrefix}_EMAIL`;
      //   const passwordKey = `${envPrefix}_PASSWORD`;

      //   loginEmail = Cypress.env(emailKey);
      //   loginPassword = Cypress.env(passwordKey);

      //   if (!loginEmail || !loginPassword) {
      //     throw new Error(`❌ Missing credentials for workflow user "${currentScript.workflow_user}". Ensure ${emailKey} and ${passwordKey} exist in .env`);
      //   }
      // } else {
        loginEmail = Cypress.env("LOGIN_EMAIL");
        loginPassword = Cypress.env("LOGIN_PASSWORD");
      // }

      login(loginEmail, loginPassword);

      cy.visit(`${targetUrl}/app`);
      if (currentScript.actual_test_data) {

        const masterLabScript = testLabData.test_lab_script.find(
          (labScript: any) => labScript.master_data === currentScript.name
        );

        if (masterLabScript.connection == "Read") {
            cy.log(`🔗 Initializing connection for: ${script.test_script}`);
    
            const connectionInstance = clTestLabFactory.create(
              masterLabScript.connection,                   // "Read" or "Create"
              masterLabScript.store_docname,
              masterLabScript.use_docname,
              masterLabScript.connection,
              masterLabScript.connection_doctype,
              masterLabScript.linked_document,
              masterLabScript.connection_from
            );
    
            // execute
            connectionInstance.execute(masterLabScript).then((finalDocs) => {
              cy.log("After Read: " + JSON.stringify(finalDocs));
          });
          } else {
            clActionFactory.executeAction([currentScript]);
          }

        // cy.log("masterLabScript", JSON.stringify(masterLabScript));

        // if (masterLabScript.use_docname && masterLabScript.use_docname != 0) {
        //   const stored = createdDocsByIndex.find(item => Number(item.idx) === Number(masterLabScript.use_docname));
        //   cy.log("stored", stored)
        //   if (stored?.docname) {
        //     currentScript.document = stored.docname;
        //     cy.log(`✅ Injected matchedScript.document = ${currentScript.document}`);
        //   } else {
        //     cy.log(`⚠️ No matching docname found for idx: ${masterLabScript.use_docname}`);
        //   }
        // }

        // clActionFactory.executeAction([currentScript]);

        // const CaFilteredActions = currentScript.actual_test_data.filter((row) => row.action);
        // CaFilteredActions.forEach((row) => {
        //   const CaActionData = clActionFactory.filterActionData(currentScript.actual_test_data, row);
        //   const loAction = clActionFactory.createAction(row.action, CaActionData);
        //   loAction.executeAction();
        // });

        // if (
        //   masterLabScript.connection === "Create" &&
        //   masterLabScript.connection_doctype
        // ) {
        //   clActionFactory.handleConnection(masterLabScript).then((createdDocname) => {
        //     if (typeof createdDocname === "string") {
        //       cy.log("IN")
        //       createdDocnames.push(createdDocname);
        //       masterLabScript.linked_docname = createdDocname;
        //       createdDocsByIndex.push({
        //         idx: masterLabScript.idx,
        //         docname: createdDocname
        //       });
        //     }
        //   });
        // }
        if (masterLabScript.connection == "Create") {
          cy.log(`🔗 Initializing connection for Create`);
  
          const connectionInstance = clTestLabFactory.create(
            masterLabScript.connection,                   // "Read" or "Create"
            masterLabScript.store_docname,
            masterLabScript.use_docname,
            masterLabScript.connection,
            masterLabScript.connection_doctype,
            masterLabScript.linked_document,
            masterLabScript.connection_from
          );
  
          // execute
          connectionInstance.execute(masterLabScript).then((docsByIdx) => {
            cy.log("Created Docs: " + JSON.stringify(docsByIdx));
        });
        }
      }

      cy.wait(fnGetDelay("medium"));

      // cy.url().then((currentUrl: string) => {
      //   const parts = currentUrl.split('/');
      //   const docname = parts.pop() || parts.pop();
      //   if (docname) {
      //     storeDocname.push({ idx: script.idx, docname });
      //   }
      // });

      logout()
    });

    // afterEach(() => {
    //   if (!currentScript) return;

    //   const connectionType = currentScript.connection?.toString().trim();
    //   let linkedDocumentEntry: { [key: number]: string } | undefined;

    //   if (connectionType === "Read" && currentScript.connection_from != null) {
    //     const sourceConnectionIndex = currentScript.connection_from;

    //     linkedDocumentEntry = createdDocsByIndex.find(
    //       (entry) => Number(Object.keys(entry)[0]) === sourceConnectionIndex
    //     );
    //   }

    //   const combinedLogEntries = [
    //     ...capturedLogs.map((message) => ({ type: "Log", message })),
    //     ...capturedErrors.map((message) => ({ type: "Error", message })),
    //   ];

    //   const testOutcome = isTestPassed ? "Pass" : "Fail";

    //   const masterDataNamesList = currentScript.name.includes("$")
    //     ? currentScript.name.split("$").map((name) => name.trim())
    //     : [currentScript.name];

    //   for (const masterDataName of masterDataNamesList) {

    //     const masterDataID = masterDataName;

    //     const matchedTestScript = testLabData.test_lab_script.find(
    //       (script: any) => script.master_data === masterDataID
    //     );

    //     if (!matchedTestScript) {
    //       cy.log(`No matching test_lab_script found for master_data: ${masterDataID}`);
    //       continue;
    //     }

    //     const testScriptId = matchedTestScript.test_script;

    //     const runLogPayload = {
    //       script_id: testScriptId,
    //       master_data_id: masterDataID,
    //       test_run_id: testRunName,
    //       log_entries: combinedLogEntries,
    //     };

    //     cy.request({
    //       method: "POST",
    //       url: `${hostUrl}/api/resource/Run Log`,
    //       headers: requestHeaders2,
    //       body: JSON.stringify(runLogPayload),
    //     }).then((runLogResponse: TrunLogResponse) => {
    //       const runLogId = runLogResponse.body.data.name;

    //       cy.request({
    //         method: "GET",
    //         url: `${hostUrl}/api/resource/Test Run/${testRunName}`,
    //         headers: requestHeaders2,
    //       }).then((testRunResponse: TtestRunResponse) => {
    //         const testLogEntries = testRunResponse.body.data.test_log;

    //         const matchingTestLogEntry = testLogEntries.find(
    //           (entry) =>
    //             entry.test_script === testScriptId &&
    //             entry.master_data === masterDataID
    //         );

    //         if (matchingTestLogEntry) {
    //           const testLogEntryId = matchingTestLogEntry.name;

    //           const updateLogPayload: any = {
    //             run_log: runLogId,
    //             result: testOutcome,
    //           };

    //           if (
    //             connectionType === "Read" &&
    //             currentScript.connection_from != null &&
    //             linkedDocumentEntry
    //           ) {
    //             const sourceConnectionIndex = currentScript.connection_from;
    //             updateLogPayload.linked_document = linkedDocumentEntry[sourceConnectionIndex];
    //           }

    //           cy.request({
    //             method: "PUT",
    //             url: `${hostUrl}/api/resource/Test Log/${testLogEntryId}`,
    //             headers: requestHeaders2,
    //             body: JSON.stringify(updateLogPayload),
    //           });
    //         }
    //       });
    //     });
    //   }

    //   isTestPassed = true;
    //   capturedErrors = [];
    //   capturedLogs = [];
    //   currentScript = null;
    // });
  });
});