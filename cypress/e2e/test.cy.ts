import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";
describe("Fetching Test scripts", () => {
  let testData: TtestHeaderData[] = [];
  before(() => {
    cy.task("fetchtestscript").then((result: { message: { master_data:[] } }) => {
      testData = result.message.master_data;
      if (!testData || testData.length === 0) {
      throw new Error("No test scripts found. Failed to create the test run.");}
      cy.wrap(testData).as("scripts");
    cy.log("Fetched Scripts Data: " + JSON.stringify(testData));
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
});





