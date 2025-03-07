import { clDataTypeFactory } from "./dataType"

abstract class clAction implements ifActionHandler {
    action : string
    actionData: TTactionsData  //Array type for TactionData
    dataType: ifDataType
    actionRow: TactionData
    fieldSlector: string
    fieldProp: string
    constructor(iAction: string, iaActionData:TTactionsData){
        this.actionData = iaActionData
        this.action = iAction
    }

    checkFieldValue(): void {
        this.dataType.validate()    
    }
    checkFieldProperties(): void {
    }
    handleNavigator(): void {
    }
    handleMessages(): void{
    }
    executeAction(): void {   
        this.actionData.forEach((actionDataRow) => {
            if (!actionDataRow.data_type) {
                return; 
            }
            this.actionRow = { ...actionDataRow };
            this.dataType = clDataTypeFactory.createDataType(this.actionRow.data_type, this)
            this.checkFieldValue()
        });
    }
}


class clActionOnLoad extends clAction {
    action: string
    actionData: TTactionsData
    actionRow: TactionData
    dataType: ifDataType
    executeAction(): void {super.executeAction()}
    checkFieldValue(): void {super.checkFieldValue()}
    checkFieldProperties(): void { super.checkFieldProperties()}
    handleNavigator(): void {super.handleNavigator()}
    handleMessages(): void{super.handleMessages()}
    constructor(iAction: string, iaActionData:TTactionsData){
        super(iAction, iaActionData)
        this.actionData = iaActionData
    }
}

class clActionOnChange extends clAction {
    action: string
    actionData: TactionData[]
    executeAction(): void { 
        this.actionRow = this.actionData[0]
        this.dataType = clDataTypeFactory.createDataType(this.actionData[0].data_type, this) // take only the header datatype
        this.dataType.input()
        super.executeAction()
    }
    checkFieldValue(): void {super.checkFieldValue()}
    checkFieldProperties(): void {super.checkFieldProperties()}
    handleNavigator(): void {super.handleNavigator()}
    handleMessages(): void{super.handleMessages()} 
    constructor(iAction: string, iaActionData:TTactionsData){
        super(iAction, iaActionData)
        this.actionData = iaActionData
    }
}

class clActionOnTab extends clAction {
    action: string
    actionData: TactionData[]
    executeAction(): void { super.executeAction()}
    checkFieldValue(): void {super.checkFieldValue}
    checkFieldProperties(): void {super.checkFieldProperties()}
    handleNavigator(): void {super.handleNavigator()}
    handleMessages(): void{super.handleMessages()} 
    constructor(iAction: string, iaActionData:TTactionsData){
        super(iAction, iaActionData)
        this.actionData = iaActionData
    } 
}

export class clActionFactory { 
    private static actionsMap: { [key:string]: new(iAction: string, iaActionData: TTactionsData )=> clAction}= {
    "Onload": clActionOnLoad,
    "On Change": clActionOnChange,
    "On Tab":clActionOnTab
    };   
    static createAction(iAction: string, iaActionData:TTactionsData): ifActionHandler {
        const ActionClass = this.actionsMap[iAction];       
        if (!ActionClass) {
          throw new Error(`Invalid action type: ${iAction}`);
        } 
        return new ActionClass(iAction=iAction,iaActionData=iaActionData);
      }  
    static filterActionData(iaActionsData:TTactionsData, iActionRow: TactionData): TTactionsData  {
        let lposNext = iActionRow.pos + 10
        const filteredData: TTactionsData = iaActionsData.filter((item) => {
            return (item.pos >= iActionRow.pos && item.pos < lposNext);
        });   
        return filteredData
    }
};


