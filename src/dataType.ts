import { fnGetDelay } from "../src/delay";
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
    abstract execute(): void;
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
        // if (this.action.actionRow.is_read_only){this.fieldProp = ' > .form-group > .control-input-wrapper > .control-value'}
        // cy.get(this.getSelector()).should('exist').and('be.visible').wait(3000).and('have.value',this.action.actionRow.value);
        if (this.action.actionRow.is_read_only) {
            this.fieldProp = ' > .form-group > .control-input-wrapper > .control-value';
            cy.get(this.getSelector())
                .should('exist')
                .and('be.visible')
                .and('have.text', this.action.actionRow.value);  // use have.text for read-only fields
        } else {
            // For editable fields, check the input value
            cy.get(this.getSelector())
                .should('exist')
                .and('be.visible')
                .and('have.value', this.action.actionRow.value);
        }
    }
    input(): void {
        cy.get(this.getSelector()).wait(fnGetDelay("medium")).type(this.action.actionRow.value).wait(fnGetDelay("medium")).type('{enter}',{force:true}).wait(fnGetDelay("short"));
    }
    execute(): void {
        this.action.actionRow
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
}
/** @class clDataTypeDate -Handles date input fields. */
class clDataTypeDate extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
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
 * @class clDataTypeFactory - Factory class for creating data type instances.   
 * @method createDataType - Creates a data type instance based on the given type.  
 */
export class clDataTypeFactory {
    private static actionsMap: { [key: string]: new (data_type: string, action: ifActionHandler) => clDataType } = {
        "Data": clDataTypeData,
        "Link" : clDataTypeLink,
        "Select" : clDataTypeSelect, 
        "Date" : clDataTypeDate,
        "Dynamic Link" : clDataTypeDynamiclink,
        "Currency" :clDataTypeCurrency
    };
    static createDataType(data_type: string, actiondata: ifActionHandler): clDataType {
        const LA_ACTIONCLASS = this.actionsMap[data_type];
        if (!LA_ACTIONCLASS) {
            throw new Error(`Invalid data type: ${data_type}`);
        }
        return new LA_ACTIONCLASS(data_type, actiondata);
    }
}