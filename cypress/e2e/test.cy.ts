import  { clActionFactory } from "../../src/action"; 
import { fnGetDelay } from "../../src/delay";

/// <reference types="cypress" />

/**
 * @describe
 *  Fetch the test data through API and store in "TtestHeaderData"
 * @it 
 * Logs into the application, navigates to the quotation page.
 * Filter the actions from the "TtestHeaderData".
 * Perform the executeAction in class clAction for filtered actions
 */

describe("Testing API Data", () => {
  before(() => {
    cy.task("fetchData").then((TtestHeader :TtestHeaderData) => {
      cy.wrap(TtestHeader).as('TtestHeader'); 
    });
  });

  it("login to the url and should log full API test data", () => {   
    const targetUrl = Cypress.env("TARGET_URL");
    const loginEmail = Cypress.env("LOGIN_EMAIL");
    const loginPassword = Cypress.env("LOGIN_PASSWORD");
    const targetPath = Cypress.env("TARGET_PATH")
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
    cy.get(".primary-action").click();
    cy.task("fetchData").then((TtestHeader : TtestHeaderData) => {
      //Filter all header actions (Onload,On change ,OnTab...) from TtestHeaderData 
      const CaFilteredActions :TTactionsData = TtestHeader.test_fields.filter(lActionRow => lActionRow.action); 
      CaFilteredActions.forEach((lActionRow) => {
      const CaActionData: TTactionsData = clActionFactory.filterActionData(TtestHeader.test_fields, lActionRow)
      var loAction:ifActionHandler = clActionFactory.createAction(lActionRow.action, CaActionData)  
      loAction.executeAction() 
      });
    });
  });
});
 