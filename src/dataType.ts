import {ifDataType, ifActionHandler} from "./types"
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
export class clDataTypeData extends clDataType {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
        this.fieldProp = `input:visible`
    }
    validate(): void {   
        cy.get(this.getSelector()).should('exist').and('be.visible');
    }
    input(): void {
        cy.get(this.getSelector()).wait(2000).type(this.action.actionRow.value);
    }
    execute(): void {
        this.action.actionRow
    }
}
 export class clDataTypeLink extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) { 
        super(iDataType, ioAction);
    }
}
export class clDataTypeSelect extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
        this.fieldProp = `:visible select`
    }

}
export class clDataTypeDate extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
    }
}
export class clDataTypeDynamiclink extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
    }

}
export class clDataTypeCurrency extends clDataTypeData {
    constructor(iDataType: string, ioAction: ifActionHandler) {
        super(iDataType, ioAction);
        
    }
}
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
        const ActionClass = this.actionsMap[data_type];
        if (!ActionClass) {
            throw new Error(`Invalid data type: ${data_type}`);
        }
        return new ActionClass(data_type, actiondata);
    }
}
