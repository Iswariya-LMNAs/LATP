// import { fnGetDelay } from "./delay";

// export interface ifProperties {
//     is_read_only: boolean;
//     is_mandatory: boolean;
//     is_hidden: boolean;
//     action: ifActionHandler;
//     validate(): void;
// }

// export abstract class clProperties implements ifProperties {
//     is_read_only: boolean;
//     is_mandatory: boolean;
//     is_hidden: boolean;
//     action: ifActionHandler;

//     constructor(
//         is_read_only: boolean,
//         is_mandatory: boolean,
//         is_hidden: boolean,
//         action: ifActionHandler
//     ) {
//         this.is_read_only = is_read_only;
//         this.is_mandatory = is_mandatory;
//         this.is_hidden = is_hidden;
//         this.action = action;
//     }
//     abstract validate(): void;
// }

// // ReadOnly 
// class clReadOnly extends clProperties {
//     constructor(action: ifActionHandler) {
//         super(true, false, false, action); 
//     }

//     validate(): void {
//         const selector = `.frappe-control[data-fieldname="${this.action.actionRow.field_name}"] > .form-group > .control-input-wrapper > .control-value`;

//         cy.get(selector)
//             .log("validating the readonly")
//             .should('exist')               
//             .should('be.visible')    
//             .and('have.text', this.action.actionRow.value);
//     }
// }

// // Mandatory 
// class clMandatory extends clProperties {
//     constructor(action: ifActionHandler) {
//         super(false, true, false, action); 
//     }

//     validate(): void {
//         const selector = `.frappe-control[data-fieldname="${this.action.actionRow.field_name}"]`;
//         cy.wait(fnGetDelay('medium'));
//         cy.log("Vlidating the Mandatory")
//         cy.get(selector).filter(':visible')
//             .each(($el) => {
//             cy.wrap($el).find('.reqd').should('exist')
//             .and('have.value', this.action.actionRow.value);
//         });
//     }
// }

// // Hidden 
// class clHidden extends clProperties {
//     constructor(action: ifActionHandler) {
//         super(false, false, true, action); 
//     }

//     validate(): void {
//         const selector = `.frappe-control[data-fieldname="${this.action.actionRow.field_name}"]`;
//         cy.wait(fnGetDelay('medium'));
//         cy.get(selector)
//             .should('exist') 
//             .should('not.be.visible');           
//     }
// }

// export class clPropertiesFactory {
   
//     private static actionsMap: { [key: string]: new  (action: ifActionHandler) => clProperties } = {
//         "Is Read Only": clReadOnly,
//         "Is Mandatory": clMandatory,
//         "Is Hidden": clHidden,
//     };

    
//     static create(propertyType: string, action: ifActionHandler): clProperties {
//         const PropertyClass = this.actionsMap[propertyType];
//         if (!PropertyClass) {
//             throw new Error(`Unknown property type: ${propertyType}`);
//         }
//         return new PropertyClass(action);
//     }
// }
import { fnGetDelay } from "./delay";

// Property Interface
export interface ifProperties {
    is_read_only: boolean;
    is_mandatory: boolean;
    is_hidden: boolean;
    action: ifActionHandler;
    validate(): void;
}

// Abstract Base Class for Properties
export abstract class clProperties implements ifProperties {
    is_read_only: boolean;
    is_mandatory: boolean;
    is_hidden: boolean;
    action: ifActionHandler;

    constructor(
        is_read_only: boolean,
        is_mandatory: boolean,
        is_hidden: boolean,
        action: ifActionHandler
    ) {
        this.is_read_only = is_read_only;
        this.is_mandatory = is_mandatory;
        this.is_hidden = is_hidden;
        this.action = action;
    }

    abstract validate(): void;
}

// --------- ReadOnly Property
class clReadOnly extends clProperties {
    constructor(action: ifActionHandler) {
        super(true, false, false, action);
    }

    validate(): void {
        const fieldName = this.action.actionRow.field_name;
        const expectedValue = this.action.actionRow.value;

        const selector = `.frappe-control[data-fieldname="${fieldName}"] > .form-group > .control-input-wrapper > .control-value`;

        cy.wait(fnGetDelay("medium"));
        cy.get("body").then(($body) => {
            const body = $body as JQuery<HTMLElement>;
            if (body.find(selector).length > 0) {
                cy.get(selector)
                    .should("be.visible")
                    .and("have.text", expectedValue)
                    .log(`✅ ReadOnly validated for field: ${fieldName}`);
            } else {
                throw new Error(`❌ ReadOnly selector not found: ${selector}`);
            }
        });
    }
}

class clMandatory extends clProperties {
    constructor(action: ifActionHandler) {
        super(false, true, false, action); 
    }

    validate(): void {
        const fieldName = this.action.actionRow.field_name;
        const expectedValue = this.action.actionRow.value;
        const selector = `.frappe-control[data-fieldname="${fieldName}"]`;

        cy.wait(fnGetDelay('medium'));

        // Step 1: Check for the presence of the field
        cy.get(selector)
            .should('exist')
            .log(`✅ Mandatory check: field '${fieldName}' exists`);

        // Step 2: Ensure that the required label (.reqd) is present
        cy.get(selector)
            .find('.control-label.reqd')
            .should('exist')
            .log(`✅ Mandatory check: required indicator is present for '${fieldName}'`);

        // Step 3: Check if the field is an input field or text-based field and validate accordingly
        cy.get(selector)
            .find("input, textarea, .control-value")
            .then(($field) => {
                const element = $field[0]; // Get the DOM element (native element) from the jQuery object
                
                // If the field is an input or textarea, use 'val'
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    cy.wrap($field)
                        .invoke("val")
                        .should("eq", expectedValue)
                        .log(`✅ Mandatory check: field value for '${fieldName}' equals expected '${expectedValue}'`);
                } else {
                    // If it's a text-based field, use 'text'
                    cy.wrap($field)
                        .invoke("text")
                        .should("eq", expectedValue)
                        .log(`✅ Mandatory check: field text for '${fieldName}' equals expected '${expectedValue}'`);
                }
            });
    }
}

// --------- Hidden Property
class clHidden extends clProperties {
    constructor(action: ifActionHandler) {
        super(false, false, true, action);
    }

    validate(): void {
        const fieldName = this.action.actionRow.field_name;
        const selector = `.frappe-control[data-fieldname="${fieldName}"]`;

        cy.wait(fnGetDelay("medium"));
        cy.get("body").then(($body) => {
            const body = $body as JQuery<HTMLElement>;
            if (body.find(selector).length > 0) {
                cy.get(selector)
                    .should('not.be.visible');
                    cy.log(`✅ Hidden validated for field: ${fieldName}`);
            }
        });
    }
}


// --------- Properties Factory
export class clPropertiesFactory {
    private static actionsMap: {[key: string]: new (action: ifActionHandler) => clProperties;} = 
    {
        "Is Read Only": clReadOnly,
        "Is Mandatory": clMandatory,
        "Is Hidden": clHidden,
    };

    static create(propertyType: string, action: ifActionHandler): clProperties {
        const PropertyClass = this.actionsMap[propertyType];
        if (!PropertyClass) {
            throw new Error(`Unknown property type: ${propertyType}`);
        }
        return new PropertyClass(action);
    }
}
