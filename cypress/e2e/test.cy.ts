import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";
describe("Fetch Test scripts", () => {
  let testData: any[] = [];
  before(() => {
    cy.task("fetchtestscript").then((result: { message: { scripts_data: any[] } }) => {
      testData = result.message.scripts_data;
      if (!testData || testData.length === 0) {
      throw new Error("No test scripts found. Failing the test run.");
     }
      cy.wrap(testData).as("scripts");
      // cy.log("Fetched Scripts Data: " + JSON.stringify(testData));
    });
  });

// Main test to loop through each test script and execute associated actions
it("loops through each test data", function () {
  // Load environment variables
  const targetUrl = Cypress.env("TARGET_URL");
  const loginEmail = Cypress.env("LOGIN_EMAIL");
  const loginPassword = Cypress.env("LOGIN_PASSWORD");
  const targetPath = Cypress.env("TARGET_PATH")
  cy.get("@scripts").then((scripts: TtestHeaderData[]) => {
    scripts.forEach((script) => {
    // Visit login page and perform login
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
    }).then((response: Cypress.Response<any>) => {
      cy.log(JSON.stringify(response.body));
      // Now TypeScript knows response.body exists
    });
    cy.visit(`${targetUrl}/app/home`);
    cy.get('.btn-primary').click()
      cy.visit(`${targetUrl}/app/${targetPath}`);
      cy.wait(fnGetDelay("medium"));
      cy.get(".primary-action").click();
      cy.wait(fnGetDelay("medium"));
      // console.log(script);
    // Filter header actions that contain an 'action' field (e.g., onLoad, onChange, etc.)
      const CaFilteredActions: TTactionsData = script.test_fields.filter((lActionRow) => lActionRow.action);
     
    // Loop through each filtered action and execute it using the action factory
      CaFilteredActions.forEach((lActionRow) => {
      const CaActionData: TTactionsData = clActionFactory.filterActionData(script.test_fields, lActionRow);
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
});





