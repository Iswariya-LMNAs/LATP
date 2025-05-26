import { clDataTypeFactory } from "./dataType";
import { clPropertiesFactory } from "./properties";
import { fnGetDelay } from "../src/delay";

/** @class clAction - Base abstract class for executing actions on data fields. */
abstract class clAction implements ifActionHandler {
    action: string;
    actionData: TTactionsData;
    dataType: ifDataType;
    actionRow: TactionData;
    fieldSlector: string;
    fieldProp: string;

    constructor(iAction: string, iaActionData: TTactionsData) {
        this.actionData = iaActionData;
        this.action = iAction;
    }
    checkFieldValue(): void {
        this.dataType.validate();
    }
    checkFieldProperties(): void {
        const propertyValidators = clPropertiesFactory.createAllFor(this);
        propertyValidators.forEach((validator) => validator.validate());  
    }    
    executeAction(): void {
    const groupTab = this.actionData.reduce((acc, row) => {
     const Tab = row.tab || " ";
      (acc[Tab] ||= []).push(row);
      return acc; 
    }, []);
    Object.entries(groupTab).forEach(([tabName, rows]) => {
        if (tabName !== " ") {
            const tabClick = clActionFactory.createAction("On Tab", [rows[0]]);
            tabClick.executeAction();
        }
        rows.forEach(row => {
            if (!row.data_type) return;
            this.actionRow = row;
            this.dataType = clDataTypeFactory.createDataType(row.data_type, this);
            this.checkFieldValue();
            this.checkFieldProperties();
            });
        });
    }
}
/** @class clActionExpandSection Standalone class to expand all UI sections */
class clActionExpandSection extends clAction {
    constructor(iAction: string, iaActionData: TTactionsData) {
               super(iAction, iaActionData);
             }  
         executeAction(): void {
            this.actionRow = this.actionData[0];
            if (this.actionRow.tab) {
                const tabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
                tabClick.executeAction();
            }
            const sectionTitle = this.actionRow?.section;
            if (!sectionTitle) {
                return;
            }
            cy.get('.section-head').each(($el) => {
            const text = Cypress.$($el).text().trim();
            if (text === sectionTitle) {
            const $parent = Cypress.$($el).parent();
            const isCollapsed = $parent.find('.section-body').css('display') === 'none';
            if (isCollapsed) {
                cy.wrap($el).wait(fnGetDelay("medium")).click({ force: true });} 
            }
            });
            this.actionData.forEach(row => {
                if (!row.data_type) return;
                this.actionRow = row;
                this.dataType = clDataTypeFactory.createDataType(row.data_type, this, row);
                this.checkFieldValue();
            });
     }                      
}

/** @class clActionOnLoad - Handles actions on page load. */
class clActionOnLoad extends clAction {
    executeAction(): void { super.executeAction()}
    checkFieldValue(): void { super.checkFieldValue(); }
    checkFieldProperties(): void { super.checkFieldProperties(); }
    constructor(iAction: string, iaActionData: TTactionsData) {
        super(iAction, iaActionData);
    }
}
/** @class clActionOnChange - Handles actions like On Change */
class clActionOnChange extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {
            const tabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            tabClick.executeAction();
        }
         if (this.actionRow.is_child) {
            const childAction = new clActionOnChangeChild(this.action, this.actionData);
            childAction.executeAction();
            return;
        }
        this.dataType = clDataTypeFactory.createDataType(this.actionRow.data_type, this);
        this.dataType.input();
        // new clActionExpandSection().executeAction();
        super.executeAction();
    }
    constructor(iAction: string, iaActionData: TTactionsData) {
        super(iAction, iaActionData);
    }
}
class clActionOnChangeChild extends clActionOnChange{
   executeAction(): void {
    this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {
            const tabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            tabClick.executeAction();
        }
        this.dataType = clDataTypeFactory.createDataType(this.actionRow.data_type, this);
        this.dataType.input();
        this.actionData.forEach(row => {
            if (!row.data_type) return;
            this.actionRow = row;
            this.dataType = clDataTypeFactory.createDataType(row.data_type, this, row);
            this.checkFieldValue();
        });
   }
}
class clActionAddRow extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if(this.actionRow.tab){
            const tabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            tabClick.executeAction();
        }
        cy.get(`[data-fieldname="${this.actionRow.child_name}"]`, { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .within(() => {
                cy.contains('button', 'Add Row', { matchCase: false })
                    .should('be.visible')
                    .click({ force: true });
            });
            this.actionData.forEach(row => {
                if (!row.data_type) return;
                this.actionRow = row;
                this.dataType = clDataTypeFactory.createDataType(row.data_type, this, row);
                this.checkFieldValue();
            });
    }
}
class clActionEditDetails extends clAction{
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {
            const tabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            tabClick.executeAction();
        }
        const rowIndex = (this.actionRow.child_index || 1) - 1;
        const childSelector = `[data-fieldname="${this.actionRow.child_name}"] .grid-body .grid-row`;
        cy.get(childSelector).eq(rowIndex).within(() => {
            cy.get('.btn-open-row').first().click({ force: true });
        });
        cy.wait(fnGetDelay("medium"));
        this.actionData.forEach(row => {
            if (!row.data_type) return;
            this.actionRow = row;
            this.dataType = clDataTypeFactory.createDataType(row.data_type, this, row);
            this.checkFieldValue();
        });
        cy.get(childSelector).eq(rowIndex).within(() => {
            cy.get('.btn-open-row').first().click({ force: true });
        });
    }
}
/** @class clActionOnTab - Handles tab switching. */
class clActionOnTab extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        const tab = this.actionRow.tab;
        if (!tab) return;
        cy.get('.form-tabs .nav-item a').filter(`:contains("${tab}")`).first().click({ force: true });
        cy.wait(fnGetDelay('medium'));
    }
    constructor(iAction: string, iaActionData: TTactionsData) {
        super(iAction, iaActionData);
    }
}

/** @class clActionFactory - Factory for creating action instances */
export class clActionFactory {
    private static actionsMap: {
        [key: string]: new (iAction: string, iaActionData: TTactionsData) => clAction } = {
        "Onload": clActionOnLoad,
        "On Change": clActionOnChange,
        "On Tab": clActionOnTab,
        "Add Row": clActionAddRow,
        "Edit Details": clActionEditDetails,
        "Expand Section": clActionExpandSection,
    };
    static createAction(iAction: string, iaActionData:TTactionsData): ifActionHandler {
        const LA_ACTIONCLASS = this.actionsMap[iAction];       
        if (!LA_ACTIONCLASS) {
          throw new Error(`Invalid action type: ${iAction}`);
        } 
        return new LA_ACTIONCLASS(iAction=iAction,iaActionData=iaActionData);
      }    
    static filterActionData(iaActionsData: TTactionsData, iActionRow: TactionData): TTactionsData {
        const lposNext = iActionRow.pos + 10;
        return iaActionsData.filter((item) => (
            item.pos >= iActionRow.pos && item.pos < lposNext
        ));
    }
}
