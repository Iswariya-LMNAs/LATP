// cypress/support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      check_default_value(field_name: string, value: string, iWait?: number): Chainable<any>;
    }
  }
  