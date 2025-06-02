import { property } from "cypress/types/lodash";
import { fnGetDelay } from "../src/delay";
import { clPropertiesFactory } from "./properties";

/**
 * @class clDataType -Abstract base class for handling different data types.  
 * @method validate - Abstract method for validation logic.  
 * @method input - Abstract method for input handling.  
 * @method execute - Abstract method for executing actions.  
 * @method getSelector - Returns the field selector string.  
 */
abstract class clDataType implements ifDataType {
    dataType: string;
    action: ifActionHandler;
    fieldSlector: string
    fieldProp: string
    constructor(iDataType: string, ioAction: ifActionHandler) {
        this.dataType = iDataType;
        this.action = ioAction;
        this.fieldSlector = `[data-fieldname="${this.action.actionRow.field_name}"]`;
    }
    abstract validate(): void 
    abstract input(): void 
    getSelector(): string{
        return `${this.fieldSlector}${this.fieldProp}`
    }
}
/** @class clDataTypeData - Handles validation and input actions for generic data types. */
class clDataTypeData extends clDataType {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
        this.fieldProp = `input:visible`
    }
    validate(): void {
    if (this.action.actionRow.is_hidden) {
        return;
    }
    if (this.action.actionRow.is_read_only) {
        this.fieldProp = ' > .form-group > .control-input-wrapper > .control-value';
        cy.get(this.getSelector()).should('exist').and('be.visible').and('have.text', this.action.actionRow.value);
    } else {
        cy.get(this.getSelector()).should('exist').and('be.visible').and('have.value', this.action.actionRow.value);
    }
    }
    input(): void {
        const { value } = this.action.actionRow;
            cy.get(this.getSelector()).wait(fnGetDelay("short")).type(value).wait(fnGetDelay("medium")).should('have.value', value).wait(fnGetDelay("medium"))
            .type('{enter}',{ force: true }) 
            .wait(fnGetDelay("short"));   
    }
}

/** @class clDataTypeDataChild - Handles child data input logic. */
class clDataTypeDataChild extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
    }
       input(): void {
        const { is_child, value, field_name, child_name, child_index} = this.action.actionRow;
        if (!is_child || !child_name) return;
        const rowIndex = child_index ? child_index - 1 : 0;
        const rowSelector = `[data-fieldname="${child_name}"] .grid-body .grid-row`;
        cy.get(rowSelector).eq(rowIndex).within(() => {
            cy.get(`[data-fieldname="${field_name}"]`).then($field => {
                const $el = $field as unknown as JQuery<HTMLElement>;
                const $input = $el.find('input:visible');
                if ($input.length > 0) {
                    cy.wrap($input).should('be.visible').wait(600).first().clear({ force: true }).type(value, { force: true }).wait(100).blur({ force: true });
                } 
                else {
                    cy.wrap($field).dblclick();
                    cy.wait(300); 
                    cy.wrap($field).find('input:visible').should('exist').wait(600).clear({ force: true }).type(value, { force: true }).wait(100).blur({ force: true });
                }
            });
        });
    }
    validate(): void {
        const { is_child, value, field_name, child_name, child_index } = this.action.actionRow;
        if (is_child && child_name) {
            const rowIndex = child_index ? child_index - 1 : 0;
            const rowSelector = `[data-fieldname="${child_name}"] .grid-body .grid-row`;
            cy.get(rowSelector).eq(rowIndex).within(() => {
                cy.get(`[data-fieldname="${field_name}"]`).then($field => {
                    const $el = $field as unknown as JQuery<HTMLElement>;
                    const $input = $el.find('input');
                    if ($input.length) {
                        cy.wrap($input).should('have.value', value);
                    } else {
                        cy.wrap($field).should('contain.text', value);
                    }
                });
            });
        }
    }
}

/** @class clDataTypeLink - Inherits from `clDataTypeData` to handle link-type fields. */
class clDataTypeLink extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) { 
        super(iDataType, ioAction);
    }
}
/** @class clDataTypeSelect - Handles select dropdown fields. */
class clDataTypeSelect extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
        this.fieldProp = `:visible select`
    }
    input(): void {
        cy.get(this.getSelector())
          .wait(fnGetDelay("medium"))
          .select(this.action.actionRow.value, { force: true })
          .wait(fnGetDelay("short"));
    }
}
/** @class clDataTypeSelectChild - Handles child select field logic. */
class clDataTypeSelectChild extends clDataTypeSelect {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
    }
    input(): void {
        const { value, child_name, field_name, child_index } = this.action.actionRow;
        const rowIndex = child_index ? child_index - 1 : 0;
        const rowSelector = `[data-fieldname="${child_name}"] .grid-body .grid-row`;

        cy.get(rowSelector).eq(rowIndex).within(() => {
            cy.get(`[data-fieldname="${field_name}"]`).then($field => {
                const $el = $field as unknown as JQuery<HTMLElement>;
                const $select = $el.find('select:visible');

                if ($select.length) {
                    cy.wrap($select)
                        .select(value, { force: true })
                        .should('have.value', value);
                } else {
                    cy.wrap($field).dblclick();
                    cy.wait(300);
                    cy.wrap($field)
                        .find('select')
                        .should('exist')
                        .select(value, { force: true })
                        .should('have.value', value);
                }
            });
        });
    }
    validate(): void {
        const  {value, child_name, field_name, child_index }= this.action.actionRow;
        const rowIndex = child_index ? child_index - 1 : 0;
        const rowSelector = `[data-fieldname="${child_name}"] .grid-body .grid-row`;
        cy.get(rowSelector).eq(rowIndex).within(() => {
            cy.get(`[data-fieldname="${field_name}"]`).then($field => {
                const $el = $field as unknown as JQuery<HTMLElement>;
                const $select = $el.find('select:visible');

                if ($select.length) {
                    cy.wrap($select).should('have.value', value);
                } else {
                    cy.wrap($field).should('contain.text', value);
                }
            });
        });
    }
}
/** @class clDataTypeDate -Handles date input fields. */
class clDataTypeDate extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
    }
    input(): void {
        const {value} = this.action.actionRow
        cy.get(this.getSelector()).clear().wait(fnGetDelay("short")).type(value).wait(fnGetDelay("short"))
    }
}
/** @class clDataTypeDynamiclink - Handles dynamic link fields. */
class clDataTypeDynamiclink extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
    }
}
/** @class clDataTypeCurrency - Handles currency fields. */
class clDataTypeCurrency extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
        
    }
}
/**
 * 
 * @class clDataTypeFactory - Factory class for creating data type instances.   
 * @method createDataType - Creates a data type instance based on the given type.  
 */
export class clDataTypeFactory {
    private static actionsMap: { [key: string]: new (data_type: string, action: ifActionHandler) => clDataType } = {
        "Data": clDataTypeData,
        "Select": clDataTypeSelect,
        "Link": clDataTypeLink,
        "Date": clDataTypeDate,
        "Dynamic Link": clDataTypeDynamiclink,
        "Currency": clDataTypeCurrency
    };
    static createDataType(data_type: string, actiondata: ifActionHandler, row?: TactionData): clDataType {
        let actualRow = row || actiondata.actionData[0];
        let LA_ACTIONCLASS = this.actionsMap[data_type];
        if (!LA_ACTIONCLASS) {
            throw new Error(`Invalid data type: ${data_type}`);
        }
        if (data_type === "Select" && actualRow.is_child) {
            return new clDataTypeSelectChild(data_type, actiondata);
        }
        let handledChildTypes = ["Data", "Link", "Date", "Dynamic Link", "Currency"];
        if (actualRow.is_child && handledChildTypes.includes(data_type)) {
            return new clDataTypeDataChild(data_type, actiondata);
        }
        return new LA_ACTIONCLASS(data_type, actiondata);
    }
}



