import { clDataTypeFactory } from "./dataType"
/** @class clAction - provides a framework for executing actions on data fields,like ensuring proper validation,.*/
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
    /** @method checkFieldValue  Validates the field value using the assigned data type */
    checkFieldValue(): void {
        this.dataType.validate()    
    }
    /** @method checkFieldProperties Checks field properties such as mandatory constraints*/
    checkFieldProperties(): void {
    }
    /**@method handleNavigator Handles navigation logic for the action.*/
    handleNavigator(): void {
    }
    /**@method handleMessages Processes messages related to the action.*/
    handleMessages(): void{
    }
      /** @method expandSection - Placeholder for expanding a form section. */
    expandSection(): void {
        if (!this.actionData || this.actionData.length === 0) {
            cy.log("No action data available to process.");
            return;
        }
        
        cy.log("Expanding sections:");
        
        // Wait for all sections to be visible before clicking
        cy.get('.section-head') // Use a generic class for section headers
            .each(($sectionHeader) => {
                cy.wrap($sectionHeader) // Wrap each section header
                    .parent() // Get the parent of the section header
                    .then(($parent) => {
                        // Type assertion to indicate $parent is a JQuery object
                        const parent = $parent as JQuery<HTMLElement>;  // Type assertion here
        
                        // Check if the parent is not hidden (i.e., display is not 'none')
                        if (parent.css('display') !== 'none') {
                            cy.wrap($sectionHeader) // If parent is visible, proceed to interact with the section header
                                .wait(1000) // Add a short delay (adjust timing as needed)
                                .click({ force: true }); // Force click to ensure interaction
                        } else {
                            cy.log("Skipping hidden section."); // Log the skipped section
                        }
                    });
            });
    }
    /**@method executeAction Executes the action by processing each action data row.*/
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
/**
 * @class clActionOnLoad Extends `clAction` to handle actions triggered on page load.
 * * Methods:  
 * @method executeAction - Calls the parent method to process all actions on load.  
 * @method checkFieldValue - Validates field values when the form loads.  
 * @method checkFieldProperties - Checks field attributes such as mandatory or read-only status.  
 * @method handleNavigator - Manages navigation-related logic triggered by the OnLoad event.  
 * @method handleMessages - Ensures correct messages are displayed during form load.  
 */
class clActionOnLoad extends clAction {
    action: string
    actionData: TTactionsData
    actionRow: TactionData
    dataType: ifDataType
    executeAction(): void {
        this.expandSection()
        super.executeAction()}
    checkFieldValue(): void {super.checkFieldValue()}
    checkFieldProperties(): void { super.checkFieldProperties()}
    handleNavigator(): void {super.handleNavigator()}
    handleMessages(): void{super.handleMessages()}
    constructor(iAction: string, iaActionData:TTactionsData){
        super(iAction, iaActionData)
        this.actionData = iaActionData
    }
}
/**
 * @class clActionOnChange  Extends `clAction` to handle actions triggered when a field value changes.   
 * @method executeAction - Processes only the first action data row and invokes input handling.  
 * @method checkFieldValue - Validates the new field value after change.  
 * @method checkFieldProperties - Checks if any field properties need to be enforced.  
 * @method handleNavigator - Manages navigation if required after the change.  
 * @method handleMessages - Ensures correct messages are displayed after the change.  
 */
class clActionOnChange extends clAction {
    action: string
    actionData: TactionData[]
    executeAction(): void { 
        this.actionRow = this.actionData[0]
        this.dataType = clDataTypeFactory.createDataType(this.actionData[0].data_type, this) // take only the header datatype
        this.dataType.input()
        this.expandSection()
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
/**
 * @class clActionOnTab Extends `clAction` to handle actions triggered when switching between form tabs.  
 * This class ensures that the necessary actions are executed when a tab is changed.  
 * @method executeAction - Calls the parent method to process actions when switching tabs.  
 * @method checkFieldValue - Validates field values within the newly selected tab.  
 * @method checkFieldProperties - Checks field attributes such as mandatory or read-only status.  
 * @method handleNavigator - Manages any required navigation between form tabs.  
 * @method handleMessages - Ensures correct messages are displayed when switching tabs.  
 */
class clActionOnTab extends clAction {
    action: string
    actionData: TactionData[]
    executeAction(): void { 
        this.expandSection()
        super.executeAction()}
    checkFieldValue(): void {super.checkFieldValue}
    checkFieldProperties(): void {super.checkFieldProperties()}
    handleNavigator(): void {super.handleNavigator()}
    handleMessages(): void{super.handleMessages()} 
    constructor(iAction: string, iaActionData:TTactionsData){
        super(iAction, iaActionData)
        this.actionData = iaActionData
    } 
}
/**
 * @class clActionFactory -A factory class responsible for creating and managing different action objects. 
 * @method createAction - Creates an action instance based on the given action name and data.  
 * @method filterActionData - Filters the action data to process only relevant entries based on position.  
 */
export class clActionFactory { 
    private static actionsMap: { [key:string]: new(iAction: string, iaActionData: TTactionsData )=> clAction}= {
    "Onload": clActionOnLoad,
    "On Change": clActionOnChange,
    "On Tab":clActionOnTab
    };   
    static createAction(iAction: string, iaActionData:TTactionsData): ifActionHandler {
        const LA_ACTIONCLASS = this.actionsMap[iAction];       
        if (!LA_ACTIONCLASS) {
          throw new Error(`Invalid action type: ${iAction}`);
        } 
        return new LA_ACTIONCLASS(iAction=iAction,iaActionData=iaActionData);
      }  
    static filterActionData(iaActionsData:TTactionsData, iActionRow: TactionData): TTactionsData  {
        let lposNext = iActionRow.pos + 10
        const LA_FILTERED_DATA: TTactionsData = iaActionsData.filter((item) => {
            return (item.pos >= iActionRow.pos && item.pos < lposNext);
        });   
        return LA_FILTERED_DATA
    }
};


