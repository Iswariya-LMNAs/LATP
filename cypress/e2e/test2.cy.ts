import  { clActionFactory } from "../../src/action"; 
import fetchData from "../../src/fetchdata";
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
    });
  });

  it("login to the url and should log full API test data", () => {
    cy.visit('https://qsgbcz.docker.localhost/login#login')
    cy.get('#login_email').type('Wesupport@lmnas.com')
    cy.get('#login_password').type('supportConfig@03{enter}').wait(4000)
    cy.visit('https://qsgbcz.docker.localhost/app/quotation').wait(2000)
    cy.get('.primary-action').click()
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

 
