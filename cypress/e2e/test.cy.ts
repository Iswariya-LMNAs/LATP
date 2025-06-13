import { clActionFactory } from "../../src/action";
import { fnGetDelay } from "../../src/delay";
// import { fnCreateTestRunIfLabExists, fetchData, type ifScript } from "../../src/fetchLab";
/// <reference types="cypress" />
describe("Testing Test Lab", () => {
   // sample output :
  //   // [{"test_script": "Sample", "master_data": "Master Data-1"}, {"test_script": "Sample-2", "master_data": "Master Data-2"}]
  let testData: any[] = [];
  before(() => {
    cy.task("fetchMasterData").then((result: { message: { scripts_data: any[] } }) => {
      testData = result.message.scripts_data;
      cy.wrap(testData).as("scripts");
      // cy.log("Fetched Scripts Data: " + JSON.stringify(testData));
    });
  });
it("loops through test data", function () {
  const targetUrl = Cypress.env("TARGET_URL");
  const loginEmail = Cypress.env("LOGIN_EMAIL");
  const loginPassword = Cypress.env("LOGIN_PASSWORD");
  const targetPath = Cypress.env("TARGET_PATH")
  cy.get("@scripts").then((scripts: TtestHeaderData[]) => {
    scripts.forEach((script) => {
      cy.log(JSON.stringify(script));
      cy.visit(`${targetUrl}/login#login`); //v-14
      cy.get("#login_email").type(`${loginEmail}`);
      cy.get("#login_password").type(`${loginPassword}{enter}`).wait(fnGetDelay("medium"));
      cy.wait(fnGetDelay("medium"));
      cy.visit(`${targetUrl}/app/${targetPath}`);
      cy.wait(fnGetDelay("medium"));
      cy.get(".primary-action").click();
      cy.wait(fnGetDelay("medium"));
      console.log(script);
        //Filter all header actions (Onload,On change ,OnTab...) from TtestHeaderData
      const CaFilteredActions: TTactionsData = script.test_fields.filter((lActionRow) => lActionRow.action);
      console.log("CaFilteredActions:", CaFilteredActions);
      cy.log("cafiletr",CaFilteredActions)
      CaFilteredActions.forEach((lActionRow) => {
      const CaActionData: TTactionsData = clActionFactory.filterActionData(script.test_fields, lActionRow);
      const loAction: ifActionHandler = clActionFactory.createAction(lActionRow.action, CaActionData);
      loAction.executeAction();
    });
      // logout
      cy.get('.nav-link > .avatar > .avatar-frame').click();
        cy.wait(fnGetDelay("long"));
        cy.get('[onclick="return frappe.app.logout()"]').click();
        cy.wait(3000);
        cy.clearCookies();
        cy.clearLocalStorage();
    });
  });
});
});





